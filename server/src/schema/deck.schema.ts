import { z } from 'zod';

export const createMockRouteSchema = z.object({
    body: z.object({
        path: z.string()
            .min(1)
            .trim()
            // 🌟 STEP 1: Collapse double or multiple slashes (//) into a single slash (/)
            .transform(val => val.replace(/\/+/g, '/'))
            // 🌟 STEP 2: Ensure it has exactly one leading slash
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
        }),

        description: z.string().optional().default("")
    })
});