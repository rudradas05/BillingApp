import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, default: "" },
  address: { type: String, default: "" },
  companyName: { type: String, default: "" },
  verifyotp: { type: String, default: "" },
  verifyotpExpireAt: { type: Number, default: 0 },
  isAccoutverified: { type: Boolean, default: false },
  resetotp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
