import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  password?: string;
  email: string;
  googleId?: string;
  avatar?: string;
  refreshToken?: string | null;
  provider: "local" | "google";
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },

  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 40,
    trim: true,
  },

  password: {
    type: String,
    required: false,
    select: false,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  googleId: { type: String },
  avatar: { type: String },

  refreshToken: {
    type: String,
    default: null,
  },

  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
},
{
  timestamps: true
});

export const User = mongoose.model<IUser>("User", UserSchema);


// const {Schema} = mongoose;

// const UserSchema = new Schema({
//     name: {
//   type: String,
//   required: true,
// },
//     username : {
//         type:String,
//         required:true,
//         unique:true,
//         minlength: 5,
//         maxlength: 40,
//         trim:true,
//         },
//     password:{
//         type:String,
//         required:false,
//         select: false,

//         },
//     email:{
//         type:String,
//         required:true,
//         unique:true,
//         lowercase: true,
//         trim: true,
//         },
//     googleId: {
//     type: String
//   },

//   avatar: {
//     type: String
//   },
//   refreshToken: {
//     type: String,
//     default: null
// },
// provider: {
//   type: String,
//   enum: ["local", "google"],
//   default: "local"
// }
//     },
//     {
//         timestamps:true 
//     }
// );


// export const User = mongoose.model('User' , UserSchema);