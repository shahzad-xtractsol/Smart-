
import React, { useState } from 'react';
import { MOCK_DETAIL_DATA } from '../../constants';
import type { PropertyDetails } from '../../types';

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="mb-3">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-md text-gray-800">{value}</p>
  </div>
);

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
    </div>
);


export const Step2PropertyDetails: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [propertyData, setPropertyData] = useState<PropertyDetails>(MOCK_DETAIL_DATA.propertyDetails);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof PropertyDetails, nestedField?: keyof PropertyDetails['address'] | keyof PropertyDetails['dwellingCharacteristics']) => {
        const { value } = e.target;
        if (nestedField && (field === 'address' || field === 'dwellingCharacteristics')) {
            setPropertyData(prev => ({ 
                ...prev, 
                [field]: { 
                    ...prev[field], 
                    [nestedField]: value 
                } 
            }));
        } else if (!nestedField) {
             const key = field as Exclude<keyof PropertyDetails, 'address' | 'dwellingCharacteristics'>;
             setPropertyData(prev => ({ 
                ...prev, 
                [key]: value 
            }));
        }
    }

    const { currentOwner, parcelId, address, taxDistrict, appraisedValue, landValue, buildingValue, propertyType, dwellingCharacteristics } = propertyData;

    return (
        <div>
            <div className="flex justify-end mb-4">
                 <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">
                    {isEditing ? 'Cancel' : 'Edit Information'}
                </button>
            </div>
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div>
                  <DetailItem label="Current Owner" value={currentOwner} />
                  <DetailItem label="Parcel ID" value={parcelId} />
                  <DetailItem label="Property Address" value={`${address.street}, ${address.city}, ${address.state} ${address.zip}`} />
                  <DetailItem label="Tax District" value={taxDistrict} />
                  <DetailItem label="Appraised Value (2024)" value={`${appraisedValue} (Land: ${landValue}, Building: ${buildingValue})`} />
                </div>
                <div>
                  <DetailItem label="Property Type" value={propertyType} />
                  <h3 className="text-sm font-medium text-gray-500 mt-4 mb-1">Dwelling Characteristics:</h3>
                  <ul className="list-disc list-inside text-md text-gray-800 pl-2">
                      <li>Year Built: {dwellingCharacteristics.yearBuilt}</li>
                      <li>Total Finished Area: {dwellingCharacteristics.finishedArea}</li>
                      <li>Bedrooms: {dwellingCharacteristics.bedrooms}</li>
                      <li>Bathrooms: {dwellingCharacteristics.bathrooms}</li>
                      <li>Lot Size: {dwellingCharacteristics.lotSize}</li>
                  </ul>
                </div>
              </div>
            ) : (
                <div className="space-y-4">
                   <InputField label="Current Owner" value={currentOwner} onChange={(e) => handleInputChange(e, 'currentOwner')} />
                   <InputField label="Parcel ID" value={parcelId} onChange={(e) => handleInputChange(e, 'parcelId')} />
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <InputField label="Street" value={address.street} onChange={(e) => handleInputChange(e, 'address', 'street')} />
                     <InputField label="City" value={address.city} onChange={(e) => handleInputChange(e, 'address', 'city')} />
                     <InputField label="State" value={address.state} onChange={(e) => handleInputChange(e, 'address', 'state')} />
                   </div>
                   <InputField label="Zip/Post Code" value={address.zip} onChange={(e) => handleInputChange(e, 'address', 'zip')} />
                   <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">
                     Save Changes
                   </button>
                </div>
            )}
          </div>
    );
};
