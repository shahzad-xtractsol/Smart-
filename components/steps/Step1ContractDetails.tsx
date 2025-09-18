
import React, { useEffect, useState } from 'react';
import PdfViewer from '../PdfViewer';
import { OrderDetailsView } from '../OrderDetailsView';
import titleSearchService from '../../lib/services/titleSearch.service';
import CircularLoader from '../CircularLoader';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-4 border-b border-gray-200 last:border-b-0">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    {children}
  </div>
);

type Props = {
  titleSearchId?: string;
};

export const Step1ContractDetails: React.FC<Props> = ({ titleSearchId: propId }) => {
  const titleSearchId = propId ?? '854';
  const [loading, setLoading] = useState(false);
  const [propertyData, setPropertyData] = useState<any | null>(null);
  const [contractDoc, setContractDoc] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!titleSearchId) return;
        setLoading(true);
        const res = await titleSearchService.getTitleSearchOrder(titleSearchId);
        const data = res?.data ?? res;
        console.log('Fetched title search data:', data);
        setPropertyData(data);
        setContractDoc(data?.purchaseContract?.documentPath || null);
      } catch (e) {
        console.error('Failed to load title search', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [titleSearchId]);

  if (loading) {
      return (
          <CircularLoader />
        
      );
    }
  return (
    <>
      <Section title="Purchase Contract">
        <PdfViewer pdfUrl={contractDoc} title="Purchase_Contract.pdf" />
      </Section>
      {/* <Section title="Sale Price">
        <p className="text-gray-600">Details about the sale price will be displayed here once available.</p>
      </Section> */}
      
        <OrderDetailsView propertyData={propertyData} />
      
    </>
  );
};