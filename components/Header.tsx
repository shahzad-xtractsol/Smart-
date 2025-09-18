import React from 'react';
import { SearchIcon, BellIcon, MenuIcon } from './icons';
import type { User } from '../types';

interface HeaderProps {
    user: User;
    onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onToggleSidebar }) => {
  return (
    <header className="flex items-center justify-between h-20 px-6 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center">
            <button onClick={onToggleSidebar} className="p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Toggle sidebar">
                <MenuIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="flex-1 flex justify-center px-6">
             <div className="relative w-full max-w-lg">
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search Here..."
                    className="w-full bg-gray-100 border-none rounded-lg py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-2">
                 <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-bold flex items-center justify-center text-lg">
                    {user.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                     <p className="font-semibold text-sm text-gray-700">{user.name}</p>
                </div>
            </div>
        </div>
    </header>
  );
};