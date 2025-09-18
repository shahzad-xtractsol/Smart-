

import React from 'react';

const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
        {children}
    </div>
);

export const Step3MortgageLiens: React.FC = () => {
    return (
         <div className="text-center py-20 px-6 bg-white rounded-lg border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Mortgage & Liens</h2>
            <p className="text-gray-500 max-w-md">
               Information about active mortgage liens and payoff requests will be displayed here once the title search is complete.
            </p>
        </div>
    );
};