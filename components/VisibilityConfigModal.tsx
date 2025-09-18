import React, { useState } from 'react';
import type { ClosingStage, RoleVisibilitySettings, ConfigurableRole } from '../types';
import { EyeIcon } from './icons';

interface VisibilityConfigModalProps {
    onClose: () => void;
    onSave: (newSettings: RoleVisibilitySettings) => void;
    currentSettings: RoleVisibilitySettings;
    activeStages: ClosingStage[];
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ label, enabled, onChange }) => (
    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer">
        <span className="font-medium text-gray-700">{label}</span>
        <div className="relative inline-flex items-center">
            <input 
                type="checkbox" 
                checked={enabled} 
                onChange={(e) => onChange(e.target.checked)} 
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </div>
    </label>
);

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 ${
            isActive
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
        }`}
    >
        {label}
    </button>
);


export const VisibilityConfigModal: React.FC<VisibilityConfigModalProps> = ({ onClose, onSave, currentSettings, activeStages }) => {
    const [settings, setSettings] = useState(currentSettings);
    const [activeTab, setActiveTab] = useState<ConfigurableRole>('Agent');
    
    const roles: ConfigurableRole[] = ['Agent', 'Buyer', 'Seller'];

    const handleToggle = (stageId: string, enabled: boolean) => {
        setSettings(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [stageId]: enabled,
            }
        }));
    };

    const handleSave = () => {
        onSave(settings);
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
                        <EyeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Configure Role Visibility</h2>
                        <p className="text-gray-500">Choose which steps are visible to external participants.</p>
                    </div>
                </div>
                
                <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        {roles.map(role => (
                            <TabButton 
                                key={role}
                                label={role}
                                isActive={activeTab === role}
                                onClick={() => setActiveTab(role)}
                            />
                        ))}
                    </nav>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {activeStages.map(stage => (
                        <ToggleSwitch
                            key={stage.id}
                            label={stage.title}
                            enabled={settings[activeTab]?.[stage.id] ?? false}
                            onChange={(enabled) => handleToggle(stage.id, enabled)}
                        />
                    ))}
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