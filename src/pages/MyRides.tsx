import { useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import RideCard from '../components/ride/RideCard';
import { useAuth } from '../context/AuthContext';
// import { getMe } from '../api/auth';

const MyRides = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ACTIVE');
  
  const mockUser = (id: string, name: string) => ({
    id,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@university.edu`,
    isVerified: true,
    createdAt: new Date().toISOString()
  });

  // Using mocks for UI presentation if backend missing real structure
  const activeRides = [
    {
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
    }
  ];

  const pastRides = [
    {
      id: "mock2",
      creatorId: user?.id || "u1",
      creator: user || mockUser("u1", "Me"),
      destination: "Terminal 3 IGI Airport",
      pickupLocation: "Hostel Block C",
      date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      departureTime: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: "COMPLETED" as const,
      autoAccept: true,
      maxSeats: 4,
      totalFare: 1600,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      members: [
        { id: 'm21', rideId: 'mock2', userId: 'u2', user: mockUser('u2', 'User 2'), status: 'ACTIVE' as const, joinedAt: new Date().toISOString() },
        { id: 'm22', rideId: 'mock2', userId: 'u3', user: mockUser('u3', 'User 3'), status: 'ACTIVE' as const, joinedAt: new Date().toISOString() },
        { id: 'm23', rideId: 'mock2', userId: 'u4', user: mockUser('u4', 'User 4'), status: 'ACTIVE' as const, joinedAt: new Date().toISOString() }
      ]
    },
    {
      id: "mock3",
      creatorId: "u4",
      creator: mockUser("u4", "Ishani V."),
      destination: "Cyber Hub",
      pickupLocation: "Library Plaza",
      date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
      departureTime: new Date(Date.now() - 86400000 * 5).toISOString(),
      status: "CANCELLED" as const,
      autoAccept: false,
      maxSeats: 3,
      totalFare: 450,
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      members: [
        { id: 'm31', rideId: 'mock3', userId: 'u5', user: mockUser('u5', 'User 5'), status: 'ACTIVE' as const, joinedAt: new Date().toISOString() }
      ]
    }
  ];

  const displayRides = activeTab === 'ACTIVE' ? activeRides : pastRides;

  return (
    <div className="flex-1 w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-navy tracking-tight mb-2">My Rides</h1>
          <p className="text-gray-500 max-w-xl">
            Manage your upcoming trips and review your ride history.
          </p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex bg-gray-200/60 p-1.5 rounded-2xl w-max mb-8 border border-gray-200">
          <button 
            onClick={() => setActiveTab('ACTIVE')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'ACTIVE' 
                ? 'bg-white text-navy shadow-sm' 
                : 'text-gray-500 hover:text-navy hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Active Rides
          </button>
          <button 
            onClick={() => setActiveTab('PAST')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'PAST' 
                ? 'bg-white text-navy shadow-sm' 
                : 'text-gray-500 hover:text-navy hover:bg-gray-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Past Rides
          </button>
        </div>

        {/* Ride Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayRides.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border border-gray-100 border-dashed">
               <p className="text-lg font-medium text-navy mb-2">No {activeTab.toLowerCase()} rides</p>
               <p className="text-sm">You haven't participated in any rides yet.</p>
            </div>
          ) : (
            displayRides.map(ride => (
              <RideCard 
                key={ride.id} 
                ride={ride} 
                isCreator={ride.creator?.id === user?.id} 
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default MyRides;
