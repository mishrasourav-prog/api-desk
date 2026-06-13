import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  otp: {
    type: String,
    required: true
  },

  expiresAt: {
    type: Date,
    required: true
  }
});

export const ResetPass = mongoose.model('ResetPass' , passwordResetSchema);