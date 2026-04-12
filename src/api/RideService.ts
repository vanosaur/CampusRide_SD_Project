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

class RideService {
  // Mock data to simulate repository
  private rides: Ride[] = [
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
    }
  ];

  public async createRide(data: Partial<Ride>): Promise<RideResponse> {
    console.log('RideService.createRide:', data);
    const now = new Date().toISOString();
    const newRide: Ride = {
      id: Date.now().toString(),
      creatorId: data.creatorId || 'test-creator',
      creator: data.creator || mockUser('test-creator', 'Test Creator'),
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
    this.rides.push(newRide);
    return { data: { ride: newRide, id: newRide.id } };
  }

  public async joinRide(rideId: string, user: User): Promise<RideResponse> {
    console.log('RideService.joinRide:', rideId, user);
    return { data: { message: 'Join request sent' } };
  }

  public async closeRide(rideId: string): Promise<RideResponse> {
    console.log('RideService.closeRide:', rideId);
    return { data: { message: 'Ride closed' } };
  }

  public async cancelRide(rideId: string): Promise<RideResponse> {
    console.log('RideService.cancelRide:', rideId);
    return { data: { message: 'Ride cancelled' } };
  }

  // Helper API methods
  public async getRides(_params?: any): Promise<RidesListResponse> {
    return { data: { rides: this.rides } };
  }

  public async getRideById(id: string): Promise<RideResponse> {
    const ride = this.rides.find(r => r.id === id);
    return { data: { ride } };
  }
}

export const rideService = new RideService();
export default RideService;
