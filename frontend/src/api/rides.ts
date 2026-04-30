import api from './axios';
import { Ride } from '../types';

export interface RideResponse {
  data: {
    ride?: Ride;
    id?: string;
    message?: string;
    member?: any;
  };
}

export interface RidesListResponse {
  data: {
    rides: Ride[];
  };
}

export const createRide = (data: Partial<Ride>): Promise<RideResponse> => {
  return api.post('/rides', data);
};

export const getRides = (params?: any): Promise<RidesListResponse> => {
  return api.get('/rides', { params });
};

export const getMyRides = (): Promise<RidesListResponse> => {
  return api.get('/rides/my');
};

export const getRideById = (id: string): Promise<RideResponse> => {
  return api.get(`/rides/${id}`);
};

export const joinRide = (id: string): Promise<RideResponse> => {
  return api.post(`/rides/${id}/join`);
};

export const cancelRide = (id: string): Promise<RideResponse> => {
  return api.put(`/rides/${id}/cancel`);
};

export const confirmRide = (id: string): Promise<RideResponse> => {
  return api.put(`/rides/${id}/confirm`);
};

export const updateMemberStatus = (id: string, memberUserId: string, status: string): Promise<RideResponse> => {
  return api.put(`/rides/${id}/members`, { memberUserId, status });
};
