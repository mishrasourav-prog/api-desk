import { Deck } from "../models/deck.model";
import { AuthRequest } from "../types/authRequest";
import { Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { RequestLog } from "../models/requestLog.model";
import { logEmitter } from '../utils/logEmitter';


export const executeMock = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
          const startTime = Date.now(); 
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

        const mockIndex = segments.indexOf("mock");

        // 3. Extract metadata variables using structural position indices
      const userId = segments[mockIndex + 1];
      let subPath = '/' + segments.slice(mockIndex + 2).join('/');

        console.log("Segments:", segments);
console.log("User:", userId);
console.log("SubPath:", subPath);

        // Log everything beautifully so you can watch it process live traffic
        console.log("--- MOCK INTERCEPTOR ---");
        console.log(`Creator ID:  ${userId}`);
        
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

        const latencyMs = `${Math.round(performance.now() - startTime)}ms`;

logEmitter.emit(`new-log:${matchedRoute.creator}`, {
    id: crypto.randomUUID(),
    deckId: matchedRoute._id,
    timestamp: new Date().toISOString(),
    method: requestMethod,
    status: matchedRoute.responseStatus,
    latency: latencyMs,
    ipAddress: req.ip || "127.0.0.1",
    path: subPath,
});
await RequestLog.create({
    deckId: matchedRoute._id,
    method: requestMethod,
    status: matchedRoute.responseStatus,
    latency: latencyMs,
    ipAddress: req.ip || "127.0.0.1",
    path: subPath
});

        // 7. Parse and return your custom mock server response data
        return res.status(matchedRoute.responseStatus).json(JSON.parse(matchedRoute.responseBody));

    } catch (error) {
        // Passes any deep errors down to your Express global error handler
        next(error);
    }
};

export const getRecentLogs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    const { username } = req.params;

    const userDecks = await Deck.find({
      creator: username
    }).select("_id");

    const deckIds = userDecks.map(deck => deck._id);

    const logs = await RequestLog.find({
      deckId: { $in: deckIds }
    })
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      logs
    });

  } catch (error) {
    next(error);
  }
};





export const handleMockRequest = async (req: AuthRequest, res: Response) => {
    // ⏱️ Start a high-resolution timer
    const startTime = performance.now();

    // ... your existing code that fetches the mock response body & status ...
    const mockStatus = 200; // replace with your dynamic status
    const mockBody = { message: "Hello World" }; // replace with your dynamic body

    // ⏱️ Stop the timer and calculate processing latency
    const endTime = performance.now();
    const latencyMs = `${Math.round(endTime - startTime)}ms`;

    // 📣 Broadcast the log data live to any open frontend clients
    logEmitter.emit('new-log', {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        method: req.method,
        status: mockStatus,
        latency: latencyMs,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
        // Extract the end path name so the frontend can check it
        path: req.params.path || req.path.split('/').pop() || '', 
    });

    // Send your mock response out to the client testing your link
    return res.status(mockStatus).json(mockBody);
};