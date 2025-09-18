import React, { useState, useMemo } from 'react';
import type { Property, User } from '../types';
import { SendIcon, BedIcon, BathIcon, RulerIcon, MoneyIcon } from './icons';

interface PropertyListProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onAddNew: () => void;
  currentUser: User;
}

type FilterType = 'All' | 'New' | 'In Progress' | 'Closed' | 'Archived';

const StatusPill: React.FC<{ status: Property['status'] }> = ({ status }) => {
    const styles: Record<Property['status'], string> = {
        'In Progress': 'bg-orange-100 text-orange-800 font-medium',
        'Draft': 'bg-gray-200 text-gray-700 font-medium',
        'In Review': 'bg-yellow-100 text-yellow-800 font-medium',
        'Closed': 'bg-green-100 text-green-800 font-medium',
    };
    return (
        <span className={`px-3 py-1 text-xs rounded-full ${styles[status]}`}>
            {status}
        </span>
    );
};

const PropertyCard: React.FC<{ property: Property; onSelectProperty: (property: Property) => void }> = ({ property, onSelectProperty }) => {
    return (
        <div 
            onClick={() => onSelectProperty(property)}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
        >
            <div className="relative">
                <img src={property.imageUrl} alt={property.address} className="w-full h-40 object-cover" />
                <div className="absolute top-2 right-2">
                    <StatusPill status={property.status} />
                </div>
            </div>
            <div className="p-4">
                <p className="font-semibold text-gray-800 truncate group-hover:text-blue-600">{property.address}</p>
                <p className="text-sm text-gray-500">{property.location}</p>

                <div className="mt-4 flex items-center">
                    <MoneyIcon className="w-5 h-5 text-gray-400 mr-2"/>
                    {property.price ? (
                        <p className="text-lg font-bold text-gray-800">{property.price}</p>
                    ) : (
                        <p className="text-sm text-gray-500">Price not listed</p>
                    )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <BedIcon className="w-5 h-5 text-gray-400"/>
                        <span>{property.beds} beds</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BathIcon className="w-5 h-5 text-gray-400"/>
                        <span>{property.baths} baths</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RulerIcon className="w-5 h-5 text-gray-400"/>
                        <span>{property.sqft} sqft</span>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-right">Added: {property.startedAt}</p>
            </div>
        </div>
    );
};

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; count: number; }> = ({ label, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md flex items-center space-x-2 ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
    >
        <span>{label}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-blue-500' : 'bg-gray-200 text-gray-700'}`}>
            {count}
        </span>
    </button>
);


export const PropertyList: React.FC<PropertyListProps> = ({ properties, onSelectProperty, onAddNew, currentUser }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  
  const visibleProperties = currentUser.role === 'Title Abstractor'
    ? properties.filter(p => 
        Object.values(p.closingProgress).some(item => item.assignedTo === currentUser.id)
      )
    : properties;
    
  const filteredProperties = useMemo(() => {
    switch(activeFilter) {
        case 'New':
            return visibleProperties.filter(p => ['Draft', 'In Review'].includes(p.status) && !p.isArchived);
        case 'In Progress':
            return visibleProperties.filter(p => p.status === 'In Progress' && !p.isArchived);
        case 'Closed':
            return visibleProperties.filter(p => p.status === 'Closed');
        case 'Archived':
            return visibleProperties.filter(p => p.isArchived === true);
        case 'All':
        default:
            return visibleProperties.filter(p => !p.isArchived);
    }
  }, [visibleProperties, activeFilter]);

  const getFilterCount = (filter: FilterType): number => {
      if (filter === 'New') return visibleProperties.filter(p => ['Draft', 'In Review'].includes(p.status) && !p.isArchived).length;
      if (filter === 'In Progress') return visibleProperties.filter(p => p.status === 'In Progress' && !p.isArchived).length;
      if (filter === 'Closed') return visibleProperties.filter(p => p.status === 'Closed').length;
      if (filter === 'Archived') return visibleProperties.filter(p => p.isArchived === true).length;
      if (filter === 'All') return visibleProperties.filter(p => !p.isArchived).length;
      return 0;
  }

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Closing Spaces</h1>
        </div>
        
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                <FilterButton label="All" isActive={activeFilter === 'All'} onClick={() => setActiveFilter('All')} count={getFilterCount('All')} />
                <FilterButton label="New" isActive={activeFilter === 'New'} onClick={() => setActiveFilter('New')} count={getFilterCount('New')} />
                <FilterButton label="In Progress" isActive={activeFilter === 'In Progress'} onClick={() => setActiveFilter('In Progress')} count={getFilterCount('In Progress')} />
                <FilterButton label="Closed" isActive={activeFilter === 'Closed'} onClick={() => setActiveFilter('Closed')} count={getFilterCount('Closed')} />
                <FilterButton label="Archived" isActive={activeFilter === 'Archived'} onClick={() => setActiveFilter('Archived')} count={getFilterCount('Archived')} />
            </div>
            <div className="flex items-center space-x-3">
                {['Title Admin', 'Title User'].includes(currentUser.role) && (
                    <>
                        <button onClick={onAddNew} className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <span>New Closing</span>
                        </button>
                    </>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map(prop => (
                <PropertyCard key={prop.id} property={prop} onSelectProperty={onSelectProperty} />
            ))}
        </div>
        {filteredProperties.length === 0 && (
            <div className="text-center py-16 text-gray-500 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold">No Properties Found</h3>
                <p>There are no properties matching the filter "{activeFilter}".</p>
            </div>
        )}
    </div>
  );
};