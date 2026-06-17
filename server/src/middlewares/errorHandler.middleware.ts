// import { Request, Response, NextFunction } from 'express';
// import { ApiError } from '../utils/apiError';

// export const errorHandler = (
//     err: any,
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     let error = err;
//     if (!(error instanceof ApiError)) {
//         const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
//         const message = error.message || "Internal Server Error";
//         error = new ApiError(statusCode, message, error?.errors || [], err.stack);
//     }

//     const response = {
//         success: error.success,
//         statusCode: error.statusCode,
//         message: error.message,
//         errors: error.errors,
//         ...(process.env.NODE_ENV === 'development' && { stack: error.stack }) // Leak stack trace ONLY in local dev
//     };

//     return res.status(error.statusCode).json(response);
// };

import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = err;

    // Convert unknown errors into ApiError
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode ||
            (error.name === "ValidationError" ? 400 : 500);

        const message = error.message || "Internal Server Error";

        const errors = error?.errors || [];

        error = new ApiError(statusCode, message, errors);
    }

    const response = {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors || [],
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
    };

    return res.status(error.statusCode).json(response);
};