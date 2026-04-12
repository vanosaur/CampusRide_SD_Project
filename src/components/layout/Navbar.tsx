import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotificationContext } from '../../context/NotificationContext';
import NotificationDrawer from '../notifications/NotificationDrawer';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotificationContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav className="bg-background sticky top-0 z-40 border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold text-primary">
                CabShare
              </Link>
              
              {user && (
                <div className="hidden md:flex gap-6 font-medium text-navy/80 hover:text-navy">
                  <Link to="/home" className="hover:text-primary transition-colors">Home</Link>
                  <Link to="/my-rides" className="hover:text-primary transition-colors">My Rides</Link>
                  <Link to="/home" className="hover:text-primary transition-colors">History</Link>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search destinations..." 
                    className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                  />
                </div>

                <button 
                  onClick={() => setDrawerOpen(true)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-navy" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-background"></span>
                  )}
                </button>
                
                <Link to="/profile" className="flex items-center gap-2 p-1 rounded-full bg-navy/5 text-navy hover:bg-navy/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-sm font-medium">
                <p className="hidden sm:block text-navy/70">Home</p>
                <p className="hidden sm:block text-navy/70">Safety</p>
                <p className="hidden sm:block text-navy/70">Support</p>
                <Bell className="hidden sm:block w-5 h-5 text-navy/70 ml-4" />
                <div className="w-8 h-8 rounded-full bg-gray-200 ml-2"></div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {user && (
        <NotificationDrawer 
          isOpen={drawerOpen} 
          onClose={() => setDrawerOpen(false)} 
        />
      )}
    </>
  );
};

export default Navbar;
