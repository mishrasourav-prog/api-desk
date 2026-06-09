import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  otpHash: {
    type: String,
    required: true,
  },

  otpExpiry: {
    type: Date,
    required: true,
  },
});

export const PendingUser = mongoose.model(
  "PendingUser",
  pendingUserSchema
);