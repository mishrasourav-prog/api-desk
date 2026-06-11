import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from './config/db';

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import deckRoutes from "./routes/deck.routes";
import mockRoutes from './routes/mock.routes';

// Middlewares
import { errorHandler } from './middlewares/errorHandler.middleware';
import { ApiError } from './utils/apiError';

dotenv.config();

const app = express();

// 1. Global Pre-Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

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
app.use('/mock', mockRoutes);

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