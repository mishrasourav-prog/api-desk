import mongoose from "mongoose";

const {Schema} = mongoose;

const UserSchema = new Schema({
    name: {
  type: String,
  required: true,
},
    username : {
        type:String,
        required:true,
        unique:true,
        minlength: 5,
        maxlength: 20,
        trim:true,
        },
    password:{
        type:String,
        required:true,
        select: false,

        },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        trim: true,
        }
    },
    {
        timestamps:true 
    }
);


export const User = mongoose.model('User' , UserSchema);