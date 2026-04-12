// import api from './axios'
import { Ride, User } from '../types';

export interface RideResponse {
  data: {
    ride?: Ride;
    id?: string;
    message?: string;
  };
}

export interface RidesListResponse {
  data: {
    rides: Ride[];
  };
}

const mockUser = (id: string, name: string): User => ({
  id,
  name,
  email: `${name.toLowerCase().replace(' ', '.')}@university.edu`,
  isVerified: true,
  createdAt: new Date().toISOString()
});

const mockRides: Ride[] = [
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
    status: "OPEN",
    autoAccept: false,
    createdAt: new Date().toISOString(),
    members: [
      { id: 'm1', rideId: '1', userId: 'u2', user: mockUser('u2', 'Arjun Mehta'), status: 'ACTIVE', joinedAt: new Date().toISOString() }
    ]
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
    status: "OPEN",
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
    status: "OPEN",
    autoAccept: false,
    createdAt: new Date().toISOString(),
    members: [
      { id: 'm3', rideId: '3', userId: 'u3', user: mockUser('u3', 'Sneha Patel'), status: 'PENDING', joinedAt: new Date().toISOString() }
    ],
  }
];

export const createRide = (data: Partial<Ride>): Promise<RideResponse> => {
  console.log('Mock Create Ride:', data);
  const now = new Date().toISOString();
  const newRide: Ride = { 
    id: Date.now().toString(), 
    creatorId: 'test-creator-id',
    creator: mockUser('test-creator-id', 'Test Creator'),
    destination: data.destination || '',
    pickupLocation: data.pickupLocation || '',
    date: data.date || now.split('T')[0],
    departureTime: data.departureTime || now,
    maxSeats: data.maxSeats || 4,
    totalFare: data.totalFare || 0,
    status: 'OPEN', 
    autoAccept: data.autoAccept || false,
    createdAt: now,
    members: []
  };
  return Promise.resolve({ data: { ride: newRide, id: newRide.id } });
};

export const getRides = (params?: any): Promise<RidesListResponse> => {
  console.log('Mock Get Rides:', params);
  return Promise.resolve({ data: { rides: mockRides } });
};

export const getRideById = (id: string): Promise<RideResponse> => {
  console.log('Mock Get Ride By ID:', id);
  const ride = mockRides.find(r => r.id === id) || mockRides[0];
  return Promise.resolve({ data: { ride } });
};

export const joinRide = (id: string): Promise<RideResponse> => {
  console.log('Mock Join Ride:', id);
  return Promise.resolve({ data: { message: 'Join request sent' } });
};

export const closeRide = (id: string): Promise<RideResponse> => {
  console.log('Mock Close Ride:', id);
  return Promise.resolve({ data: { message: 'Ride closed' } });
};

export const cancelRide = (id: string): Promise<RideResponse> => {
  console.log('Mock Cancel Ride:', id);
  return Promise.resolve({ data: { message: 'Ride cancelled' } });
};

export const acceptMember = (rideId: string, memberId: string): Promise<RideResponse> => {
  console.log('Mock Accept Member:', rideId, memberId);
  return Promise.resolve({ data: { message: 'Member accepted' } });
};

export const rejectMember = (rideId: string, memberId: string): Promise<RideResponse> => {
  console.log('Mock Reject Member:', rideId, memberId);
  return Promise.resolve({ data: { message: 'Member rejected' } });
};
