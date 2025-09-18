import React from 'react';
import type { ChatMessage, User } from '../types';
import { SendIcon, PaperclipIcon } from './icons';

interface ChatPanelProps {
  messages: ChatMessage[];
  currentUser: User;
  participants: User[];
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, currentUser, participants }) => {
    const getParticipant = (userId: number) => {
        return participants.find(p => p.id === userId);
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex-shrink-0">Team Chat</h2>
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
                {messages.map(msg => {
                    const participant = getParticipant(msg.userId);
                    const isCurrentUser = msg.userId === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            {!isCurrentUser && (
                                <img src={participant?.avatarUrl} alt={participant?.name} className="w-8 h-8 rounded-full flex-shrink-0"/>
                            )}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                {!isCurrentUser && <p className="text-xs font-bold text-blue-700 mb-1">{participant?.name}</p>}
                                <p className="text-sm">{msg.message}</p>
                                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'} text-right`}>{msg.timestamp}</p>
                            </div>
                             {isCurrentUser && (
                                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full flex-shrink-0"/>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 flex-shrink-0">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="w-full bg-gray-100 border-2 border-gray-200 rounded-full py-3 pl-5 pr-20 focus:outline-none focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <button className="p-2 text-gray-500 hover:text-blue-600">
                            <PaperclipIcon className="w-5 h-5"/>
                        </button>
                        <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 ml-1">
                             <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
