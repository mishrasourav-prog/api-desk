import { Response, NextFunction } from "express";
import {User} from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import { AuthRequest } from "../types/authRequest";
import { Deck } from "../models/deck.model";
import {RequestLog} from "../models/requestLog.model";

// export const getCurrentUser = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const userId = req.user?.id;

//     const user = await User.findById(userId).select("-password");

//     if (!user) {
//       return next(new ApiError(404, "User not found"));
//     }

//     res.status(200).json(
//       new ApiResponse(
//         200,
//         user,
//         "User fetched successfully"
//       )
//     );
//   } catch (error) {
//     next(new ApiError(500, "Unable to fetch user"));
//   }
// };

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "User fetched successfully",
        data: user
      })
    );

  } catch (error) {
    return next(new ApiError(500, "Failed to fetch user"));
  }
};


// export const editUser = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const userId = req.user?.id;
//     const { name, username, email } = req.body;

//     const user = await User.findById(userId);

//     if (!user) {
//       return next(new ApiError(404, "User not found"));
//     }

//     const noChanges =
//       (name === undefined || name === user.name) &&
//       (username === undefined || username === user.username) &&
//       (email === undefined || email === user.email);

//     if (noChanges) {
//       res
//         .status(200)
//         .json(new ApiResponse(200, null, "No changes made"));
//       return;
//     }

//     // Save old username before changing
//     const oldUsername = user.username;

  
//         if (username && username.length > 20) {
//   return next(
//     new ApiError(400, "Username must be less than 20 characters")
//   );
// }

//     if (
//   user.provider === "google" &&
//   email !== undefined &&
//   email !== user.email
// ) {
//   return next(
//     new ApiError(
//       403,
//       "Google accounts cannot change email"
//     )
//   );
// }
//     if (username && username !== user.username) {
//   const existingUsername = await User.findOne({ username });

//   if (existingUsername) {
//     return next(
//       new ApiError(400, "Username already taken")
//     );
//   }
// }
// if (email && email !== user.email) {
//   const existingEmail = await User.findOne({ email });

//   if (existingEmail) {
//     return next(
//       new ApiError(400, "Email already in use")
//     );
//   }
// }
//       if (name !== undefined) user.name = name;

//     if (username !== undefined) user.username = username;

//     if (email !== undefined) user.email = email;







//     await user.save();

//     // If username changed, migrate all decks
//     if (username !== undefined && username !== oldUsername) {
//       await Deck.updateMany(
//         { creator: oldUsername },
//         { $set: { creator: username } }
//       );
//     }

//     res.status(200).json(
//       new ApiResponse(200, null, "User details updated successfully")
//     );

//   } catch (error) {
//     console.log(error);
//     return next(new ApiError(400, "Unable to update the user details"));
//   }
// };


export const editUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { name, username, email } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const noChanges =
      (name === undefined || name === user.name) &&
      (username === undefined || username === user.username) &&
      (email === undefined || email === user.email);

    if (noChanges) {
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "No changes detected",
        })
      );
    }

    const oldUsername = user.username;

    if (username && username.length > 20) {
      return next(new ApiError(400, "Username must be 20 characters or less"));
    }

    if (
      user.provider === "google" &&
      email !== undefined &&
      email !== user.email
    ) {
      return next(new ApiError(403, "Google accounts cannot change email"));
    }

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });

      if (existingUsername) {
        return next(new ApiError(400, "Username already taken"));
      }
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        return next(new ApiError(400, "Email already in use"));
      }
    }

    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;

    await user.save();

    if (username !== undefined && username !== oldUsername) {
      await Deck.updateMany(
        { creator: oldUsername },
        { $set: { creator: username } }
      );
    }

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "User updated successfully",
      })
    );

  } catch (error) {
    return next(new ApiError(500, "Failed to update user"));
  }
};

// export const deleteUser = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const userId = req.user?.id;
//     const { DELETE } = req.body;

//     if (!userId) {
//       return next(new ApiError(401, "Unauthorized"));
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return next(new ApiError(404, "User not found"));
//     }
//     const username = user.username;

//     if (DELETE !== "DELETE") {
//        res.status(400).json(
//         new ApiResponse(
//           400,
//           null,
//           "Please type DELETE correctly to confirm account deletion"
//         )
//       );
//       return;
//     }

  
//     const decks = await Deck.find({
//       creator: username,
//     }).select("_id");

//     const deckIds = decks.map(deck => deck._id);

//     await RequestLog.deleteMany({
//       deckId: { $in: deckIds },
//     });

//     // Delete decks
//     await Deck.deleteMany({
//       creator: username,
//     });

//     // Delete user
//     await User.deleteOne({
//       _id: userId,
//     });

//     res.status(200).json(
//       new ApiResponse(
//         200,
//         null,
//         "User and all associated data deleted successfully"
//       )
//     );

//   } catch (error) {
//     next(error);
//   }
// };

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { DELETE } = req.body;

    if (!userId) {
      return next(new ApiError(401, "Unauthorized access"));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const username = user.username;

    if (DELETE !== "DELETE") {
      return res.status(400).json(
        new ApiResponse({
          statusCode: 400,
          message: "Please type DELETE to confirm account deletion",
        })
      );
    }

    const decks = await Deck.find({ creator: username }).select("_id");

    const deckIds = decks.map(deck => deck._id);

    await RequestLog.deleteMany({
      deckId: { $in: deckIds },
    });

    await Deck.deleteMany({
      creator: username,
    });

    await User.deleteOne({
      _id: userId,
    });

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Account and all associated data deleted successfully",
      })
    );

  } catch (error) {
    return next(new ApiError(500, "Failed to delete account"));
  }
};