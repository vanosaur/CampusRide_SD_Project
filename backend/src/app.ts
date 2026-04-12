import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import rideRoutes from './routes/rideRoutes';
import chatRoutes from './routes/chatRoutes';
import notificationRoutes from './routes/notificationRoutes';
import { globalErrorHandler } from './middleware/errorMiddleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/rides', chatRoutes); // /api/rides/:rideId/messages etc
app.use('/api/notifications', notificationRoutes);

// Healthcheck
app.get('/', (req, res) => res.send('CampusRide API is running'));

// Global Error Handler
app.use(globalErrorHandler);

export default app;
