// src/schema/deck.schema.ts
import { z } from 'zod';

export const createMockRouteSchema = z.object({
    body: z.object({
        
        path: z.string()
            .min(1)
            .trim()
            .transform(val => val.startsWith('/') ? val : `/${val}`), 
    
        method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
        
       
        responseStatus: z.number()
            .int()
            .min(100)
            .max(599),
        
       
        responseBody: z.string().refine((val) => {
            try {
                JSON.parse(val);
                return true;
            } catch {
                return false;
            }
        })
    })
});