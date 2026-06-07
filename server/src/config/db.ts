import mongoose from "mongoose";

export const connectDb = async() : Promise<void> =>{
    try{
        const conn = await mongoose.connect(process.env.URI || '');
        console.log('databse connected');
    }
    catch(error){
        console.error(`❌ Database connection error: ${error}`);
        process.exit(1);

    }
}