import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { connectDb } from './config/db';
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

connectDb();

app.get('/', (req,res)=>{
    res.send("hello world");
})

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})