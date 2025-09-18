import React, { useEffect } from 'react';
import { UploadCloudIcon } from '../icons';
import { CLOSING_STAGES } from '../../constants';
import titleSearchService from '../../lib/services/titleSearch.service';
import { Step1ContractDetails } from './Step1ContractDetails';

interface StepActionPlaceholderProps {
  stageId: string;
  onStartStep: (stageId: string, docId?: string | null) => void;
  titleSearchId?: string | number;
}

const UploadContract: React.FC<{
  onStartStep: (uploadedDocId?: string | null) => void;
  stageId?: string;
  titleSearchId?: string | number | null;
}> = ({ onStartStep, titleSearchId }) => {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFile = async (file?: File) => {
    setError(null);
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file as any);

      // uploadPurchaseAgreement returns a Promise with data shape { data: { pc, stakeholders, docId, address } }
      const res = await titleSearchService.uploadPurchaseAgreement(formData);
      const payload = res?.data ?? res;
      console.log('Upload response:', payload);
      // If the backend returned purchase contract data (pc) and a docId, persist it to the title search
      const pc = payload?.pc ?? null;
      const docId = payload?.docId ?? payload?.data?.docId ?? null;

      // Prefer updatePC if available, otherwise updateTitleSearch
      if (payload && (docId || pc)) {
        try {
          // Try updatePC first (endpoint: /title-search/update/purchase-contract/:id)
          if (titleSearchId) {
          const res=  await titleSearchService.updatePC(titleSearchId, { ...pc, docId });
          console.log('updatePC response:', res);
          }
        } catch (err) {
          // Non-fatal: log and continue — caller UI will refresh from server later
          console.warn('Failed to call updatePC', err);
        }
      }

      // If stakeholders are returned, we don't attempt to map reactive forms here; parent views will re-fetch.

      // call onStartStep with the new docId so parent can advance and refresh UI
      onStartStep(docId);
    } catch (e: any) {
      console.error('Upload failed', e);
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files && e.target.files[0];
    void handleFile(file);
  };

  return (
    <div className="text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Upload Purchase Contract</h2>
      <p className="text-gray-500 mb-8 max-w-md">To begin this step, please upload the signed purchase contract. This will be used to populate the contract details.</p>

      <label className="w-full max-w-lg p-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 mb-4 cursor-pointer">
        <UploadCloudIcon className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-700 font-semibold">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500 mt-1">PDF, DOCX, or JPG (max. 10MB)</p>
        <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg" onChange={onInputChange} className="hidden" />
      </label>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <button
        onClick={() => onStartStep(undefined)}
        disabled={uploading}
        className={`px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {uploading ? 'Uploading...' : 'Upload Purchase Contract'}
      </button>
    </div>
  );
};

const GenericStartStep: React.FC<{ stageTitle: string; onStartStep: () => void }> = ({ stageTitle, onStartStep }) => (
    <div className="text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{stageTitle}</h2>
        <p className="text-gray-500 mb-8 max-w-md">This step has not been started yet. Click the button below to begin.</p>

        <button
            onClick={onStartStep}
            className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
        >
            Start Step
        </button>
    </div>
);


export const StepActionPlaceholder: React.FC<StepActionPlaceholderProps> = ({ stageId, onStartStep, titleSearchId=854 }) => {
    const stage = CLOSING_STAGES.find(s => s.id === stageId);
    if (!stage) return <div className="p-8">Stage not found.</div>;

    const handleStart = () => {
  onStartStep(stageId);
    };

    if (stageId === 'purchaseContract') {
      const [loading, setLoading] = React.useState(false);
      const [contractDoc, setContractDoc] = React.useState<string | null>(null);
      useEffect(() => {
        const load = async () => {
          try {
            if (!titleSearchId) return;
            setLoading(true);
            const res = await titleSearchService.getTitleSearchOrder(titleSearchId);
            const data = res?.data ?? res;
            // store whether a contract doc exists for this title search
            setContractDoc(data?.purchaseContract?.documentPath || null);
          } catch (e) {
            console.error('Failed to load title search', e);
          } finally {
            setLoading(false);
          }
        };
        void load();
      }, [titleSearchId]);

      if (loading) {
        return (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
          </div>
        );
      }
      console.log('contractDoc', contractDoc);
      // If a contract document is already present, render the contract details view instead of upload
      if (contractDoc!==null) {
        return <Step1ContractDetails titleSearchId={titleSearchId as any} />;
      }

      // otherwise show the upload flow
      return <UploadContract onStartStep={(docId) => onStartStep(stageId, docId)} titleSearchId={titleSearchId} />;
    }

    return <GenericStartStep stageTitle={stage.title} onStartStep={handleStart} />;
};