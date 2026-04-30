import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import { SocketManager } from './patterns/SocketManager';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL ERROR: MONGO_URI is not defined in environment variables.');
    process.exit(1);
  } else {
    console.warn('Warning: MONGO_URI not found, falling back to local MongoDB');
  }
}

const finalUri = MONGO_URI || 'mongodb://localhost:27017/campusride';

const server = http.createServer(app);

// Initialize Socket.io
SocketManager.getInstance().init(server);

mongoose.connect(finalUri)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
