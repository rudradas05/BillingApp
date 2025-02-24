import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  " https://medico-rouge.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS_NOT_ALLOWED"), false);
  },
  credentials: true, // Allow cookies & auth headers
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

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

// 404 Handler Middleware for Vercel
app.use((req, res, next) => {
  // Check if this is an API route
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      404: "NOT_FOUND",
      Code: "NOT_FOUND",
      ID: "bom1:bom1::n4sjw-1739695130886-7a1f38d4db21",
      message: "The requested API endpoint does not exist",
      path: req.path,
    });
  }
  next();
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

app.use((err, req, res, next) => {
  if (err.message === "CORS_NOT_ALLOWED") {
    return res.status(403).json({ error: "CORS policy violation" });
  }

  console.error(err.stack);
  res.status(500);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
