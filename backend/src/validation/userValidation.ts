import { z } from 'zod';

// ─── Update Profile ──────────────────────────────────────────────────────────
// At least one field must be provided; all fields are optional individually.

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(80, 'Name must be at most 80 characters')
        .optional(),
      phone: z
        .string()
        .regex(/^\+?[0-9]{7,15}$/, 'Phone must be a valid number (7-15 digits, optional leading +)')
        .optional(),
      gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    })
    .refine(
      (data) => Object.values(data).some((v) => v !== undefined),
      { message: 'At least one field (name, phone, gender) must be provided' }
    ),
});

// ─── Update Profile Photo ────────────────────────────────────────────────────
// Accepts a valid HTTPS URL pointing to the uploaded image (e.g. Cloudinary).

export const updatePhotoSchema = z.object({
  body: z.object({
    profilePhoto: z
      .string()
      .url('profilePhoto must be a valid URL')
      .refine(
        (url) => url.startsWith('https://'),
        'profilePhoto URL must use HTTPS'
      ),
  }),
});
