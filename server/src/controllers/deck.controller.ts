import { Deck } from "../models/deck.model";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authRequest";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

export const createDeck = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        
        if (!req.user) {
            return next(new ApiError(401, "Unauthorized"));
        }

        const { id } = req.user;
        const userData = await User.findById(id);

        if (!userData) {
            return next(new ApiError(404, "User not found"));
        }

        const creator = userData.username;
        console.log("BODY:", req.body);
        const { path, method, responseBody, responseStatus, description:incomingDescription } = req.body;

        let dbPath = path.trim().replace(/\/+/g, '/');
        if (!dbPath.startsWith('/')) {
            dbPath = '/' + dbPath;
        }


        if (!path || !method || !responseBody || !responseStatus) {
            return next(new ApiError(400, "Provide everything"));
        }
        
        const deck = await Deck.create({
    creator,
    path:dbPath,
    method,
    responseBody,
    responseStatus,
    // 🌟 FORCE it to read the incoming string, falling back to empty only if null/undefined
    description: incomingDescription? String(incomingDescription).trim() : ""
});

      

        res.status(201).json(new ApiResponse(201, { deck_id: deck._id }, "Deck created successfully"));
    } catch (error: any) {
        if (error.code === 11000) {
            return next(new ApiError(409, "Routing collision! You already have an active mock endpoint registered with this exact path and method combination."));
        }

        next(error);
    }
};

export const getUserDecks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            return next(new ApiError(401, "Unauthorized access"));
        }

        const userData = await User.findById(req.user.id);

        if (!userData) {
            return next(new ApiError(404, "User not found"));
        }

        const creator_name = userData.username;
        const decks = await Deck.find({ creator: creator_name });
        console.log(decks);

        res.status(200).json(new ApiResponse(200, { decks }, "Decks retrieved successfully"));
    } catch (error: any) {
        next(error);
    }
};

export const deleteDeck = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return next(new ApiError(401, "Unauthorized"));
        }

        const userData = await User.findById(req.user.id);

        if (!userData) {
            return next(new ApiError(404, "User not found"));
        }

        const creator_name = userData.username;
        const deletedDeck = await Deck.findOneAndDelete({
            _id: id,
            creator: creator_name,
        });

        if (!deletedDeck) {
            return next(new ApiError(404, "Deck not found, or you do not have permission to delete this endpoint."));
        }

        res.status(200).json(new ApiResponse(200, null, "Mock endpoint configuration successfully deleted."));
    } catch (error: any) {
        next(error);
    }
};

export const getDeckById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deck = await Deck.findById(req.params.id);

        if (!deck) {
            return next(new ApiError(404, "Deck not found"));
        }

        res.status(200).json(new ApiResponse(200, { deck }, "Deck retrieved successfully"));
    } catch (error) {
        next(error);
    }
};

export const updateDeck = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            return next(new ApiError(401, "Unauthorized"));
        }

        const userData = await User.findById(req.user.id);
        if (!userData) {
            return next(new ApiError(404, "User not found"));
        }

        const creator_name = userData.username;
        const { path, method, responseBody, responseStatus, description:incomingDescription } = req.body;

        // 1. Build the base fields that should always map if present
        const updatedFields: any = {};
        
        if (path !== undefined) updatedFields.path = path.trim();
        if (method !== undefined) updatedFields.method = method;
        if (responseBody !== undefined) updatedFields.responseBody = responseBody;
        if (responseStatus !== undefined) updatedFields.responseStatus = Number(responseStatus);

        // 2. 🌟 SAFEGUARD: Only update description if it's explicitly passed in req.body
        // This stops Mongoose from silently resetting your field to "" if types mismatch over the network
        if (incomingDescription !== undefined) {
            updatedFields.description = incomingDescription ? String(incomingDescription).trim() : "";
        }

        // 3. Execute the database atomic update
        const updatedDeck = await Deck.findOneAndUpdate(
            { _id: req.params.id, creator: creator_name },
            { $set: updatedFields },
            { 
                new: true, 
                runValidators: true // Enforces enum checks and schema rules on update
            }
        );

        if (!updatedDeck) {
            return next(new ApiError(404, "Deck not found, or you do not have permission to modify this endpoint."));
        }

        res.status(200).json(new ApiResponse(200, { deck: updatedDeck }, "Deck updated successfully"));
    } catch (error: any) {
        // Catch routing collisions on update (e.g., updating path to an existing combination)
        if (error.code === 11000) {
            return next(new ApiError(409, "Routing collision! Another active mock endpoint already uses this path and method combination."));
        }
        next(error);
    }
};