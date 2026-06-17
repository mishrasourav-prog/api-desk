import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {User} from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import { AuthRequest } from "../types/authRequest";
import { ResetPass } from "../models/passwordReset.model";
import { transporter } from "../utils/sendEmail";
import validator from "validator";


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, email, name } = req.body;

  if (!name?.trim()) {
  return next(new ApiError(400, "Name is required"));
  }
  if (!username || !email || !password || !name) {
    return next(new ApiError(400, "All fields are required"));
  }

  if(!validator.isEmail(email)){
     return next(new ApiError(400, "Provide valid email"));

  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return next(new ApiError(400, "User already exists or username taken"));
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      provider:"local"
    });
    return res.status(201).json(
  new ApiResponse({
    statusCode: 201,
    message: "User registered successfully",
    data: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  })
);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, "All fields are required"));
    }

  const user = await User.findOne({email}).select("+password");

  if (!user || !user.password) {
  return next(new ApiError(404, "User not found"));
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

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });


    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 min
      });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

    return res.status(200).json(
  new ApiResponse({
    statusCode: 200,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    }
  })
);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
) => {
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

  return res.status(200).json(
  new ApiResponse({
    statusCode: 200,
    message: "Logged out successfully"
  })
);
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
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

    return res.status(200).json(
  new ApiResponse({
    statusCode: 200,
    message: "Session refreshed successfully"
  })
);
  } catch (error) {
    next(new ApiError(401, "Invalid refresh token"));
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).select("+password");

    if (!user || !user.password) {
      return next(new ApiError(404, "User not found"));
    }

    if (user.provider === "google") {
      return next(
        new ApiError(403, "Google accounts cannot change password")
      );
    }

    const { currpassword, newpassword } = req.body;

    // validation
    if (!currpassword || !newpassword) {
      return next(
        new ApiError(400, "Current and new password are required")
      );
    }

    // check current password
    const isValid = await bcrypt.compare(currpassword, user.password);

    if (!isValid) {
      return next(
        new ApiError(400, "Current password is incorrect")
      );
    }

    // hash new password
    const newpass = await bcrypt.hash(newpassword, 10);

    user.password = newpass;
    user.refreshToken = null;
    await user.save();

    // clear cookies
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

    // success response
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Password updated successfully. Please login again",
      })
    );

  } catch (error) {
    return next(new ApiError(500, "Failed to update password"));
  }
};

export const generateOtp = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ApiError(400, "Email is required"));
    }

    if (!validator.isEmail(email)) {
      return next(new ApiError(400, "Invalid email address"));
    }

    const user = await User.findOne({ email });

    if (user?.provider === "google") {
      return next(new ApiError(403, "Password reset not allowed for Google accounts"));
    }

    if (!user) {
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "If the email exists, an OTP has been sent",
        })
      );
    }

    const existingOtp = await ResetPass.findOne({ userId: user._id });

    if (existingOtp && existingOtp.expiresAt > new Date()) {
      return next(new ApiError(429, "OTP already sent. Please wait"));
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedotp = await bcrypt.hash(otp, 10);

    await ResetPass.deleteOne({ userId: user._id });

    await ResetPass.create({
      userId: user._id,
      otp: hashedotp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "OTP sent successfully",
      })
    );
  } catch (error) {
    return next(new ApiError(500, "Failed to generate OTP"));
  }
};

export const verifyUserForgotPasswordandReset = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { otp, email, newpassword } = req.body;

    if (!otp || !email) {
      return next(new ApiError(400, "Missing required fields"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ApiError(404, "Invalid request"));
    }

    const reset = await ResetPass.findOne({ userId: user._id });

    if (!reset) {
      return next(new ApiError(400, "Invalid or expired OTP"));
    }

    if (reset.expiresAt < new Date()) {
      return next(new ApiError(400, "OTP expired"));
    }

    const isValidOtp = await bcrypt.compare(otp, reset.otp);

    if (!isValidOtp) {
      return next(new ApiError(400, "Invalid OTP"));
    }

    if (!newpassword) {
      return next(new ApiError(400, "New password is required"));
    }

    const hashed = await bcrypt.hash(newpassword, 10);

    user.password = hashed;
    user.refreshToken = null;
    await user.save();

    await ResetPass.deleteOne({ userId: user._id });

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Password reset successful",
      })
    );
  } catch (error) {
    return next(new ApiError(500, "Password reset failed"));
  }
};


export const googleCallbackController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new ApiError(401, "Google authentication failed"));
    }

    const user = req.user as any;

    const dbUser = await User.findById(user._id);

    if (!dbUser) {
      return next(new ApiError(404, "User not found"));
    }

    const accessToken = jwt.sign(
      { id: dbUser._id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: dbUser._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    dbUser.refreshToken = refreshToken;
    dbUser.provider = "google";
    await dbUser.save({ validateBeforeSave: false });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.redirect(process.env.FRONTEND_DASHBOARD_URL!);
  } catch (error) {
    next(new ApiError(500, "Google login failed"));
  }
};

export const verifyOtpOnly = async (req:AuthRequest, res:Response, next:NextFunction) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(404, "User not found"));

  const reset = await ResetPass.findOne({ userId: user._id });

  if (!reset) return next(new ApiError(400, "Invalid OTP"));

  if (reset.expiresAt < new Date())
    return next(new ApiError(400, "OTP expired"));

  const valid = await bcrypt.compare(otp, reset.otp);

  if (!valid) return next(new ApiError(400, "Invalid OTP"));

   return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Password reset successful",
      })
    );
};