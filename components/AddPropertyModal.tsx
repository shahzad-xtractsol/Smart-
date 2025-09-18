import React, { useState } from 'react';
import { CLOSING_STAGES } from '../constants';

interface AddPropertyModalProps {
    onClose: () => void;
    onAddProperty: (address: string, location: string, workflowOptions: Record<string, boolean>) => void;
}

const WorkflowOptionCheckbox: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
);


export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ onClose, onAddProperty }) => {
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState('');
    const [workflowOptions, setWorkflowOptions] = useState<Record<string, boolean>>({});

    const optionalStages = CLOSING_STAGES.filter(s => s.optional);

    const handleToggleOption = (stageId: string) => {
        setWorkflowOptions(prev => ({
            ...prev,
            [stageId]: !prev[stageId]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (address && location) {
            onAddProperty(address, location, workflowOptions);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Closing</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 123 Main Street"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">City, State & Zip</label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Anytown, USA 12345"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800">Configure Workflow Steps</h3>
                        <p className="text-sm text-gray-500 mb-4">Select the steps to include in this transaction.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto border p-4 rounded-md bg-gray-50/50">
                            {optionalStages.map(stage => (
                                <WorkflowOptionCheckbox 
                                    key={stage.id}
                                    label={stage.title}
                                    checked={workflowOptions[stage.id] || false}
                                    onChange={() => handleToggleOption(stage.id)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
                        >
                            Add Property
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
