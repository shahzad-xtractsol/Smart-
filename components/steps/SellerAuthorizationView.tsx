import React from 'react';
import type { Property, AuthorizationData } from '../../types';
import { EditIcon, CheckCircleIcon } from '../icons';

interface SellerAuthorizationViewProps {
    property: Property;
    onUpdateProperty: (property: Property) => void;
}

const AuthorizationPending: React.FC<{ onAuthorize: () => void }> = ({ onAuthorize }) => (
    <div className="text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col items-center justify-center">
        <div className="bg-orange-100 p-4 rounded-full mb-4">
            <EditIcon className="w-12 h-12 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Seller Authorization Pending</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            The seller needs to authorize the release of information. Click below to simulate sending the authorization form for signature.
        </p>
        <button
            onClick={onAuthorize}
            className="inline-flex items-center space-x-2 px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
        >
            <span>Send for Signature</span>
        </button>
    </div>
);

const AuthorizationSubmitted: React.FC<{ data: Property['sellerAuthorizationData'] }> = ({ data }) => {
    if (!data) return <p>No authorization data available.</p>;

    return (
        <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
             <div className="text-center mb-6">
                <div className="flex justify-center items-center mb-4">
                    <div className="bg-teal-100 p-4 rounded-full">
                        <CheckCircleIcon className="w-12 h-12 text-teal-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Authorization Complete</h2>
                <p className="text-gray-500 mt-1">The seller has authorized the transaction to proceed.</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Authorized By</span>
                    <span className="font-semibold text-gray-800">{data.authorizedBy}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Date/Time</span>
                    <span className="font-semibold text-gray-800">{data.authorizedAt}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Signed Document</span>
                    <a href={data.documentUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                        View Document
                    </a>
                </div>
            </div>
        </div>
    );
};

export const SellerAuthorizationView: React.FC<SellerAuthorizationViewProps> = ({ property, onUpdateProperty }) => {

    const handleAuthorize = () => {
        const authorizationData: AuthorizationData = {
            authorizedBy: 'Christopher Sauerzopf (Seller)', // Placeholder name
            authorizedAt: new Date().toLocaleString(),
            documentUrl: '#',
        };
        onUpdateProperty({
            ...property,
            sellerAuthorizationStatus: 'Submitted',
            sellerAuthorizationData: authorizationData,
        });
    };

    return (
        <div>
            {property.sellerAuthorizationStatus === 'Pending' ? (
                <AuthorizationPending onAuthorize={handleAuthorize} />
            ) : (
                <AuthorizationSubmitted data={property.sellerAuthorizationData} />
            )}
        </div>
    );
};