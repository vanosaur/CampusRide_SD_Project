"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTPSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string().email('Invalid email format').refine((email) => email.endsWith('@nst.rishihood.edu.in') || email.endsWith('.edu'), 'Please use your university email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
exports.verifyOTPSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        otp: zod_1.z.string().length(6, 'OTP must be exactly 6 digits'),
    }),
});
