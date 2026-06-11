import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {User} from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, password, email, firstName, lastName } = req.body;

  // validation
  if (!username || !email || !password || !firstName || !lastName) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    // check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return next(new ApiError(400, "User already exists or username taken"));
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user directly
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    console.log((req as any).user);

    res.status(201).json(new ApiResponse(201, { userId: user._id }, "User registered successfully"));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, "All fields are required"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ApiError(401, "Invalid email or password"));
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!isValidPassword) {
      return next(new ApiError(401, "Invalid email or password"));
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

  

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );


      res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: false, 
  sameSite: "lax",
  maxAge: 15 * 60 * 1000, // 15 min
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: false, // true in production
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

res.status(200).json(new ApiResponse(200, null, "Login successful"));
  } catch (error) {
    console.error(error);

    next(error);
  }
};


export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.clearCookie("accessToken", {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
   
});

res.clearCookie("refreshToken", {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
 
});

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new ApiError(401, "No refresh token"));
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: string };

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json(new ApiResponse(200, null, "Access token refreshed"));
  } catch (error) {
    next(new ApiError(401, "Invalid refresh token"));
  }
};