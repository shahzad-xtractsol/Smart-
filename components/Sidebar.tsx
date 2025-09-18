import React from 'react';
import { DashboardIcon, ContactsIcon, TransactionsIcon, TitleUsersIcon, ChatIcon, SettingsIcon, PermissionsIcon } from './icons';
import type { User, Property, UserRole } from '../types';

interface SidebarProps {
    user: User;
    onNavigate: (view: 'dashboard') => void;
    isCollapsed: boolean;
    selectedProperty: Property | null;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive?: boolean; onClick?: () => void; isCollapsed: boolean; }> = ({ icon, label, isActive, onClick, isCollapsed }) => (
  <button 
    onClick={onClick}
    title={isCollapsed ? label : ''}
    className={`w-full flex items-center py-2.5 text-sm font-medium rounded-md transition-colors duration-200 group relative ${
      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
    } ${isCollapsed ? 'justify-center' : 'px-4'}`}
  >
    {icon}
    {!isCollapsed && <span className="ml-3 flex-1 text-left truncate">{label}</span>}
  </button>
);

const navItemsConfig: { label: string, icon: React.ReactNode, roles: UserRole[] }[] = [
    { label: "Contacts", icon: <ContactsIcon className="w-5 h-5" />, roles: ['Agent', 'Title Admin', 'Title User'] },
    { label: "Transactions", icon: <TransactionsIcon className="w-5 h-5" />, roles: ['Title Admin', 'Title User'] },
    { label: "Title Users", icon: <TitleUsersIcon className="w-5 h-5" />, roles: ['Title Admin', 'Title User'] },
    { label: "Chat", icon: <ChatIcon className="w-5 h-5" />, roles: ['Agent', 'Title Admin', 'Title User'] },
    { label: "Settings", icon: <SettingsIcon className="w-5 h-5" />, roles: ['Title Admin', 'Title User'] },
    { label: "Permissions", icon: <PermissionsIcon className="w-5 h-5" />, roles: ['Title Admin', 'Title User'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ user, onNavigate, isCollapsed, selectedProperty }) => {
  const visibleNavItems = navItemsConfig.filter(item => item.roles.includes(user.role));

  return (
    <div className={`bg-white flex flex-col border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        {isCollapsed ? (
          <svg width="32" height="32" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="37.5" stroke="#3B82F6" strokeWidth="8"/>
          </svg>
        ) : (
          <svg width="60" height="40" viewBox="0 0 125 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="62.5" cy="40" r="37.5" stroke="#3B82F6" strokeWidth="5"/>
              <path d="M36.0156 50.5C36.0156 50.5 44.8164 37.3125 57.2656 37.3125C69.7148 37.3125 75.3281 48.0625 75.3281 48.0625M70.4766 43.8125C70.4766 43.8125 77.0703 30.125 89.8438 30.125C102.617 30.125 106.734 43.8125 106.734 43.8125" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round"/>
              <path d="M25 43.5156L31.5 40.8906" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      
      <div className="p-4">
        <div className={`bg-blue-50 rounded-lg p-3 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-blue-200 text-blue-700 font-bold flex items-center justify-center text-lg flex-shrink-0">
                {user.name.charAt(0)}
            </div>
            {!isCollapsed && (
                <div className="ml-3 overflow-hidden">
                    <p className="font-semibold text-sm text-gray-800 truncate">World Class Title</p>
                    <p className="text-xs text-gray-500 truncate">{user.role}</p>
                </div>
            )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4">
        {!isCollapsed && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">Navigation</p>}
        <nav className="flex flex-col space-y-1">
          <NavItem 
            icon={<DashboardIcon className="w-5 h-5" />} 
            label="Dashboard" 
            onClick={() => onNavigate('dashboard')} 
            isCollapsed={isCollapsed} 
            isActive={!selectedProperty} 
          />
          
          {selectedProperty && (
            <>
              {!isCollapsed && <div className="pt-2 mt-2 border-t border-gray-200" />}
              <NavItem 
                icon={<TransactionsIcon className="w-5 h-5" />} 
                label={selectedProperty.address}
                isCollapsed={isCollapsed}
                isActive={true}
              />
               {!isCollapsed && <div className="pt-2 mt-2 border-t border-gray-200" />}
            </>
          )}

          {visibleNavItems.map(item => (
              <NavItem 
                key={item.label}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>
    </div>
  );
};