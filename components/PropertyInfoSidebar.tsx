import React, { useState } from 'react';
import type { Property, User } from '../types';
import { UsersIcon, MessageSquareIcon, InfoIcon, BedIcon, BathIcon, RulerIcon, MoneyIcon, EditIcon, ArchiveIcon, DocumentIcon } from './icons';
import { ChatPanel } from './ChatPanel';
import { DocumentsView } from './DocumentsView';
interface PropertyInfoSidebarProps {
    property: Property;
    currentUser: User;
    onArchiveProperty: (id: number) => void;
}

type ActiveTab = 'details' | 'participants' | 'chat' | 'documents';

const PropertyStat: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3 text-left">
        <div className="text-gray-500">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    </div>
);

const statusColors: Record<Property['status'], string> = {
  'In Progress': 'bg-orange-100 text-orange-800',
  'Draft': 'bg-gray-200 text-gray-700',
  'In Review': 'bg-yellow-100 text-yellow-800',
  'Closed': 'bg-green-100 text-green-800',
};

export const PropertyInfoSidebar: React.FC<PropertyInfoSidebarProps> = ({ property, currentUser, onArchiveProperty }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('details');

    const TabButton: React.FC<{tabName: ActiveTab, icon: React.ReactNode, label: string}> = ({ tabName, icon, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex-1 flex flex-col items-center justify-center p-3 text-sm font-semibold border-b-4 transition-colors duration-200 ${
                activeTab === tabName ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:bg-gray-100'
            }`}
            aria-label={`Show ${label}`}
        >
            {icon}
            <span className="mt-1">{label}</span>
        </button>
    );

    return (
        <aside className="bg-white border-l border-gray-200 flex flex-col h-full">
            <div className="flex border-b border-gray-200">
                <TabButton tabName="details" icon={<InfoIcon className="w-5 h-5"/>} label="Details"/>
                <TabButton tabName="participants" icon={<UsersIcon className="w-5 h-5"/>} label="Participants"/>
                <TabButton tabName="chat" icon={<MessageSquareIcon className="w-5 h-5"/>} label="Chat"/>
                <TabButton tabName="documents" icon={<DocumentIcon className="w-5 h-5"/>} label="Documents"/>
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'details' && (
                    <div className="p-6">
                        <img src={property.imageUrl} alt={property.address} className="w-full h-48 object-cover rounded-lg mb-4" />
                        <div className="flex justify-between items-start mb-4">
                             <div>
                                <h1 className="text-xl font-bold text-gray-900">{property.address}</h1>
                                <p className="text-gray-500 mt-1 text-sm">{property.location}</p>
                             </div>
                             <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${statusColors[property.status]}`}>
                                {property.status}
                            </span>
                         </div>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 my-6">
                            <PropertyStat icon={<MoneyIcon className="w-5 h-5" />} label="Price" value={property.price || 'N/A'} />
                            <PropertyStat icon={<BedIcon className="w-5 h-5" />} label="Beds" value={property.beds} />
                            <PropertyStat icon={<BathIcon className="w-5 h-5" />} label="Baths" value={property.baths} />
                            <PropertyStat icon={<RulerIcon className="w-5 h-5" />} label="Sqft" value={`${property.sqft.toLocaleString()}`} />
                        </div>
                        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">
                            <EditIcon className="w-4 h-4" />
                            <span>Edit Details</span>
                        </button>
                        {currentUser.role === 'Title Admin' && property.status !== 'Closed' && !property.isArchived && (
                            <button
                                onClick={() => onArchiveProperty(property.id)}
                                className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-amber-800 bg-amber-100 rounded-md shadow-sm hover:bg-amber-200"
                            >
                                <ArchiveIcon className="w-4 h-4" />
                                <span>Archive Space</span>
                            </button>
                        )}
                    </div>
                )}
                {activeTab === 'participants' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Participants</h3>
                            <button className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Invite</button>
                        </div>
                        <ul className="space-y-4">
                            {property.participants.map(user => (
                                <li key={user.id} className="flex items-center space-x-3">
                                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.role}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {activeTab === 'chat' && (
                    <div className="p-6 h-full">
                        <ChatPanel messages={[]} currentUser={currentUser} participants={property.participants}/>
                    </div>
                )}
                {activeTab === 'documents' && (
                       <div className="p-4 h-full">
                        <DocumentsView propertyId={property.id} />
                    </div>
                )}
            </div>
        </aside>
    );
};