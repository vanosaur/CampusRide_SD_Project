import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CarFront } from 'lucide-react';
import FilterBar from '../components/filters/FilterBar';
import RideCard from '../components/ride/RideCard';
import SkeletonCard from '../components/ui/SkeletonCard';


const Home = () => {
  const [activeFilter, setActiveFilter] = useState('All Rides');
  
  // Use mock data for testing since backend isn't ready
  // const { rides, loading } = useRides({ destination: activeFilter === 'All Rides' ? '' : activeFilter });
  
  // Replacing api call with mocks for visual accuracy of Prototype 3
  const loading = false;
  const mockUser = (id: string, name: string) => ({
    id,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@university.edu`,
    isVerified: true,
    createdAt: new Date().toISOString()
  });

  const rides = [
    {
      id: "1",
      creatorId: "c1",
      creator: mockUser("c1", "Aryan K."),
      destination: "Jahangirpuri Metro",
      pickupLocation: "Main Campus Gate 1",
      date: "2023-10-24",
      departureTime: new Date(Date.now() + 14 * 60000).toISOString(),
      maxSeats: 4,
      totalFare: 480,
      status: "OPEN" as const,
      autoAccept: false,
      createdAt: new Date().toISOString(),
      members: [
        { id: 'm1', rideId: '1', userId: 'u1', user: mockUser('u1', 'User 1'), status: 'ACTIVE' as const, joinedAt: new Date().toISOString() }
      ],
    },
    {
      id: "2",
      creatorId: "c2",
      creator: mockUser("c2", "Sanya M."),
      destination: "Terminal 3 Airport",
      pickupLocation: "Hostel Block C",
      date: "2023-11-15",
      departureTime: new Date(Date.now() + 180 * 60000).toISOString(),
      maxSeats: 4,
      totalFare: 1800,
      status: "OPEN" as const,
      autoAccept: true,
      createdAt: new Date().toISOString(),
      members: [],
    },
    {
      id: "3",
      creatorId: "c3",
      creator: mockUser("c3", "Rahul T."),
      destination: "New Delhi Railway",
      pickupLocation: "Admin Block",
      date: "2023-12-01",
      departureTime: new Date(Date.now() + 42 * 60000).toISOString(),
      maxSeats: 4,
      totalFare: 720,
      status: "OPEN" as const,
      autoAccept: false,
      createdAt: new Date().toISOString(),
      members: [
        { id: 'm31', rideId: '3', userId: 'u1', user: mockUser('u1', 'User 1'), status: 'ACTIVE' as const, joinedAt: new Date().toISOString() },
        { id: 'm32', rideId: '3', userId: 'u2', user: mockUser('u2', 'User 2'), status: 'ACTIVE' as const, joinedAt: new Date().toISOString() }
      ],
    },
    {
      id: "4",
      creatorId: "c4",
      creator: mockUser("c4", "Ishani V."),
      destination: "Cyber Hub, GGM",
      pickupLocation: "Library Plaza",
      date: "2023-12-10",
      departureTime: new Date(Date.now() + 300 * 60000).toISOString(),
      maxSeats: 4,
      totalFare: 1280,
      status: "OPEN" as const,
      autoAccept: false,
      createdAt: new Date().toISOString(),
      members: [],
    }
  ].filter(r => activeFilter === 'All Rides' || r.destination.includes(activeFilter.split(' ')[0]));

  return (
      <div className="flex-1 w-full bg-background pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-navy tracking-tight mb-3">Campus Commutes</h1>
            <p className="text-gray-500 max-w-2xl leading-relaxed">
              Hand-picked shared rides from your campus peers. Curated for safety and sustainability.
            </p>
          </div>

          <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {loading ? (
              [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                {rides.map(ride => (
                  <RideCard key={ride.id} ride={ride} />
                ))}
                
                {/* Promo Card per Prototype */}
                <div className="bg-primary rounded-3xl p-8 shadow-lg shadow-teal-500/20 text-white flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute right-[-20%] bottom-[-20%] opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                    <CarFront className="w-64 h-64" />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3">Can't find a ride?</h3>
                    <p className="text-primary-100 font-medium opacity-90 leading-relaxed max-w-[200px]">
                      Create your own pool and share the costs with other students heading your way.
                    </p>
                  </div>
                  
                  <Link to="/create-ride" className="relative z-10 mt-8 w-max">
                    <button className="bg-white text-primary font-bold px-8 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm">
                      Start a Pool
                    </button>
                  </Link>
                </div>
              </>
            )}
            
            {!loading && rides.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border border-gray-100 border-dashed">
                 <CarFront className="w-16 h-16 mb-4 opacity-50" />
                 <p className="text-lg font-medium text-navy">No rides found</p>
                 <p className="text-sm">Try adjusting your filters or create a new pool.</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Home;
