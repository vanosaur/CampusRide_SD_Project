export type RideStatus = 'OPEN' | 'FULL' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type MemberStatus = 'PENDING' | 'ACTIVE' | 'LEFT';
export type NotifType = 'RIDE_JOINED' | 'RIDE_CONFIRMED' | 'RIDE_CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  profilePhoto?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Ride {
  id: string;
  creatorId: string;
  creator: User; // Keep object for convenience, creatorId for diagram alignment
  destination: string;
  pickupLocation: string; // Keep existing field
  date: string;
  departureTime: string;
  maxSeats: number;
  totalFare: number;
  status: RideStatus;
  autoAccept: boolean;
  createdAt: string;
  members: RideMember[];
}

export interface RideMember {
  id: string;
  rideId: string;
  userId: string;
  user?: User; // Keep object for convenience
  status: MemberStatus;
  joinedAt: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  rideId: string;
  senderId: string;
  sender: User;
  content: string;
  isPinned: boolean;
  sentAt: string;
  isOwn?: boolean; // Keep for UI
}

export interface Notification {
  id: string;
  userId: string;
  type: NotifType | 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedRideID?: string;
  link?: string;
}
