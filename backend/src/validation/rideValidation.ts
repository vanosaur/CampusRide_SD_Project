import { z } from 'zod';

export const createRideSchema = z.object({
  body: z.object({
    destination: z.string().min(3, 'Destination must be at least 3 characters'),
    pickupLocation: z.string().min(3, 'Pickup location must be at least 3 characters'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    departureTime: z.string().datetime({ message: 'Invalid ISO datetime format' }),
    maxSeats: z.number().int().min(1).max(6, 'Max seats must be between 1 and 6'),
    totalFare: z.number().positive('Total fare must be a positive number'),
    autoAccept: z.boolean().optional(),
  }),
});

export const updateMemberStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Ride ID is required'),
  }),
  body: z.object({
    memberUserId: z.string().min(1, 'Member User ID is required'),
    status: z.enum(['ACTIVE', 'REJECTED', 'PENDING']),
  }),
});
