import { Deck } from "../models/deck.model";
import { AuthRequest } from "../types/authRequest";
import { Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export const executeMock = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const requestMethod = req.method as "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

        // 1. Isolate the URL path and strip off any query parameters (?key=value)
        const cleanUrl = req.originalUrl.split('?')[0];

        // 2. Break the URL down into an array of individual segments
        // e.g., "/mock/alanturing/my-deck/v1/users/profile" -> ["mock", "alanturing", "my-deck", "v1", "users", "profile"]
        const segments = cleanUrl.split('/').filter(Boolean);

        // Validation: The URL must at least have /mock/:userId/:deckPath
        if (segments.length < 3) {
            return next(new ApiError(400, "Malformed mock URL structure. Expected format: /mock/:userId/:deckPath/*"));
        }

        // 3. Extract metadata variables using structural position indices
        const userId = segments[1];   // Always position index 1
        const deckPath = segments[2]; // Always position index 2

        // 4. Capture everything following the deckPath as the target route path
        // e.g., ["v1", "users", "profile"] becomes "/v1/users/profile"
        let subPath = '/' + segments.slice(3).join('/');

        // Log everything beautifully so you can watch it process live traffic
        console.log("--- MOCK INTERCEPTOR ---");
        console.log(`Creator ID:  ${userId}`);
        console.log(`Deck Name:   ${deckPath}`);
        console.log(`Target Path: ${subPath}`);
        console.log(`HTTP Method: ${requestMethod}`);

        const pathWithSlash = subPath.startsWith('/') ? subPath : '/' + subPath;
const pathWithoutSlash = pathWithSlash.substring(1);

    const matchedRoute = await Deck.findOne({ 
    creator: userId, 
    method: requestMethod,
    path: { $in: [pathWithSlash, pathWithoutSlash] } // Matches either version!
});



        // 6. Safe error response: Returns a controlled 404 instead of crashing the server
        if (!matchedRoute) {
            return next(new ApiError(404, `No mock configuration found for ${requestMethod} ${subPath}`));
        }

        // 7. Parse and return your custom mock server response data
        return res.status(matchedRoute.responseStatus).json(JSON.parse(matchedRoute.responseBody));

    } catch (error) {
        // Passes any deep errors down to your Express global error handler
        next(error);
    }
};