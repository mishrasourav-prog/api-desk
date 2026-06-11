import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { connectDb } from './config/db';
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";
import deckRoutes from "./routes/deck.routes"
import mockRoutes from './routes/mock.routes';
import { sendOTPEmail } from './utils/sendEmail';
import { Resend } from 'resend';
dotenv.config();



const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());



connectDb();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/deck",deckRoutes)
app.use('/mock', mockRoutes);

app.get('/', (req,res)=>{
    res.send("hello world");
})
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})



