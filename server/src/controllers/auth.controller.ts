import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import {User} from "../models/user.model";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password, email, firstName, lastName } = req.body;

  // validation
  if (!username || !email || !password || !firstName || !lastName) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    // check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        message: "User already exists or username taken",
      });
      return;
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

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "All fields are required",
      });
      return;
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!isValidPassword) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "1m" }
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
  maxAge: 1 * 60 * 1000, // 15 min
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: false, // true in production
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

res.status(200).json({
  message: "Login successful",
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
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

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


export const refreshAccessToken = async(req:Request , res:Response) => {
  try{
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
      res.status(401).json({
        message: "No refresh token",
      });
      return;
    }

    const decoded = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET!) as { id: string };

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "1m" }
    );

     res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1 * 60 * 1000,
    });

      res.status(200).json({
      success: true,
    });
  } catch {
    res.status(401).json({
      message: "Invalid refresh token",
    });
  }

};