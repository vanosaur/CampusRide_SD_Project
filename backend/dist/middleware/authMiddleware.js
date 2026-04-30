"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const AuthService_1 = require("../services/AuthService");
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token)
        return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = AuthService_1.AuthService.verifyToken(token);
    if (!decoded)
        return res.status(401).json({ message: 'Token is not valid' });
    req.user = decoded;
    next();
};
exports.authMiddleware = authMiddleware;
