import mongoose from "mongoose";

export const connectDb = async() : Promise<void> =>{
    try{
        const conn = await mongoose.connect(process.env.URI || '');
    }
    catch(error){
        process.exit(1);

    }
}