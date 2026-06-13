import { Response, NextFunction } from "express";
import {User} from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import { AuthRequest } from "../types/authRequest";

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    res.status(200).json(
      new ApiResponse(
        200,
        user,
        "User fetched successfully"
      )
    );
  } catch (error) {
    next(new ApiError(500, "Unable to fetch user"));
  }
};


export const editUser = async(req:AuthRequest , res:Response , next: NextFunction):Promise<void> =>{
  try {
    const userId = req.user?.id;
    const {name, username , email} = req.body;
    const user = await User.findById(userId);

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

   const noChanges =
  (name === undefined || name === user.name) &&
  (username === undefined || username === user.username) &&
  (email === undefined || email === user.email);

    if (noChanges) {
   res
    .status(200)
    .json(new ApiResponse(200, null, "No changes made"));
    return;
}

     
       if (name !== undefined) user.name = name;
      
      if(username !== undefined) user.username = username;
      if (email !== undefined) user.email = email;
      

  await user.save();

   res.status(200).json(new ApiResponse(200, null, "User details updated successfully"));



  } catch (error) {
    return next(new ApiError(400, "Unable to update the user details"));
    
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { DELETE } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    if (DELETE !== "DELETE") {
      res.status(400).json(
        new ApiResponse(
          400,
          null,
          "Please type DELETE correctly to confirm account deletion"
        )
      );
      return;
    }

    await User.deleteOne({ _id: userId });

    res.status(200).json(
      new ApiResponse(200, null, "User deleted successfully")
    );
    return;

  } catch (error) {
    return next(new ApiError(400, "Unable to delete user"));
  }
};