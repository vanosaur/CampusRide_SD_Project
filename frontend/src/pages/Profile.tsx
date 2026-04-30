import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, MapPin, Calendar, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex-1 bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Header/Cover */}
          <div className="h-32 bg-gradient-to-r from-primary/20 to-navy/10" />
          
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 left-28 bg-green-500 border-4 border-white w-6 h-6 rounded-full" title="Active Now"></div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-extrabold text-navy mb-1">{user.name}</h1>
                <div className="flex items-center gap-2 text-primary font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified University Student</span>
                </div>
              </div>
              
              <button 
                onClick={logout}
                className="px-6 py-2.5 bg-white border border-danger/20 text-danger hover:bg-danger/5 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            <hr className="my-8 border-gray-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Main Campus, Rishihood University</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8F9FF] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-navy mb-4">Trip Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-blue-50">
                    <p className="text-xs text-gray-500 font-medium mb-1">Rides Completed</p>
                    <p className="text-2xl font-black text-navy">12</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-blue-50">
                    <p className="text-xs text-gray-500 font-medium mb-1">Eco Impact</p>
                    <p className="text-2xl font-black text-primary">High</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-400 leading-relaxed font-medium">
                  By using CampusRide, you've helped reduce carbon emissions and saved approximately ₹4,200 this semester.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
