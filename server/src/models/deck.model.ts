import mongoose from "mongoose";

const {Schema} = mongoose;

const deckSchema = new Schema({
    userId: {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true,
  index: true,
},
    creator:{
        type:String,
        required:true,
        index: true,
    },
    path:{
        type:String,
        required:true,
        trim:true,

    },
    method:{
        type:String,
        enum: ["GET","POST","DELETE","PUT","PATCH"],
        default:"GET"
    },
    responseBody:{
        type:String,
        required:true
    },
    responseStatus:{
        type:Number,
        default:200,
    },
    description: {
        type: String,
        default: "",
    }
},
{
    timestamps:true,
});

deckSchema.index({ creator: 1, path: 1, method: 1 }, { unique: true });


export const Deck = mongoose.model('Deck',deckSchema);