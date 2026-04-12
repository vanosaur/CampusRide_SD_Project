import React from 'react';
import { User as UserIcon, Plus } from 'lucide-react';
import { User, RideMember } from '../../types';

interface SeatMapProps {
  maxSeats: number;
  members?: RideMember[];
  creator: User;
}

const SeatMap: React.FC<SeatMapProps> = ({ maxSeats, members = [], creator }) => {
  const allOccupants = [creator, ...members].filter(Boolean);
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {[...Array(maxSeats || 4)].map((_, idx) => {
        const item = allOccupants[idx];
        if (!item) {
          return (
            <div key={idx} className="rounded-3xl p-4 flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 bg-gray-50/50 transition-all">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-300 mb-3 bg-white">
                <Plus className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Available</p>
            </div>
          );
        }

        // Determine if it's a member object or a user object
        const userData = (item as RideMember).user || (item as User);
        const isHost = userData.id === creator?.id;
        
        return (
          <div key={idx} className="rounded-3xl p-4 flex flex-col items-center justify-center aspect-square border-2 bg-white shadow-sm border-gray-100 transition-all">
            <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 overflow-hidden outline outline-4 outline-primary/10 relative">
              {userData.profilePhoto ? (
                <img src={userData.profilePhoto} alt={userData.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-navy flex items-center justify-center flex-col text-white">
                  <UserIcon className="w-8 h-8" />
                </div>
              )}
              {isHost && (
                <div className="absolute bottom-0 inset-x-0 bg-primary text-[8px] font-bold text-center text-white pb-0.5 tracking-wider uppercase">Host</div>
              )}
            </div>
            <p className="font-bold text-navy text-sm text-center line-clamp-1">{userData.name}</p>
            {isHost && <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Driver</p>}
          </div>
        )
      })}
    </div>
  );
};

export default SeatMap;
