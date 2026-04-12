// import api from './axios'
import { User } from '../types';

export interface AuthResponse {
  data: {
    token?: string;
    user?: User;
    message?: string;
  };
}

const mockUser: User = {
  id: 'u1',
  name: 'Priya Sharma',
  email: 'priya.sharma@university.edu.in',
  profilePhoto: 'https://i.pravatar.cc/150?u=priya',
  isVerified: true,
  createdAt: new Date().toISOString()
};

export const register = (data: Partial<User>): Promise<AuthResponse> => {
  console.log('Mock Register:', data);
  return Promise.resolve({ data: { message: 'OTP sent successfully' } });
};

export const verifyOTP = (data: { email: string; otp: string }): Promise<AuthResponse> => {
  console.log('Mock Verify OTP:', data);
  return Promise.resolve({ 
    data: { 
      token: 'mock-jwt-token', 
      user: mockUser 
    } 
  });
};

export const login = (data: { email: string }): Promise<AuthResponse> => {
  console.log('Mock Login:', data);
  return Promise.resolve({ 
    data: { 
      token: 'mock-jwt-token', 
      user: mockUser 
    } 
  });
};

export const getMe = (): Promise<AuthResponse> => {
  return Promise.resolve({ data: { user: mockUser } });
};
