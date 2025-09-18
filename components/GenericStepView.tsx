import React from 'react';

interface GenericStepViewProps {
  title: string;
}

export const GenericStepView: React.FC<GenericStepViewProps> = ({ title }) => {
  return (
    <div className="text-center py-20 px-6 bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
      <p className="text-gray-500 max-w-md">
        The user interface and functionality for this step are currently under development.
        Relevant information and actions will be available here soon.
      </p>
    </div>
  );
};
