"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseClient = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class DatabaseClient {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!DatabaseClient.instance) {
            DatabaseClient.instance = new DatabaseClient();
        }
        return DatabaseClient.instance;
    }
    async connect(uri) {
        if (this.isConnected) {
            console.log('MongoDB is already connected');
            return;
        }
        try {
            await mongoose_1.default.connect(uri);
            this.isConnected = true;
            console.log('Connected to MongoDB via DatabaseClient Singleton');
        }
        catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }
    async disconnect() {
        if (this.isConnected) {
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            console.log('Disconnected from MongoDB');
        }
    }
}
exports.DatabaseClient = DatabaseClient;
