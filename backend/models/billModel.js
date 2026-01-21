import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, default: "" },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      rate: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  invoiceNo: { type: String, required: true }

});

const billModel = mongoose.models.bill || mongoose.model("bill", billSchema);
export default billModel;
