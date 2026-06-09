// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const verifyJWT = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   const authHeader = req.cookies.accessToken;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     res.status(401).json({
//       message: "Unauthorized",
//     });
//     return;
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET!
//     );

//     (req as any).user = decoded;

//     next();
//   } catch (error) {
//     res.status(401).json({
//       message: "Invalid or Expired Token",
//     });
//   }
// };


import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    );

    (req as any).user = decoded;

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or Expired Token",
    });
  }
};