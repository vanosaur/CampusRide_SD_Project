import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Clock, Car, Users, Search, Plus } from 'lucide-react';
import { getMyRides } from '../api/rides';
import { useAuth } from '../context/AuthContext';
import RideCard from '../components/ride/RideCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { Ride } from '../types';

const MyRides = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        const res = await getMyRides();
        setRides(res.data.rides || []);
      } catch (error) {
        toast.error('Failed to load your rides');
      } finally {
        setLoading(false);
      }
    };
    fetchMyRides();
  }, []);

  const hostedRides = rides.filter(r => r.creatorId === user?.id || (r.creator as any)?.id === user?.id);
  const joinedRides = rides.filter(r => r.creatorId !== user?.id && (r.creator as any)?.id !== user?.id);

  return (
    <div className="flex-1 w-full bg-gray-50/50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-navy tracking-tight mb-2">My Journey</h1>
          <p className="text-gray-500 font-medium">Manage your active pools and past trips.</p>
        </header>

        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
             </div>
        ) : (
          <div className="space-y-12">
            
            {/* Hosted Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Rides You're Hosting
                  <span className="ml-2 bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">{hostedRides.length}</span>
                </h3>
                {hostedRides.length === 0 && (
                   <button onClick={() => navigate('/create-ride')} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Create a new pool
                   </button>
                )}
              </div>
              
              {hostedRides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {hostedRides.map(ride => (
                    <RideCard key={ride.id} ride={ride} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400 mb-4">You aren't hosting any rides at the moment.</p>
                </div>
              )}
            </section>

            {/* Joined Section */}
            <section>
              <h3 className="text-lg font-bold text-navy flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-navy" />
                Joined Communities
                <span className="ml-2 bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">{joinedRides.length}</span>
              </h3>
              
              {joinedRides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {joinedRides.map(ride => (
                    <RideCard key={ride.id} ride={ride} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400 mb-4">You haven't joined any pools yet.</p>
                  <button onClick={() => navigate('/home')} className="text-xs font-bold text-primary hover:underline">Browse available rides</button>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRides;
