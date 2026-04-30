"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // In a real prod app, we would hide non-operational error details from the client
    // For this campus project, we'll keep it simple but structured
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
exports.globalErrorHandler = globalErrorHandler;
