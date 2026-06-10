import { Deck } from "../models/deck.model";
import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import { User } from "../models/user.model";


export const createDeck = async(req:AuthRequest , res:Response) : Promise<void> =>{
    try{

        if (!req.user) {
  res.status(401).json({ message: "Unauthorized" });
  return;
}

const {id} = req.user;
        const userData = await User.findById(id);

        if (!userData) {
  res.status(404).json({ message: "User not found" });
  return;
}
        const creator = userData.username; 

        const { path , method , responseBody , responseStatus} = req.body;

        if(!path || !method || !responseBody || !responseStatus){
            res.status(400).json({
                message:"Provide everything"
                
            })
            return;
        }

        const deck = await Deck.create({
            creator:creator,
            path,
            method,
            responseBody,
            responseStatus
        });

        res.status(201).json({
            message:"Deck created succesfully",
            deck_id: deck._id
        });



    }catch (error: any) {
        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                message: "Routing collision! You already have an active mock endpoint registered with this exact path and method combination."
            });
            return;
        }

       
        res.status(500).json({
            success: false,
            message: "Internal server error occurred while configuring the mock endpoint.",
            error: error.message
        });

}}


export const getUserDecks = async(req:AuthRequest , res:Response) : Promise<void>=>{
    try{

        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized access" });
            return;
        }

        const userData = await User.findById(req.user.id);

        if (!userData) {
  res.status(404).json({ success: false, message: "User not found" });
  return;
}
        const creator_name = userData.username;

        const decks = await Deck.find({creator:creator_name});
        console.log(decks); //check

        res.status(200).json({
            success: true,
            decks: decks 
        });

        

    }catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


export const deleteDeck = async(req:AuthRequest , res:Response) : Promise<void> =>{
    try{
        const { id } = req.params;

        if (!req.user) {
  res.status(401).json({ success: false, message: "Unauthorized" });
  return;
}

const userData = await User.findById(req.user.id);

if (!userData) {
  res.status(404).json({ success: false, message: "User not found" });
  return;
}

const creator_name = userData.username;
     

        const deletedDeck = await Deck.findOneAndDelete({
                  _id: id,
                   creator: creator_name
        });

        if (!deletedDeck) {
    res.status(404).json({
        success: false,
        message: "Deck not found, or you do not have permission to delete this endpoint."
    });
    return;
}

res.status(200).json({
    success: true,
    message: "Mock endpoint configuration successfully deleted."
});

    }catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error occurred while deleting the mock endpoint.",
            error: error.message
        });
}}


export const getDeckById = async (req:AuthRequest, res:Response) => {
  try {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: "Deck not found",
      });
    }

    res.status(200).json({
      success: true,
      deck,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateDeck = async (req:AuthRequest, res:Response) => {
  try {
    const updatedDeck = await Deck.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedDeck) {
      return res.status(404).json({
        success: false,
        message: "Deck not found",
      });
    }

    res.status(200).json({
      success: true,
      deck: updatedDeck,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};