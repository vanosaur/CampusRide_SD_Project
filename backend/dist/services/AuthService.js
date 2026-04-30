"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    static async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt_1.default.hash(password, saltRounds);
    }
    static async comparePassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
    static generateToken(user) {
        return jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, AuthService.jwtSecret, { expiresIn: '7d' });
    }
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, AuthService.jwtSecret);
        }
        catch (e) {
            return null;
        }
    }
}
exports.AuthService = AuthService;
AuthService.jwtSecret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
