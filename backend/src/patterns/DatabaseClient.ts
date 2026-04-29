import mongoose from 'mongoose';

export class DatabaseClient {
  private static instance: DatabaseClient;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      console.log('MongoDB is already connected');
      return;
    }

    try {
      await mongoose.connect(uri);
      this.isConnected = true;
      console.log('Connected to MongoDB via DatabaseClient Singleton');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }
}
