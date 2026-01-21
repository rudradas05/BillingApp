import express from "express";
import {
  addItems,
  generateBillPDF,
  getAllBill,
  getAllItems,
  getUserData,
  isAuthenticated,
  loginUser,
  newBill,
  registerUser,
  removeItems,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  updateUserData,
  verifyEmail,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/send-verify-otp", authUser, sendVerifyOtp);
userRouter.post("/verify-account", authUser, verifyEmail);
userRouter.get("/is-auth", authUser, isAuthenticated);
userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/get-user-data", authUser, getUserData);
userRouter.put("/update-user-data", authUser, updateUserData);
userRouter.post("/add-items", authUser, addItems);
userRouter.get("/all-items", authUser, getAllItems);
userRouter.post("/remove-item", authUser, removeItems);
userRouter.post("/new-bill", authUser, newBill);
userRouter.get("/all-bill", authUser, getAllBill);
userRouter.get("/bills/:billId/pdf", generateBillPDF);
export default userRouter;
