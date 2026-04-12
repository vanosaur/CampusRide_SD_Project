import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { MapPin, Navigation, UserPlus, MoreVertical, CheckCircle, XCircle, Trash2, ShieldCheck, Mail } from 'lucide-react';
import * as rideApi from '../api/rides';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch data
    if (id) {
      rideApi.getRideById(id)
        .then(res => {
           // Support both { data: { ride } } and { data: ride }
           const rideData = res.data.ride || res.data;
           // VALIDATION: Only set ride if it actually has a destination or ID
           if (rideData && (rideData.destination || rideData._id || rideData.id)) {
              setRide(rideData);
              setError(null);
           } else {
              setRide(null);
              setError('This ride could not be processed. It may be malformed or hidden.');
           }
        })
        .catch((err) => {
           console.error('Fetch error:', err);
           if (err.response?.status === 401) {
              toast.error('Session expired. Please login again.');
              navigate('/login');
           } else {
              setError('Failed to load ride details. Please try again later.');
           }
           setRide(null);
        })
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

  const isCreator = ride?.creator?.id === user?.id || (ride as any)?.creatorId === user?.id || (ride as any)?.creatorId?.id === user?.id;
  const occupiedCount = (ride?.members?.length || 0) + 1;

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
            const res = await rideApi.getRideById(id);
            setRide(res.data.ride || null);
         }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${action} ride`);
    }
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium">Fetching real-time ride details...</p>
    </div>
  );

  if (error || !ride) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
        <MapPin className="w-10 h-10 text-gray-300" />
      </div>
      <h2 className="text-2xl font-bold text-navy mb-2">{error || 'Ride not found'}</h2>
      <p className="text-gray-500 mb-8">{error ? 'There was a problem retrieving the ride.' : 'This ride may have been cancelled or never existed.'}</p>
      <button onClick={() => navigate('/home')} className="px-8 py-3 bg-primary text-white rounded-xl font-bold">
        Back to Home
      </button>
    </div>
  );

  return (
    <div className="flex-1 w-full bg-background pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Info Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2rem] shadow-sm mb-8 border border-gray-100">
          <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Destination</span>
                {ride?.status && <RideStatusBadge status={ride.status} />}
              </div>
              <h1 className="text-3xl font-extrabold text-navy">{ride?.destination || 'Destination'}</h1>
              <p className="text-sm font-medium text-gray-500 mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Departs at {ride?.departureTime ? formatRideTime(ride.departureTime) : 'TBD'} • From {ride?.pickupLocation || 'Loading...'}
              </p>
           </div>
           
           <div className="mt-4 md:mt-0">
             {ride && <FareSplitDisplay totalFare={ride.totalFare} maxSeats={ride.maxSeats} currentSeats={occupiedCount} />}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Occupancy & Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Vehicle Occupancy</h3>
              <SeatMap maxSeats={ride.maxSeats} members={(ride.members || []) as RideMember[]} creator={ride.creator || (ride as any).creatorId} />
              
              {isCreator && (ride.members || []).some(m => (m as RideMember).status === 'PENDING') && (
                <div className="mt-6 space-y-3">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Requests</h4>
                   {(ride.members || []).filter(m => (m as RideMember).status === 'PENDING').map(m => {
                     const member = m as RideMember;
                     return (
                      <div key={member.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                         <span className="text-sm font-semibold">{member.user?.name || 'Applicant'}</span>
                         <div className="flex gap-2">
                            <button 
                               onClick={() => handleAction('accept', rideApi.updateMemberStatus(ride.id, member.user.id || (member as any).userId, 'ACTIVE'))}
                               className="p-1 hover:bg-green-100 rounded-full text-green-600 transition" 
                               title="Accept"
                             >
                                <CheckCircle className="w-5 h-5" />
                             </button>
                             <button 
                               onClick={() => handleAction('reject', rideApi.updateMemberStatus(ride.id, member.user.id || (member as any).userId, 'REJECTED'))}
                               className="p-1 hover:bg-red-100 rounded-full text-red-600 transition" 
                               title="Reject"
                             >
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
                          onClick={() => handleAction('confirm', rideApi.confirmRide(ride.id))}
                          className="py-3 bg-navy text-white rounded-xl font-bold hover:bg-navy/90 transition shadow-sm flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Confirm & Close
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this ride? This action cannot be undone.')) {
                              handleAction('cancel', rideApi.cancelRide(ride.id));
                            }
                          }}
                          className="py-3 bg-danger/10 text-danger rounded-xl font-bold hover:bg-danger hover:text-white transition shadow-sm flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Cancel Ride
                        </button>
                     </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                   <button 
                     disabled={ride.status !== 'OPEN'}
                     onClick={() => handleAction('join', rideApi.joinRide(ride.id))}
                     className={`py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2 ${
                       ride.status !== 'OPEN' ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white hover:bg-primary/90 shadow-teal-200'
                     }`}
                   >
                     <CheckCircle className="w-5 h-5"/> {ride.status === 'FULL' ? 'Ride Full' : 'Join Ride'}
                   </button>
                   <button 
                     onClick={() => navigate('/home')}
                     className="py-4 bg-gray-100 text-gray-500 rounded-xl font-bold text-lg hover:bg-gray-200 transition shadow-sm flex items-center justify-center gap-2"
                   >
                     <XCircle className="w-5 h-5"/> Not Now
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

          {/* Right Column: Details & Chat */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Riders List Section */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Confirmed Riders Manifest</h3>
              <div className="space-y-4">
                 {/* Host Entry */}
                 <div className="flex items-center justify-between bg-teal-50/30 p-4 rounded-2xl border border-teal-50">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {ride.creator?.name?.charAt(0) || 'H'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="font-bold text-navy">{ride.creator?.name || 'Host'}</p>
                           <span className="text-[9px] bg-primary text-white px-2 py-0.5 rounded-full font-bold uppercase">Host</span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {ride.creator?.email || 'email@university.edu'}
                        </p>
                      </div>
                   </div>
                   <ShieldCheck className="w-5 h-5 text-primary" />
                 </div>

                 {/* Members Entries */}
                 {(ride.members || []).filter(m => (m as RideMember).status === 'ACTIVE').map(m => {
                   const member = m as RideMember;
                   return (
                    <div key={member.id} className="flex items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy font-bold">
                          {member.user?.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-navy">{member.user?.name || 'Passenger'}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.user?.email || 'student@university.edu'}
                          </p>
                        </div>
                      </div>
                      <ShieldCheck className="w-5 h-5 text-gray-300" />
                    </div>
                 )})}

                 {(ride.members || []).filter(m => (m as RideMember).status === 'ACTIVE').length === 0 && (
                    <p className="text-center py-4 text-sm text-gray-400 italic">Finding more riders to join your journey...</p>
                 )}
              </div>
            </div>

            {id && <ChatBox rideId={id} />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RideDetail;
