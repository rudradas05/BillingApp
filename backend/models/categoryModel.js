import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
});

const categoryModel = mongoose.models.category || mongoose.model("category", categorySchema);
export default categoryModel;
