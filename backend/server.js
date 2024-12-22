import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "https://billing-4va367tkw-rudra-das-projects-91aaaad8.vercel.app"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
connectDB();

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Api working!");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
