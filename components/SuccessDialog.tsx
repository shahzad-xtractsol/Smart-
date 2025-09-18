import React from 'react';
import DialogModelTemplate from './DialogModelTemplate';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ isOpen, onClose, title, message }) => {
  return (
    <DialogModelTemplate
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      primaryLabel="OK"
      onSave={onClose}
      secondaryLabel=""
    >
      <div className="p-4 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
    </DialogModelTemplate>
  );
};

export default SuccessDialog;