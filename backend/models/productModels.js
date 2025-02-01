import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: false, min: 0 },
  category: { type: String, required: true },
  subCategory: { type: String, required: false },
});

const productModel =
  mongoose.models.items || mongoose.model("items", productSchema);

export default productModel;
