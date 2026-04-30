import { User } from '../types';

export interface AuthResponse {
  data: {
    token?: string;
    user?: User;
    message?: string;
  };
}

class AuthService {

  public async generateToken(user: User): Promise<string> {
    // Mock JWT generation
    return `mock-jwt-${user.id}`;
  }

  public async verifyToken(token: string): Promise<User | null> {
    // Mock token verification
    if (token.startsWith('mock-jwt-')) {
      return {
        id: token.split('-')[2],
        name: 'Mock User',
        email: 'mock@example.com',
        isVerified: true,
        createdAt: new Date().toISOString()
      };
    }
    return null;
  }

  public async hashPassword(pwd: string): Promise<string> {
    // Mock password hashing
    return `hashed-${pwd}`;
  }

  // API Methods
  public async register(data: Partial<User>): Promise<AuthResponse> {
    console.log('Class AuthService.register:', data);
    return Promise.resolve({ data: { message: 'OTP sent successfully' } });
  }

  public async verifyOTP(data: { email: string; otp: string }): Promise<AuthResponse> {
    console.log('Class AuthService.verifyOTP:', data);
    return Promise.resolve({ 
      data: { 
        token: 'mock-jwt-token', 
        user: { id: 'u1', name: 'Priya Sharma', email: data.email, isVerified: true, createdAt: new Date().toISOString() } 
      } 
    });
  }

  public async login(data: { email: string }): Promise<AuthResponse> {
    console.log('Class AuthService.login:', data);
    return Promise.resolve({ 
      data: { 
        token: 'mock-jwt-token', 
        user: { id: 'u1', name: 'Priya Sharma', email: data.email, isVerified: true, createdAt: new Date().toISOString() } 
      } 
    });
  }

  public async getMe(): Promise<AuthResponse> {
    return Promise.resolve({ 
      data: { 
        user: { id: 'u1', name: 'Priya Sharma', email: 'priya@example.com', isVerified: true, createdAt: new Date().toISOString() } 
      } 
    });
  }
}

export const authService = new AuthService();
export default AuthService;
