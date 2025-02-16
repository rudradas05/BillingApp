// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import cookieParser from "cookie-parser";
// import { connectDB } from "./config/db.js";
// import userRouter from "./routes/userRoutes.js";

// const app = express();
// const port = process.env.PORT || 4000;

// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
//   "http://localhost:5173",
//   "http://localhost:5174",
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     console.log("Request Origin:", origin);
//     if (!origin || allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     return callback(null, false);
//   },

//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// app.use(express.json());
// app.use(cookieParser());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   next();
// });

// connectDB()
//   .then(() => console.log("Database connected successfully"))
//   .catch((err) => {
//     console.error("Database connection error:", err.message);
//     process.exit(1);
//   });

// app.use("/api/user", userRouter);

// app.get("/", (req, res) => {
//   res.send("API is working!");
// });

// app.use((req, res, next) => {
//   if (req.path.startsWith("/api")) {
//     return res.status(404).json({
//       404: "NOT_FOUND",
//       Code: "NOT_FOUND",
//       ID: "bom1:bom1::n4sjw-1739695130886-7a1f38d4db21",
//       message: "The requested API endpoint does not exist",
//       path: req.path,
//     });
//   }
//   next();
// });

// // Vercel-specific 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     404: "NOT_FOUND",
//     Code: "NOT_FOUND",
//     ID: "bom1:bom1::n4sjw-1739695130886-7a1f38d4db21",
//     message: "Resource not found",
//     path: req.path,
//   });
// });

// // Error Handling Middleware

// app.use((err, req, res, next) => {
//   if (err.message === "CORS_NOT_ALLOWED") {
//     return res.status(403).json({ error: "CORS policy violation" });
//   }

//   console.error(err.stack);
//   res
//     .status(500)
//     .json({ error: "Internal Server Error", message: err.message });
// });

// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });

import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
  "http://localhost:5174",
];

// CORS Options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS Not Allowed"), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware setup
app.use(cors(corsOptions)); // Use cors middleware with options
app.use(express.json());
app.use(cookieParser());

// Database connection
connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1);
  });

// API Routes
app.use("/api/user", userRouter);

// Test route
app.get("/", (req, res) => {
  res.send("API is working!");
});

// 404 handler for API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    404: "NOT_FOUND",
    message: "The requested API endpoint does not exist",
    path: req.path,
  });
});

// General 404 handler (for everything else)
app.use((req, res) => {
  res.status(404).json({
    404: "NOT_FOUND",
    message: "Resource not found",
    path: req.path,
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // CORS Error handling
  if (err.message === "CORS Not Allowed") {
    return res.status(403).json({ error: "CORS policy violation" });
  }

  // General Error
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
