import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  const decoded = AuthService.verifyToken(token);
  if (!decoded) return res.status(401).json({ message: 'Token is not valid' });

  (req as any).user = decoded;
  next();
};
