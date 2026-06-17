import { Deck } from "../models/deck.model";
import { AuthRequest } from "../types/authRequest";
import { Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { RequestLog } from "../models/requestLog.model";
import { logEmitter } from '../utils/logEmitter';
import { ApiResponse } from "../utils/apiResponse";


// export const executeMock = async (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//         const startTime = Date.now(); 
//         const requestMethod = req.method as "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
//         const cleanUrl = req.originalUrl.split('?')[0];
//         const segments = cleanUrl.split('/').filter(Boolean);

//         if (segments.length < 3) {
//             return next(new ApiError(400, "Malformed mock URL structure. Expected format: /mock/:userId/:deckPath/*"));
//         }

//       const mockIndex = segments.indexOf("mock");
//       const userId = segments[mockIndex + 1];
//       let subPath = '/' + segments.slice(mockIndex + 2).join('/');


//       const pathWithSlash = subPath.startsWith('/') ? subPath : '/' + subPath;
//       const pathWithoutSlash = pathWithSlash.substring(1);

//       const matchedRoute = await Deck.findOne({ 
//             creator: userId, 
//             method: requestMethod,
//             path: { $in: [pathWithSlash, pathWithoutSlash] }
//       });
//       if (!matchedRoute) {
//             return next(new ApiError(404, `No mock configuration found for ${requestMethod} ${subPath}`));
//         }

//         const latencyMs = `${Math.round(performance.now() - startTime)}ms`;

//        logEmitter.emit(
//     `new-log:${matchedRoute.userId}:${matchedRoute._id}`,
//     {
//         id: crypto.randomUUID(),
//         deckId: matchedRoute._id,
//         timestamp: new Date().toISOString(),
//         method: requestMethod,
//         status: matchedRoute.responseStatus,
//         latency: latencyMs,
//         ipAddress: req.ip || "127.0.0.1",
//         path: subPath,
//     }
// );
//       await RequestLog.create({
//             deckId: matchedRoute._id,
//             method: requestMethod,
//             status: matchedRoute.responseStatus,
//             latency: latencyMs,
//             ipAddress: req.ip || "127.0.0.1",
//             path: subPath
//       });

//         return res.status(matchedRoute.responseStatus).json(JSON.parse(matchedRoute.responseBody));

//     } catch (error) {
//         next(error);
//     }
// };


export const executeMock = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const startTime = Date.now();
    const requestMethod = req.method as "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

    const cleanUrl = req.originalUrl.split('?')[0];
    const segments = cleanUrl.split('/').filter(Boolean);

    if (segments.length < 3) {
      return next(
        new ApiError(
          400,
          "Invalid mock URL format. Expected: /mock/:userId/:path"
        )
      );
    }

    const mockIndex = segments.indexOf("mock");
    const userId = segments[mockIndex + 1];
    let subPath = '/' + segments.slice(mockIndex + 2).join('/');

    const pathWithSlash = subPath.startsWith('/') ? subPath : '/' + subPath;
    const pathWithoutSlash = pathWithSlash.substring(1);

    const matchedRoute = await Deck.findOne({
      creator: userId,
      method: requestMethod,
      path: { $in: [pathWithSlash, pathWithoutSlash] }
    });

    if (!matchedRoute) {
      return next(
        new ApiError(
          404,
          `No mock endpoint found for ${requestMethod} ${subPath}`
        )
      );
    }

    const latencyMs = `${Math.round(performance.now() - startTime)}ms`;

    logEmitter.emit(
      `new-log:${matchedRoute.userId}:${matchedRoute._id}`,
      {
        id: crypto.randomUUID(),
        deckId: matchedRoute._id,
        timestamp: new Date().toISOString(),
        method: requestMethod,
        status: matchedRoute.responseStatus,
        latency: latencyMs,
        ipAddress: req.ip || "127.0.0.1",
        path: subPath,
      }
    );

    await RequestLog.create({
      deckId: matchedRoute._id,
      method: requestMethod,
      status: matchedRoute.responseStatus,
      latency: latencyMs,
      ipAddress: req.ip || "127.0.0.1",
      path: subPath
    });

    return res.status(matchedRoute.responseStatus).json(
      JSON.parse(matchedRoute.responseBody)
    );

  } catch (error) {
    next(new ApiError(500, "Failed to execute mock request"));
  }
};

// export const getRecentLogs = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {

//     const { username , deckId } = req.params;

//     const userDecks = await Deck.find({
//       creator: username
//     }).select("_id");

//     const deckIds = userDecks.map(deck => deck._id);

//     const logs = await RequestLog.find({
//       deckId: { $in: deckIds }
//     })
//       .sort({ timestamp: -1 })
//       .limit(50);

//     res.status(200).json({
//       success: true,
//       logs
//     });

//   } catch (error) {
//     next(error);
//   }
// };

// export const getRecentLogs = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { deckId } = req.params;
//     const userId = req.user.id;

//     const logs = await RequestLog.find({
//       deckId: deckId,
//     })
//       .sort({ timestamp: -1 })
//       .limit(50);

//     res.status(200).json({
//       success: true,
//       logs
//     });

//   } catch (error) {
//     next(error);
//   }
// };

export const getRecentLogs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { deckId } = req.params;

    const logs = await RequestLog.find({ deckId })
      .sort({ timestamp: -1 })
      .limit(50);

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Logs fetched successfully",
        data: { logs }
      })
    );

  } catch (error) {
    next(new ApiError(500, "Failed to fetch logs"));
  }
};





// export const handleMockRequest = async (req: AuthRequest, res: Response) => {
//   const userId = req.user.id;
//     const { deckId} = req.params; 
//     const startTime = performance.now();
//     const mockStatus = 200; 
//     const mockBody = { message: "Hello World" };
//     const endTime = performance.now();
//     const latencyMs = `${Math.round(endTime - startTime)}ms`;

//     logEmitter.emit(`new-log:${userId}:${deckId}`, {
//     id: crypto.randomUUID(),
//     timestamp: new Date().toISOString(),
//     method: req.method,
//     status: mockStatus,
//     latency: latencyMs,
//     ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
//     path: req.params.path || req.path.split('/').pop() || '',
// });

//     return res.status(mockStatus).json(mockBody);
// };


export const handleMockRequest = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { deckId } = req.params;

  const startTime = performance.now();

  const mockStatus = 200;
  const mockBody = { message: "Hello World" };

  const endTime = performance.now();
  const latencyMs = `${Math.round(endTime - startTime)}ms`;

  logEmitter.emit(`new-log:${userId}:${deckId}`, {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    method: req.method,
    status: mockStatus,
    latency: latencyMs,
    ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
    path: req.params.path || req.path.split("/").pop() || "",
  });

  return res.status(mockStatus).json(mockBody);
};