import { Deck } from "../models/deck.model";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authRequest";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

export const createDeck = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized access"));
    }

    const { id } = req.user;
    const userData = await User.findById(id);

    if (!userData) {
      return next(new ApiError(404, "User not found"));
    }

    const creator = userData.username;
    const { path, method, responseBody, responseStatus, description: incomingDescription } = req.body;

    let dbPath = path.trim().replace(/\/+/g, '/');
    if (!dbPath.startsWith('/')) {
      dbPath = '/' + dbPath;
    }

    if (!path || !method || !responseBody || !responseStatus) {
      return next(new ApiError(400, "All required fields must be provided"));
    }

    const deck = await Deck.create({
      userId: req.user.id,
      creator,
      path: dbPath,
      method,
      responseBody,
      responseStatus,
      description: incomingDescription ? String(incomingDescription).trim() : ""
    });

    return res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message: "Mock endpoint created successfully",
        data: { deck_id: deck._id }
      })
    );

  } catch (error: any) {
    if (error.code === 11000) {
      return next(new ApiError(
        409,
        "A mock endpoint already exists for this path and method"
      ));
    }

    next(error);
  }
};

export const getUserDecks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized access"));
    }

    const userData = await User.findById(req.user.id);

    if (!userData) {
      return next(new ApiError(404, "User not found"));
    }

    const decks = await Deck.find({ creator: userData.username });

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Decks fetched successfully",
        data: { decks }
      })
    );

  } catch (error) {
    next(error);
  }
};


export const deleteDeck = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return next(new ApiError(401, "Unauthorized access"));
    }

    const userData = await User.findById(req.user.id);

    if (!userData) {
      return next(new ApiError(404, "User not found"));
    }

    const deletedDeck = await Deck.findOneAndDelete({
      _id: id,
      creator: userData.username,
    });

    if (!deletedDeck) {
      return next(new ApiError(
        404,
        "Deck not found or you do not have permission to delete it"
      ));
    }

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Mock endpoint deleted successfully"
      })
    );

  } catch (error) {
    next(error);
  }
};



export const getDeckById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return next(new ApiError(404, "Deck not found"));
    }

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Deck fetched successfully",
        data: { deck }
      })
    );

  } catch (error) {
    next(error);
  }
};



export const updateDeck = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized access"));
    }

    const userData = await User.findById(req.user.id);

    if (!userData) {
      return next(new ApiError(404, "User not found"));
    }

    const creator_name = userData.username;
    const { path, method, responseBody, responseStatus, description: incomingDescription } = req.body;

    const updatedFields: any = {};

    if (path !== undefined) updatedFields.path = path.trim();
    if (method !== undefined) updatedFields.method = method;
    if (responseBody !== undefined) updatedFields.responseBody = responseBody;
    if (responseStatus !== undefined) updatedFields.responseStatus = Number(responseStatus);
    if (incomingDescription !== undefined) {
      updatedFields.description = incomingDescription ? String(incomingDescription).trim() : "";
    }

    const updatedDeck = await Deck.findOneAndUpdate(
      { _id: req.params.id, creator: creator_name },
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!updatedDeck) {
      return next(new ApiError(
        404,
        "Deck not found or you do not have permission to update it"
      ));
    }

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Mock endpoint updated successfully",
        data: { deck: updatedDeck }
      })
    );

  } catch (error: any) {
    if (error.code === 11000) {
      return next(new ApiError(
        409,
        "A conflicting mock endpoint already exists for this path and method"
      ));
    }

    next(error);
  }
};