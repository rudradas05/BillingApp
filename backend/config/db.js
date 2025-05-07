import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/billing`);
    console.log("DB Connected");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};
