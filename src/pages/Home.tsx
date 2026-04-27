import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CarFront, Plus, Search, Sparkles, Clock } from 'lucide-react';
import FilterBar from '../components/filters/FilterBar';
import RideCard from '../components/ride/RideCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { useRides } from '../hooks/useRides';

const Home = () => {
  const navigate = useNavigate();
  
  const { rides, loading, setFilters, filters } = useRides();

  const handleSearch = (newFilters: { destination?: string; date?: string; timeFrom?: string }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Smart Sorting & Filtering Logic
  const processedRides = useMemo(() => {
    if (!rides) return [];

    let filtered = [...rides];

    // Status & Time Sorting
    filtered.sort((a, b) => {
      // 1. Prioritize OPEN rides
      if (a.status === 'OPEN' && b.status !== 'OPEN') return -1;
      if (a.status !== 'OPEN' && b.status === 'OPEN') return 1;
      
      // 2. Then sort by Departure Time (Earliest first)
      return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
    });

    return filtered;
  }, [rides]);

  return (
    <div className="flex-1 w-full bg-[#FAFAFB] pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Impactful Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
              <Sparkles className="w-3 h-3" />
              Smart Campus Commuting
            </div>
            <h1 className="text-5xl font-extrabold text-[#111827] tracking-tighter mb-4 leading-[1.1]">
              Shared Rides, <br />
              <span className="text-primary italic">Better Stories.</span>
            </h1>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              Find secure communal rides or create your own pool in seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

             <button 
                onClick={() => navigate('/create-ride')}
                className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-1 transition-all active:scale-95"
             >
                <Plus className="w-5 h-5" />
                Create Ride
             </button>
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-gray-50 mb-12">
           <FilterBar onSearch={handleSearch} initialFilters={filters} />
        </div>

        {/* Dynamic Results Header */}
        <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-bold text-navy flex items-center gap-2">
              Available Pools
              <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full">
                {processedRides.length}
              </span>
            </h2>
        </div>

        {/* Ride Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              {processedRides.map(ride => (
                <RideCard key={ride.id} ride={ride} />
              ))}
              
              {/* Contextual Empty State / Promo */}
              {processedRides.length > 0 && processedRides.length < 4 && (
                <div className="bg-gradient-to-br from-navy to-navy/90 rounded-[2.5rem] p-10 shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute right-[-10%] bottom-[-10%] opacity-10">
                    <CarFront className="w-48 h-48" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Start your own pool</h3>
                    <p className="text-navy-100 text-sm opacity-80 leading-relaxed mb-8">
                      Can't find a ride for your specific time? Create one and let others join you.
                    </p>
                    <Link to="/create-ride" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-navy rounded-full text-xs font-bold hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4" />
                      Create Now
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
          
          {!loading && processedRides.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-gray-400 bg-white rounded-[3rem] border border-gray-100 shadow-sm border-dashed">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                 <Search className="w-10 h-10 text-gray-300" />
               </div>
               <p className="text-2xl font-bold text-navy mb-2">No matching pools</p>
               <p className="text-gray-500 max-w-xs text-center leading-relaxed">
                 We couldn't find any rides matching your criteria. Try adjusting your filters or create a new pool!
               </p>
               <Link to="/create-ride" className="mt-8 px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:shadow-teal-500/20 transition-all">
                  Create a Ride
               </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

