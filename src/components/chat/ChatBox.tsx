import React, { useState, useEffect, useRef } from 'react';
import { Send, PlusCircle, Settings, Search } from 'lucide-react';
import MessageBubble from './MessageBubble';
import PinnedMessage from './PinnedMessage';
import { chatService } from '../../api/ChatService';
import { useSocketContext } from '../../context/SocketContext';
import { Message } from '../../types';
import { useAuth } from '../../context/AuthContext';

const ChatBox: React.FC<{ rideId: string }> = ({ rideId }) => {
  const { user } = useAuth();
  const { socket } = useSocketContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock pinned message as per UI
  const pinnedMessage = "Please meet at the North Gate entrance by 4:20 PM";

  useEffect(() => {
    if (!rideId) return;

    // Load initial messages
    chatService.getMessages(rideId)
      .then(res => setMessages((res.data.messages || []) as Message[]))
      .catch(err => console.error(err));

    if (socket) {
      const handleReceiveMessage = (msg: Message) => {
        if (msg.rideId === rideId) {
          setMessages(prev => [...prev, msg]);
        }
      };

      socket.on('receive_message', handleReceiveMessage);
      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [rideId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !rideId) return;

    try {
      // Optimistic update
      const tempMsg: Message = {
        id: Date.now().toString(),
        rideId,
        senderId: user?.id || 'anon',
        content: input,
        sender: user!,
        sentAt: new Date().toISOString(),
        isOwn: true,
        isPinned: false
      };
      
      setMessages(prev => [...prev, tempMsg]);
      setInput('');

      await chatService.sendMessage(rideId, user?.id || 'anon', tempMsg.content);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-[600px] overflow-hidden">
      
      <PinnedMessage message={pinnedMessage} />

      {/* Header */}
      <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white z-20">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
             <img src="https://ui-avatars.com/api/?name=R+S&background=random" className="w-8 h-8 rounded-full border-2 border-white" />
             <img src="https://ui-avatars.com/api/?name=M+V&background=random" className="w-8 h-8 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-bold text-navy text-sm">Ride Group Chat</h3>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">2 Members Active</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><Search className="w-4 h-4"/></button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><Settings className="w-4 h-4"/></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar bg-gray-50/30">
        <div className="flex justify-center mb-6">
          <span className="bg-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Today</span>
        </div>

        {/* Mock historical messages to match prototype */}
        <MessageBubble 
          message={{ 
             id: 'mock-hist-1',
             rideId,
             senderId: 'u1',
             content: "Hey everyone! I'll be driving a white Swift (TS 08 AB 1234). Just parked near the pharmacy.", 
             sender: { id: 'u1', name: "Rahul S.", email: 'rahul@example.com', isVerified: true, createdAt: '', profilePhoto: "https://ui-avatars.com/api/?name=R+S&background=random" },
             sentAt: new Date().toISOString(),
             isPinned: false
          }} 
          isOwn={false} 
        />
        
        {messages.map(msg => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isOwn={!!(msg.sender?.id === user?.id || msg.isOwn)} 
          />
        ))}

        <MessageBubble 
          message={{ 
             id: 'mock-hist-2',
             rideId,
             senderId: user?.id || 'me',
             content: "Perfect! I'm just leaving the lab, should be there in 5 minutes.", 
             sender: user || { id: 'me', name: "You", email: 'me@example.com', isVerified: true, createdAt: '', profilePhoto: "https://ui-avatars.com/api/?name=You&background=random" },
             sentAt: new Date().toISOString(),
             isPinned: false
          }} 
          isOwn={true} 
        />

        <MessageBubble 
          message={{ 
             id: 'mock-hist-3',
             rideId,
             senderId: 'u3',
             content: "Can we wait 2 mins for me? The elevator is super slow today 😅", 
             sender: { id: 'u3', name: "Maya V.", email: 'maya@example.com', isVerified: true, createdAt: '', profilePhoto: "https://ui-avatars.com/api/?name=M+V&background=random" },
             sentAt: new Date().toISOString(),
             isPinned: false
          }} 
          isOwn={false} 
        />

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-50">
        <form onSubmit={handleSend} className="flex relative items-center">
          <button type="button" className="absolute left-4 p-1 text-gray-400 hover:text-navy transition-colors">
            <PlusCircle className="w-5 h-5" />
          </button>
          
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..." 
            className="w-full bg-gray-100/80 rounded-full pl-12 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-navy placeholder:text-gray-400"
          />
          
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="absolute right-2 p-2.5 bg-primary text-white rounded-full hover:bg-primary/90 hover:shadow-md transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
