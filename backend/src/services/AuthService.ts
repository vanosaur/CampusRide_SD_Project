import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUser } from '../models/User';

export class AuthService {
  private static readonly jwtSecret = process.env.JWT_SECRET || 'fallback-secret-for-dev';

  public static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  public static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public static generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, email: user.email },
      AuthService.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  public static verifyToken(token: string): any {
    try {
      return jwt.verify(token, AuthService.jwtSecret);
    } catch (e) {
      return null;
    }
  }
}
