import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { MapPin, Navigation, UserPlus, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { rideService } from '../api/RideService';
import { useSocketContext } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import RideStatusBadge from '../components/ride/RideStatusBadge';
import SeatMap from '../components/ride/SeatMap';
import FareSplitDisplay from '../components/ride/FareSplitDisplay';
import ChatBox from '../components/chat/ChatBox';
import { formatRideTime } from '../utils/formatTime';
import { Ride, User, RideMember } from '../types';

const RideDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocketContext();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch data
    if (id) {
      rideService.getRideById(id)
        .then(res => setRide(res.data.ride || null))
        .catch(() => toast.error('Could not load ride'))
        .finally(() => setLoading(false));
    }

    // 2. Join socket room & set up global listeners
    if (socket) {
      socket.emit('join_room', { rideId: id });

      const handleMemberJoined = (data: { rideId: string; user: User }) => {
         if (data.rideId === id) {
           setRide(prev => {
             if (!prev) return null;
             const newMember: RideMember = {
               id: `m-${Date.now()}`,
               rideId: prev.id,
               userId: data.user.id,
               user: data.user,
               status: 'ACTIVE',
               joinedAt: new Date().toISOString()
             };
             const members = [...prev.members, newMember];
             return { 
               ...prev, 
               members,
               status: members.length + 1 >= prev.maxSeats ? 'FULL' : prev.status 
             };
           });
         }
      };

      const handleRideConfirmed = (data: { rideId: string }) => {
         if (data.rideId === id) {
           setRide(prev => prev ? { ...prev, status: 'CONFIRMED' } : null);
           toast.success('Your ride has been confirmed!', { duration: 5000, icon: '🎉' });
         }
      };

      const handleRideCancelled = (data: { rideId: string }) => {
         if (data.rideId === id) {
           setRide(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
           toast.error('This ride has been cancelled by the host.');
           setTimeout(() => navigate('/home'), 3000);
         }
      };

      socket.on('member_joined', handleMemberJoined);
      socket.on('ride_confirmed', handleRideConfirmed);
      socket.on('ride_cancelled', handleRideCancelled);

      return () => {
        socket.emit('leave_room', { rideId: id });
        socket.off('member_joined', handleMemberJoined);
        socket.off('ride_confirmed', handleRideConfirmed);
        socket.off('ride_cancelled', handleRideCancelled);
      };
    }
  }, [id, socket, navigate]);

  const mockUser = (id: string, name: string) => ({
    id,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@university.edu`,
    isVerified: true,
    createdAt: new Date().toISOString()
  });

  // Use mock if API fails for visual prototyping
  const currentRide = ride || {
    id: "mock1",
    creatorId: "u2",
    creator: mockUser("u2", "Rahul S."),
    destination: "Main Campus Library",
    pickupLocation: "North Gate",
    date: new Date().toISOString().split('T')[0],
    departureTime: new Date().toISOString(),
    status: "OPEN" as const,
    autoAccept: false,
    maxSeats: 4,
    totalFare: 900,
    createdAt: new Date().toISOString(),
    members: [
      { id: "m1", rideId: "mock1", userId: "u3", user: mockUser("u3", "Maya V."), status: "ACTIVE" as const, joinedAt: new Date().toISOString() }
    ]
  };

  const isCreator = currentRide.creator?.id === user?.id;
  const occupiedCount = (currentRide.members?.length || 0) + 1; // +1 for creator

  const handleAction = async (action: string, promise: Promise<any>) => {
    try {
      await promise;
      if (action === 'cancel') {
         toast.success('Ride cancelled');
         navigate('/home');
      } else {
         toast.success(`Ride ${action} successful`);
         // Re-fetch to update state
         if (id) {
            const res = await rideService.getRideById(id);
            setRide(res.data.ride || (res.data as any).ride || null);
         }
      }
    } catch (err) {
      toast.error(`Failed to ${action} ride`);
    }
  };

  if (loading && !ride) return <div className="p-8 text-center text-primary">Loading ride details...</div>;

  return (
    <div className="flex-1 w-full bg-background pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Info Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2rem] shadow-sm mb-8 border border-gray-100">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Destination</span>
                <RideStatusBadge status={currentRide.status} />
              </div>
              <h1 className="text-3xl font-extrabold text-navy">{currentRide.destination}</h1>
              <p className="text-sm font-medium text-gray-500 mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Departs at {formatRideTime(currentRide.departureTime)} • From {currentRide.pickupLocation}
              </p>
           </div>
           
           <div className="mt-4 md:mt-0">
             <FareSplitDisplay totalFare={currentRide.totalFare} maxSeats={currentRide.maxSeats} currentSeats={occupiedCount} />
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Occupancy & Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Vehicle Occupancy</h3>
              <SeatMap maxSeats={currentRide.maxSeats} members={currentRide.members as RideMember[]} creator={currentRide.creator} />
              
              {isCreator && currentRide.members.some(m => (m as RideMember).status === 'PENDING') && (
                <div className="mt-6 space-y-3">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Requests</h4>
                   {currentRide.members.filter(m => (m as RideMember).status === 'PENDING').map(m => {
                     const member = m as RideMember;
                     return (
                      <div key={member.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                         <span className="text-sm font-semibold">{member.user?.name || 'Applicant'}</span>
                         <div className="flex gap-2">
                            <button className="p-1 hover:bg-green-100 rounded-full text-green-600 transition" title="Accept">
                               <CheckCircle className="w-5 h-5" />
                            </button>
                            <button className="p-1 hover:bg-red-100 rounded-full text-red-600 transition" title="Reject">
                               <XCircle className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                   )})}
                </div>
              )}
            </div>


            {/* Actions Panel */}
            <div className="flex flex-col gap-3">
              {isCreator ? (
                <>
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Creator Controls</h3>
                     <div className="grid grid-cols-2 gap-3 mb-4">
                        <button 
                          onClick={() => handleAction('close', rideService.closeRide(currentRide.id))}
                          className="py-3 bg-navy text-white rounded-xl font-bold hover:bg-navy/90 transition shadow-sm"
                        >
                          Confirm & Close
                        </button>
                        <button 
                          onClick={() => handleAction('cancel', rideService.cancelRide(currentRide.id))}
                          className="py-3 bg-danger/10 text-danger rounded-xl font-bold hover:bg-danger hover:text-white transition shadow-sm"
                        >
                          Cancel Ride
                        </button>
                     </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                   <button className="py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition shadow-lg shadow-teal-200 flex items-center justify-center gap-2">
                     <CheckCircle className="w-5 h-5"/> Confirm Ride
                   </button>
                   <button className="py-4 bg-danger/10 text-danger rounded-xl font-bold text-lg hover:bg-danger hover:text-white transition shadow-sm flex items-center justify-center gap-2">
                     <XCircle className="w-5 h-5"/> Cancel Ride
                   </button>
                </div>
              )}
              
              <div className="flex gap-3">
                <button className="flex-1 py-4 bg-gray-200 text-navy rounded-xl font-bold hover:bg-gray-300 transition flex items-center justify-center gap-2">
                   <UserPlus className="w-5 h-5" /> Invite Friend
                </button>
                <button className="w-14 items-center justify-center flex bg-gray-200 text-navy rounded-xl font-bold hover:bg-gray-300 transition">
                   <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Decorative Map */}
            <div className="rounded-[2rem] overflow-hidden bg-primary/20 h-48 relative border border-gray-200 shadow-inner group cursor-pointer">
              <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Map" />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold text-navy hover:bg-gray-50 transition">
                 <Navigation className="w-4 h-4 text-primary" /> View Route on Map
              </div>
            </div>

          </div>

          {/* Right Column: Chat Box */}
          <div className="lg:col-span-7">
            {id && <ChatBox rideId={id} />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RideDetail;
