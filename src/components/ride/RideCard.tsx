import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { MapPin, User as UserIcon } from 'lucide-react';
import { joinRide } from '../../api/rides';
import { useSocketContext } from '../../context/SocketContext';
import { formatRideTime, formatRideDate } from '../../utils/formatTime';
import { calculateFareSplit } from '../../utils/fareCalc';
import { Ride, User, RideMember } from '../../types';

const RideCard: React.FC<{ ride: Partial<Ride>; isCreator?: boolean }> = ({ ride, isCreator = false }) => {
  const navigate = useNavigate();
  const { socket } = useSocketContext();
  const [currentRide, setCurrentRide] = useState<Partial<Ride>>(ride);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    setCurrentRide(ride);
  }, [ride]);

  useEffect(() => {
    if (!socket || !currentRide?.id) return;
    
    // Listen for real-time updates for THIS ride specifically in the feed
    const handleMemberJoined = (data: { rideId: string; user: User }) => {
      if (data.rideId === currentRide.id) {
        setCurrentRide(prev => {
          const members = prev.members || [];
          const maxSeats = prev.maxSeats || 4;
          const newMember: RideMember = {
            id: `m-${Date.now()}`,
            rideId: data.rideId,
            userId: data.user.id,
            user: data.user,
            status: 'ACTIVE',
            joinedAt: new Date().toISOString()
          };
          return {
            ...prev,
            members: [...members, newMember],
            status: members.length + 1 >= maxSeats ? 'FULL' : prev.status
          };
        });
      }
    };

    socket.on('member_joined', handleMemberJoined);
    return () => {
      socket.off('member_joined', handleMemberJoined);
    };
  }, [socket, currentRide?.id]);

  if (!currentRide) return null;

  const { destination, pickupLocation, departureTime, maxSeats, totalFare, members, creator, status } = currentRide;
  
  // Handle case where it might be a preview without ID yet
  const occupiedCount = members?.length || 1; 
  const farePerPerson = calculateFareSplit(totalFare || 0, occupiedCount);
  const isFull = occupiedCount >= (maxSeats || 4);

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentRide.id) return; // Preview mode check
    
    try {
      setJoining(true);
      await joinRide(currentRide.id);
      toast.success('Successfully requested to join ride!');
      navigate(`/rides/${currentRide.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not join ride');
    } finally {
      setJoining(false);
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'OPEN': return 'bg-teal-100 text-teal-800';
      case 'FULL': return 'bg-amber-100 text-amber-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-600';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div 
      onClick={() => {
        const rideId = currentRide.id || (currentRide as any)._id;
        rideId && navigate(`/rides/${rideId}`);
      }}
      className={`bg-white rounded-3xl p-5 shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer group flex flex-col ${
        isFull || status !== 'OPEN' ? 'grayscale opacity-80 bg-gray-50/50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-navy line-clamp-1">{destination || 'Destination'}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {pickupLocation || 'Pickup Location'}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-gray-50 rounded-full mb-1 whitespace-nowrap">
            {departureTime ? `${formatRideDate(departureTime as unknown as string)} • ` : ''}{formatRideTime(departureTime as unknown as string) || 'Time'}
          </span>
          {status && <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusColor(status)}`}>{status}</span>}
        </div>
      </div>

      {/* Seats & Cost Section */}
      <div className="flex justify-between items-center bg-gray-50/80 rounded-2xl p-4 mb-5 border border-gray-100/50">
        <div className="flex -space-x-3">
          {[...Array(maxSeats || 4)].map((_, i) => {
             const isOccupied = i < occupiedCount;
             return (
                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center relative border-2 border-white ${isOccupied ? 'bg-primary z-10' : 'border-dashed border-gray-300 bg-transparent'}`}>
                  {isOccupied ? <UserIcon className="w-5 h-5 text-white" /> : null}
                </div>
             )
          })}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
            {(currentRide as any).potentialFare ? 'Split Fare' : 'Fare'}
          </p>
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-bold text-navy">₹</span>
            <span className="text-2xl font-extrabold text-navy">
              {(currentRide as any).potentialFare || farePerPerson}
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center outline outline-2 outline-white shadow-sm overflow-hidden text-primary">
             {(creator?.profilePhoto || (currentRide as any).creatorId?.profilePhoto) ? (
                <img src={creator?.profilePhoto || (currentRide as any).creatorId?.profilePhoto} alt="Host" className="w-full h-full object-cover" />
             ) : (
                <UserIcon className="w-5 h-5" />
             )}
          </div>
          <div>
            <p className="text-sm font-bold text-navy">
              {creator?.name || (currentRide as any).creatorId?.name || 'Loading...'}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">Verified Student</p>
          </div>
        </div>

        {!isCreator && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const rideId = currentRide.id || (currentRide as any)._id;
              rideId && navigate(`/rides/${rideId}`);
            }}
            className="px-6 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all bg-navy/5 text-navy hover:bg-navy/10 flex items-center gap-2"
          >
            Details
          </button>
        )}
        
        {isCreator && (
          <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full text-primary text-xs font-bold border border-teal-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Host Mode
          </div>
        )}
      </div>
    </div>
  );
};

export default RideCard;
