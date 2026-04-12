import React from 'react';
import { Megaphone, X } from 'lucide-react';

const PinnedMessage: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-primary text-white p-3 flex gap-3 items-center text-sm rounded-t-2xl px-6 relative z-10 shadow-md">
      <Megaphone className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium flex-1 line-clamp-1">{message}</span>
      <button className="text-teal-200 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PinnedMessage;
