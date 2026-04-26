import React, { useState, useEffect, useRef } from 'react';
import { Send, PlusCircle, Settings, Search } from 'lucide-react';
import MessageBubble from './MessageBubble';
import PinnedMessage from './PinnedMessage';
import { chatService } from '../../services/ChatService';
import { useSocketContext } from '../../context/SocketContext';
import { Message } from '../../types';
import { useAuth } from '../../context/AuthContext';

const ChatBox: React.FC<{ rideId: string }> = ({ rideId }) => {
  const { user } = useAuth();
  const { socket } = useSocketContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [globalMessages, setGlobalMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [view, setView] = useState<'RIDE' | 'GLOBAL'>('RIDE');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock pinned message as per UI
  const pinnedMessage = "Please meet at the North Gate entrance by 4:20 PM";

  useEffect(() => {
    if (!rideId) return;

    // Load initial messages
    chatService.getMessages(rideId)
      .then(res => setMessages((res.data.messages || []) as Message[]))
      .catch(err => console.error(err));

    if (socket) {
      socket.emit('joinRoom', rideId);

      const handleReceiveMessage = (msg: Message) => {
        if (msg.rideId === rideId) {
          setMessages(prev => [...prev, msg]);
        }
      };

      const handleGlobalUpdate = (data: any) => {
        const newMsg: Message = {
          id: Date.now().toString(),
          rideId: 'global',
          senderId: data.senderId,
          content: data.content,
          sender: data.sender || { name: 'Student' },
          sentAt: data.timestamp,
          isPinned: false
        };
        setGlobalMessages(prev => [...prev, newMsg]);
      };

      const handleTypingStart = (data: any) => {
        if (data.roomId === rideId && data.userId !== user?.id) {
          setTypingUsers(prev => [...new Set([...prev, data.userId])]);
        }
      };

      const handleTypingStop = (data: any) => {
        if (data.roomId === rideId) {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }
      };

      const handleStatusChange = (data: any) => {
        setOnlineUsers(prev => {
          const next = new Set(prev);
          if (data.status === 'online') next.add(data.userId);
          else next.delete(data.userId);
          return next;
        });
      };

      socket.on('receive_message', handleReceiveMessage);
      socket.on('global_update', handleGlobalUpdate);
      socket.on('typing_start', handleTypingStart);
      socket.on('typing_stop', handleTypingStop);
      socket.on('user_status_change', handleStatusChange);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
        socket.off('global_update', handleGlobalUpdate);
        socket.off('typing_start', handleTypingStart);
        socket.off('typing_stop', handleTypingStop);
        socket.off('user_status_change', handleStatusChange);
        socket.emit('leaveRoom', rideId);
      };
    }
  }, [rideId, socket, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, globalMessages, typingUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    if (socket && view === 'RIDE') {
      socket.emit('typing_start', rideId);
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', rideId);
      }, 3000);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (view === 'GLOBAL') {
      if (socket) {
        socket.emit('global_update', {
          content: input,
          sender: { name: user?.name, id: user?.id, profilePhoto: user?.profilePhoto }
        });
        setInput('');
      }
      return;
    }

    if (!rideId) return;

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
      if (socket) socket.emit('typing_stop', rideId);

      await chatService.sendMessage(rideId, user?.id || 'anon', tempMsg.content);
    } catch (err) {
      console.error(err);
    }
  };

  const activeMessages = view === 'RIDE' ? messages : globalMessages;

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-[600px] overflow-hidden">
      
      {view === 'RIDE' && <PinnedMessage message={pinnedMessage} />}

      {/* Header */}
      <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white z-20">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
             <img src="https://ui-avatars.com/api/?name=R+S&background=random" className="w-8 h-8 rounded-full border-2 border-white" />
             <div className="relative">
                <img src="https://ui-avatars.com/api/?name=M+V&background=random" className="w-8 h-8 rounded-full border-2 border-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
             </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-navy text-sm">{view === 'RIDE' ? 'Ride Group Chat' : 'Campus Live Feed'}</h3>
              <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {view === 'RIDE' ? 'Ride' : 'Global'}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
              {view === 'RIDE' ? '2 Members Active' : 'Public Feed'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setView(view === 'RIDE' ? 'GLOBAL' : 'RIDE')}
            className="px-3 py-1.5 rounded-full bg-gray-100 text-[10px] font-bold text-navy hover:bg-gray-200 transition-all uppercase tracking-widest"
          >
            Switch to {view === 'RIDE' ? 'Global' : 'Ride'}
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><Settings className="w-4 h-4"/></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar bg-gray-50/30">
        <div className="flex justify-center mb-6">
          <span className="bg-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            {view === 'RIDE' ? 'Today' : 'Live Campus Updates'}
          </span>
        </div>

        {view === 'RIDE' && (
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
        )}
        
        {activeMessages.map(msg => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isOwn={!!(msg.senderId === user?.id || msg.isOwn)} 
          />
        ))}

        {typingUsers.length > 0 && view === 'RIDE' && (
          <div className="flex items-center gap-2 ml-10 mb-4 animate-pulse">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium italic">Someone is typing...</span>
          </div>
        )}

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
            onChange={handleInputChange}
            placeholder={view === 'RIDE' ? "Type a message..." : "Share an update with everyone..."}
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
