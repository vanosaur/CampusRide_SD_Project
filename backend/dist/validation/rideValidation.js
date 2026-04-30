"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRidesQuerySchema = exports.rideIdParamSchema = exports.updateMemberStatusSchema = exports.createRideSchema = void 0;
const zod_1 = require("zod");
// ─── Create Ride ─────────────────────────────────────────────────────────────
exports.createRideSchema = zod_1.z.object({
    body: zod_1.z.object({
        destination: zod_1.z.string().min(3, 'Destination must be at least 3 characters'),
        pickupLocation: zod_1.z.string().min(3, 'Pickup location must be at least 3 characters'),
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
        departureTime: zod_1.z.string().datetime({ message: 'Invalid ISO datetime format' }),
        maxSeats: zod_1.z.number().int().min(1).max(6, 'Max seats must be between 1 and 6'),
        totalFare: zod_1.z.number().positive('Total fare must be a positive number'),
        autoAccept: zod_1.z.boolean().optional(),
        genderPreference: zod_1.z.enum(['ANY', 'MALE', 'FEMALE']).optional(),
    }),
});
// ─── Update Member Status ─────────────────────────────────────────────────────
exports.updateMemberStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Ride ID is required'),
    }),
    body: zod_1.z.object({
        memberUserId: zod_1.z.string().min(1, 'Member User ID is required'),
        status: zod_1.z.enum(['ACTIVE', 'REJECTED', 'PENDING']),
    }),
});
// ─── Ride ID Param ────────────────────────────────────────────────────────────
// Reusable schema for any route that only takes :id in params.
exports.rideIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Ride ID is required'),
    }),
});
// ─── Search & Filter Query ────────────────────────────────────────────────────
// Validates all supported query parameters for GET /api/rides.
// HH:MM regex: 00:00 – 23:59
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
exports.getRidesQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        destination: zod_1.z.string().optional(),
        date: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format')
            .optional(),
        timeFrom: zod_1.z
            .string()
            .regex(timeRegex, 'timeFrom must be in HH:MM (24-hour) format')
            .optional(),
        timeTo: zod_1.z
            .string()
            .regex(timeRegex, 'timeTo must be in HH:MM (24-hour) format')
            .optional(),
        genderPreference: zod_1.z.enum(['ANY', 'MALE', 'FEMALE']).optional(),
        status: zod_1.z
            .enum(['OPEN', 'FULL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
            .optional(),
    }),
});
