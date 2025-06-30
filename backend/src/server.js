import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "..", "frontend", "dist");


  console.log(distPath)
  const indexPath = path.join(distPath, "index.html");
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.url.startsWith("/api/")) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
}

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || 'Something went wrong',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  connectDB();
});
