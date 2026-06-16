import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import passport from "passport";
import './types/config/googleOAuth';



import cookieParser from "cookie-parser";
import { connectDb } from './config/db';


// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import deckRoutes from "./routes/deck.routes";
import mockRoutes from './routes/mock.routes';
import logRoutes from './routes/log.routes';


// Middlewares
import { errorHandler } from './middlewares/errorHandler.middleware';
import { ApiError } from './utils/apiError';



const app = express();

// 1. Global Pre-Middlewares
// HARDCODED URL: Frontend origin for CORS - moved to environment variable
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(cors({
  origin: frontendOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Database Connection
connectDb();

// 2. Base & Health Check Routes
app.get('/', (req, res) => {
    res.send("hello world from API-Deck backend!");
});

// 3. Operational API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/deck", deckRoutes);
app.use('/api/mock', mockRoutes);
app.use('/api/logs',logRoutes);

// 4. Global 404 Catch-All (MUST sit below ALL valid routes!)
app.use((req, res, next) => {
    next(new ApiError(404, `The requested route '${req.originalUrl}' does not exist on this server.`));
});

// 5. Global Centralized Error Interceptor (MUST be the absolute bottom)
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 API-Deck Server running smoothly on port ${port}`);
});