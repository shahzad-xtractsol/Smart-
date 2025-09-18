import React, { useState } from 'react';

interface AgentInformationFormProps {
    onSubmit: () => void;
    propertyAddress: string;
}

const InputField: React.FC<{ id: string, label: string, type?: string, placeholder: string, required?: boolean }> = 
    ({ id, label, type = 'text', placeholder, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholder}
            required={required}
        />
    </div>
);

export const AgentInformationForm: React.FC<AgentInformationFormProps> = ({ onSubmit, propertyAddress }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Agent Information Required</h1>
                <p className="text-gray-600 mt-2">
                    To access the closing space for <span className="font-semibold text-blue-600">{propertyAddress}</span>, please submit your information.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField id="fullName" label="Full Name" placeholder="John Doe" />
                    <InputField id="licenseNumber" label="Real Estate License #" placeholder="123456789" />
                </div>
                <InputField id="brokerage" label="Brokerage Firm" placeholder="Prestige Real Estate" />
                <InputField id="email" label="Email Address" type="email" placeholder="john.doe@email.com" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField id="phone" label="Phone Number" type="tel" placeholder="(555) 123-4567" />
                    <InputField id="officeAddress" label="Office Address" placeholder="456 Brokerage Lane" />
                </div>
                <div className="pt-4">
                     <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Submit & Enter Closing Space
                    </button>
                </div>
            </form>
        </div>
    );
};