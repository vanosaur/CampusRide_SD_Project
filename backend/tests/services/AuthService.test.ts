import { describe, it, expect, beforeEach } from '@jest/globals';
import { AuthService } from '../../src/services/AuthService';
import { User, IUser } from '../../src/models/User';
import mongoose from 'mongoose';

describe('AuthService', () => {
  describe('Password Hashing', () => {
    it('should hash a password successfully', async () => {
      const password = 'mySecretPassword123';
      const hash = await AuthService.hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should successfully verify a correct password', async () => {
      const password = 'mySecretPassword123';
      const hash = await AuthService.hashPassword(password);
      
      const isMatch = await AuthService.comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const password = 'mySecretPassword123';
      const hash = await AuthService.hashPassword(password);
      
      const isMatch = await AuthService.comparePassword('wrongPassword', hash);
      expect(isMatch).toBe(false);
    });
  });

  describe('JWT Token Generation & Verification', () => {
    let mockUser: IUser;

    beforeEach(() => {
      mockUser = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Test User',
        email: 'test@nst.rishihood.edu.in',
        passwordHash: 'hashedPass',
        isVerified: true,
        createdAt: new Date(),
      } as unknown as IUser;
    });

    it('should generate a valid JWT token', () => {
      const token = AuthService.generateToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWTs have 3 parts
    });

    it('should verify a valid token and return user payload', () => {
      const token = AuthService.generateToken(mockUser);
      const decoded = AuthService.verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded).not.toBeNull();
      expect(decoded.id.toString()).toBe(mockUser._id.toString());
      expect(decoded.email).toBe(mockUser.email);
    });

    it('should return null for an invalid token', () => {
      const decoded = AuthService.verifyToken('invalid.token.here');
      expect(decoded).toBeNull();
    });
  });
});
