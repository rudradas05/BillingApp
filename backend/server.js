import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";

import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:5174"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS_NOT_ALLOWED"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1);
  });


app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);

app.get("/", (req, res) => {
  res.send("API is working!");
});

app.use((err, req, res, next) => {
  if (err.message === "CORS_NOT_ALLOWED") {
    return res.status(403).json({ error: "CORS policy violation" });
  }

  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
