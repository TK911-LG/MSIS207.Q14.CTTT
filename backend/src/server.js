import express from 'express';
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute.js';
import { protectedRoute } from './middlewares/authMiddleware.js';
import moodRoute from './routes/moodRoute.js';
import journalRoute from './routes/journalRoute.js';
import habitRoute from './routes/habitRoute.js';
import exerciseRoute from './routes/exerciseRoute.js';
import cors from 'cors';
dotenv.config({ path: './src/.env' });

const app = express();
const PORT = process.env.PORT || 5001;

//middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

//public routes
app.use('/api/auth', authRoute);

//private routes
app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/moods', moodRoute);
app.use('/api/journals', journalRoute);
app.use('/api/habits', habitRoute);
app.use('/api/exercises', exerciseRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});