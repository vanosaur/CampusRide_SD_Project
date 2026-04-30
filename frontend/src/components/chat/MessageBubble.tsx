import React from 'react';
import { format } from 'date-fns';
import { Message } from '../../types';

const MessageBubble: React.FC<{ message: Message; isOwn: boolean }> = ({ message, isOwn }) => {
  return (
    <div className={`flex flex-col mb-4 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-end gap-2 max-w-[85%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwn && (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden outline outline-2 outline-white shadow-sm mb-1">
             {message.sender?.profilePhoto ? (
                <img src={message.sender.profilePhoto} alt="avatar" className="w-full h-full object-cover" />
             ) : (
                <img src={`https://ui-avatars.com/api/?name=${message.sender?.name || 'U'}&background=random`} alt="avatar" className="w-full h-full object-cover" />
             )}
          </div>
        )}
        
        <div className="flex flex-col">
          {!isOwn && (
            <span className="text-[10px] font-bold text-gray-500 mb-1 ml-1">{message.sender?.name}</span>
          )}
          
          <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
            isOwn 
              ? 'bg-primary text-white rounded-br-none' 
              : 'bg-gray-100 text-navy rounded-bl-none'
          }`}>
            {message.content}
          </div>
          
          <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
             {isOwn && <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-1.5 py-0.5 rounded mr-1">You</span>}
             <span className="text-[9px] font-medium text-gray-400">
               {message.sentAt ? format(new Date(message.sentAt), 'h:mm a') : ''}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
