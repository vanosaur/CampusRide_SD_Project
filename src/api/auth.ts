import api from './axios';
import { User } from '../types';

export interface AuthResponse {
  data: {
    token?: string;
    user?: User;
    message?: string;
  };
}

export const register = (data: Partial<User>): Promise<AuthResponse> => {
  return api.post('/auth/register', data);
};

export const verifyOTP = (data: { email: string; otp: string; name?: string; phone?: string }): Promise<AuthResponse> => {
  return api.post('/auth/verify-otp', data);
};

export const login = (data: { email: string }): Promise<AuthResponse> => {
  return api.post('/auth/login', data);
};

export const getMe = (): Promise<AuthResponse> => {
  return api.get('/auth/me');
};
