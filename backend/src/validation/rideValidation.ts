import { z } from 'zod';

// ─── Create Ride ─────────────────────────────────────────────────────────────

export const createRideSchema = z.object({
  body: z.object({
    destination: z.string().min(3, 'Destination must be at least 3 characters'),
    pickupLocation: z.string().min(3, 'Pickup location must be at least 3 characters'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    departureTime: z.string().datetime({ message: 'Invalid ISO datetime format' }),
    maxSeats: z.number().int().min(1).max(6, 'Max seats must be between 1 and 6'),
    totalFare: z.number().positive('Total fare must be a positive number'),
    autoAccept: z.boolean().optional(),
    genderPreference: z.enum(['ANY', 'MALE', 'FEMALE']).optional(),
  }),
});

// ─── Update Member Status ─────────────────────────────────────────────────────

export const updateMemberStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Ride ID is required'),
  }),
  body: z.object({
    memberUserId: z.string().min(1, 'Member User ID is required'),
    status: z.enum(['ACTIVE', 'REJECTED', 'PENDING']),
  }),
});

// ─── Ride ID Param ────────────────────────────────────────────────────────────
// Reusable schema for any route that only takes :id in params.

export const rideIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Ride ID is required'),
  }),
});

// ─── Search & Filter Query ────────────────────────────────────────────────────
// Validates all supported query parameters for GET /api/rides.
// HH:MM regex: 00:00 – 23:59

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const getRidesQuerySchema = z.object({
  query: z.object({
    destination: z.string().optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format')
      .optional(),
    timeFrom: z
      .string()
      .regex(timeRegex, 'timeFrom must be in HH:MM (24-hour) format')
      .optional(),
    timeTo: z
      .string()
      .regex(timeRegex, 'timeTo must be in HH:MM (24-hour) format')
      .optional(),
    genderPreference: z.enum(['ANY', 'MALE', 'FEMALE']).optional(),
    status: z
      .enum(['OPEN', 'FULL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
      .optional(),
  }),
});
