import express from "express";
import {
  addItems,
  generateBillPDF,
  getAllBill,
  getAllItems,
  getUserData,
  isAuthenticated,
  loginUser,
  logout,
  newBill,
  registerUser,
  removeItems,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logout);
userRouter.post("/send-verify-otp", authUser, sendVerifyOtp);
userRouter.post("/verify-account", authUser, verifyEmail);
userRouter.get("/is-auth", authUser, isAuthenticated);
userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/get-user-data", authUser, getUserData);
userRouter.post("/add-items", authUser, addItems);
userRouter.post("/all-items", authUser, getAllItems);
userRouter.post("/remove-item", authUser, removeItems);
userRouter.post("/new-bill", authUser, newBill);
userRouter.get("/all-bill", authUser, getAllBill);
userRouter.get("/bills/:billId/pdf", generateBillPDF);

// Catch-all route for undefined endpoints
userRouter.use((req, res) => {
  res.status(404).json({
    404: "NOT_FOUND",
    Code: "NOT_FOUND",
    ID: "bom1:bom1::n4sjw-1739695130886-7a1f38d4db21",
  });
});

export default userRouter;
