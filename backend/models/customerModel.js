import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // owner of customer
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  address: { type: String, trim: true },
});

const customerModel =
  mongoose.models.customers ||
  mongoose.model("customers", customerSchema);

export default customerModel;
