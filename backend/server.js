import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1); // Stop the server if DB connection fails
  });

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API is working!");
});

// Vercel-specific 404 handler
app.use((req, res) => {
  res.status(404).json({
    404: "NOT_FOUND",
    Code: "NOT_FOUND",
    ID: "bom1:bom1::n4sjw-1739695130886-7a1f38d4db21",
    message: "Resource not found",
    path: req.path,
  });
});

// Error Handling Middleware

// Start the server
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
