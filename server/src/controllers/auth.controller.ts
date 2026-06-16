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


export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, password, email, name } = req.body;
  console.log("REGISTER BODY:", req.body);

  if (!name?.trim()) {
  return next(new ApiError(400, "Name is required"));
}

  // validation
  if (!username || !email || !password || !name) {
    return next(new ApiError(400, "All fields are required"));
  }

  if(!validator.isEmail(email)){
     return next(new ApiError(400, "Provide valid email"));

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
      name,
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

export const changePassword = async(req:AuthRequest , res:Response , next:NextFunction):Promise<void> =>{
  try {
    const userId = req.user?.id;

   const user = await User.findById(userId).select("+password");

if (!user || !user.password) {
  return next(new ApiError(404, "User not found"));
}

    const {currpassword , newpassword} = req.body;

    const isvalid = await bcrypt.compare(
          currpassword,
          user.password
    );

    if (!isvalid) {
   res.status(400).json(
    new ApiResponse(400, null, "Current password did not match")
  );
  return;
}

    const newpass = await bcrypt.hash(newpassword , 10);

    user.password = newpass;
    user.refreshToken = null;
    await user.save();

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

     res.status(200).json(new ApiResponse(200, null, "Password updated succesfully..Please login again"));

} catch (error) {
  return next(new ApiError(400, "Unable to update newpassword"));
    
  }
};

export const generateOtp = async(req:AuthRequest , res:Response , next:NextFunction):Promise<void>=>{
  try {
    console.log("step 1");

    
  
    const {email} = req.body;
    console.log("step 2");
    if (!email) {
  return next(new ApiError(400, "Email is required"));
}

if (!validator.isEmail(email)) {
  return next(new ApiError(400, "Invalid email"));
}
    const user = await User.findOne({email});
    console.log("step 3");

    if (!user) {
    res.status(200).json(
  new ApiResponse(
    200,
    null,
    "If the email exists, an OTP has been sent."
  )
);
return;
  }

  const existingOtp = await ResetPass.findOne({
  userId: user._id
});

if (
  existingOtp &&
  existingOtp.expiresAt > new Date()
) {
   res.status(400).json(
    new ApiResponse(
      400,
      null,
      "OTP already sent. Please wait."
    )
    
  );
  return;
}
    const otp = Math.floor(
          100000 + Math.random() * 900000
    ).toString();
    console.log("step 4");

    const hashedotp = await bcrypt.hash(otp,10);

    await ResetPass.deleteOne({ userId: user._id});
    console.log("step 5");

    
    await ResetPass.create({
        userId: user._id,
        otp: hashedotp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });
    console.log("step 6");

    try {
      console.log("step 7");
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset OTP",
    html: `
<h2>Password Reset OTP</h2>
<p>Your OTP is:</p>
<h1>${otp}</h1>
<p>This OTP expires in 10 minutes.</p>
`
  });

  console.log("Mail sent:", info.response);

} catch (err) {
  console.log("SEND MAIL ERROR:", err);
}
    res.status(200).json(new ApiResponse(200, null, "If the email exists, an OTP has been sent."));
  
  } catch (error) {
    return next(new ApiError(400, "Unable to generate an otp"));
  }
};

export const verifyUserForgotPasswordandReset = async(req:AuthRequest , res:Response , next:NextFunction):Promise<void>=>{
  try {
    const {otp , email, newpassword } = req.body;
   const user = await User.findOne({ email }).select("+password");

if (!user || !user.password) {
  return next(new ApiError(404, "Invalid email"));
}
  if (!otp || !email) {
  return next(new ApiError(400, "Missing fields"));
}

  const isvalidreset = await ResetPass.findOne({userId:user._id});

   if (!isvalidreset) {
    return next(new ApiError(404, "Invalid email or OTP"));
  }

  if(isvalidreset.expiresAt<new Date()){
    await ResetPass.deleteOne({ userId: user._id });
    res.status(400).json(new ApiResponse(400, null, "Otp expired please generate new one"));
    return;
  }

  const isvalid = await bcrypt.compare(otp , isvalidreset.otp);

  if(!isvalid){
    res.status(400).json(new ApiResponse(400, null, "Otp Invalid"));
    return;
  }

  if (!newpassword) {
  return next(new ApiError(400, "New password required"));
}

const samePassword = await bcrypt.compare(
  newpassword,
  user.password
);

if (samePassword) {
  return next(
    new ApiError(400, "New password must be different")
  );
}

  

  const newpass = await bcrypt.hash(newpassword , 10);

    user.password = newpass;
    user.refreshToken = null;
    await user.save();
    await ResetPass.deleteOne({ userId:user._id });

    res.status(200).json(new ApiResponse(200, null, "Password updated"))

} catch (error) {
   return next(new ApiError(400, "Some error occured"));
    
  }
}



export const googleCallbackController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    if (!req.user) {
      return next(new ApiError(401, "Google authentication failed"));
    }

    const googleUser = req.user as any;

    if (!googleUser) {
  return next(new ApiError(401, "Google authentication failed"));
}

    const user = await User.findById(googleUser._id);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    // Generate tokens
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
    // Save refresh token if you already do this
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax"
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    // HARDCODED URL: Frontend dashboard redirect - moved to environment variable
    const frontendRedirectUrl = process.env.FRONTEND_DASHBOARD_URL || "http://localhost:5173/app/dashboard";
    res.redirect(frontendRedirectUrl);

  } catch (error) {
    next(error);
  }
};