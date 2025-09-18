import React from 'react';
import { DownloadIcon, RefreshIcon, EditIcon } from './icons';

export const TitleSearchDataView: React.FC = () => {
    return (
        <div className="bg-gray-50 -m-8 h-full">
            <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Title Search Data</h2>
                    <p className="text-sm text-gray-500"><span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2"></span>In Progress</p>
                </div>
                 <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        <DownloadIcon className="w-4 h-4" /><span>Download Purchase Contract</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        <RefreshIcon className="w-4 h-4" /><span>Re-run Order</span>
                    </button>
                     <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        <EditIcon className="w-4 h-4" /><span>Update Order</span>
                    </button>
                </div>
            </header>
            
            <div className="p-8">
                <div className="text-center py-20 px-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Title Search In Progress</h2>
                  <p className="text-gray-500 max-w-md mx-auto">
                    The title search data is currently being processed. This view will be populated with property details, owner information, and more once the search is complete.
                  </p>
                </div>
            </div>
        </div>
    );
};