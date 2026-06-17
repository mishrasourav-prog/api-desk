// // import { Request, Response, NextFunction } from "express";
// // import jwt from "jsonwebtoken";

// // export const verifyJWT = (
// //   req: Request,
// //   res: Response,
// //   next: NextFunction
// // ): void => {
// //   const token = req.cookies.accessToken;
// //   if (!token) {
// //     res.status(401).json({
// //       message: "Unauthorized",
// //     });
// //     return;
// //   }

// //   try {
// //     const decoded = jwt.verify(
// //       token,
// //       process.env.ACCESS_TOKEN_SECRET!
// //     );

// //     (req as any).user = decoded;

// //     next();
// //   } catch {
// //     res.status(401).json({
// //       message: "Invalid or Expired Token",
// //     });
// //   }
// // };


// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";

// export const verifyJWT = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.cookies?.accessToken;

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET!
//     ) as { id: string };

//     req.user = {
//       _id: new mongoose.Types.ObjectId(decoded.id),
//     };

//     next();
//   } catch {
//     return res.status(401).json({ message: "Invalid or Expired Token" });
//   }
// };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { id: string };

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};