import React, { useState } from 'react';
import type { ClosingStage, ClosingProgressItem } from '../types';
import { SettingsIcon } from './icons';

interface WorkflowConfigModalProps {
    onClose: () => void;
    onSave: (newOptions: Record<string, boolean>) => void;
    currentOptions: Record<string, boolean>;
    optionalStages: ClosingStage[];
    closingProgress: Record<string, ClosingProgressItem>;
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; isDisabled: boolean }> = ({ label, enabled, onChange, isDisabled }) => (
    <label className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 transition-opacity ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}>
        <span className="font-medium text-gray-700">{label}</span>
        <div className="relative inline-flex items-center">
            <input 
                type="checkbox" 
                checked={enabled} 
                onChange={(e) => !isDisabled && onChange(e.target.checked)} 
                className="sr-only peer"
                disabled={isDisabled}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </div>
    </label>
);

export const WorkflowConfigModal: React.FC<WorkflowConfigModalProps> = ({ onClose, onSave, currentOptions, optionalStages, closingProgress }) => {
    const [options, setOptions] = useState(currentOptions);

    const handleToggle = (stageId: string, enabled: boolean) => {
        setOptions(prev => ({ ...prev, [stageId]: enabled }));
    };

    const handleSave = () => {
        onSave(options);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg transform transition-all">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <SettingsIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Configure Workflow</h2>
                        <p className="text-gray-500">Enable or disable optional steps for this closing file.</p>
                    </div>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {optionalStages.map(stage => {
                        const progressItem = closingProgress[stage.id];
                        const isDisabled = progressItem?.status === 'Completed' || progressItem?.status === 'In Progress';
                        return (
                            <ToggleSwitch
                                key={stage.id}
                                label={stage.title}
                                enabled={options[stage.id] ?? false}
                                onChange={(enabled) => handleToggle(stage.id, enabled)}
                                isDisabled={isDisabled}
                            />
                        );
                    })}
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};