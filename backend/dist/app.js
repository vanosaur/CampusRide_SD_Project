"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const rideRoutes_1 = __importDefault(require("./routes/rideRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/rides', rideRoutes_1.default);
app.use('/api/rides', chatRoutes_1.default); // /api/rides/:rideId/messages etc
app.use('/api/notifications', notificationRoutes_1.default);
// Healthcheck
app.get('/', (req, res) => res.send('CampusRide API is running'));
// Global Error Handler
app.use(errorMiddleware_1.globalErrorHandler);
exports.default = app;
