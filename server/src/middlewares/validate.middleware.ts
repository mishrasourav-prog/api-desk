// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod'; // Import z directly
import { ApiError } from '../utils/apiError';

export const validate = (schema: z.ZodTypeAny) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate incoming parameter objects
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            }) as any;
            
            // Reassign the pristine, transformed variables back to Express
            req.body = parsed.body;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Safely format the validation error messages
                const errorMessages = error.issues.map(
                    err => `${err.path.slice(1).join('.') || 'field'}: ${err.message}`
                );
                
                return next(new ApiError(400, "Validation Failed", errorMessages));
            }
            next(error);
        }
    };