import mongoose from "mongoose";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModels.js";


const addCategory = async (req, res) => {
    try {
        const { userId } = req;
        console.log('addCategory: req.userId =', userId);
        const name = req.body.name?.trim();

        if (!name) {
            return res.status(400).json({ success: false, message: "Category name is required" });
        }

        const exists = await categoryModel.findOne({
            userId,
            name: { $regex: `^${name}$`, $options: "i" }
        });

        if (exists) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }

        const newCategory = new categoryModel({ userId, name });
        await newCategory.save();

        res.status(201).json({ success: true, message: "Category added", category: newCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get categories
const getCategories = async (req, res) => {
    try {
        const { userId } = req;
        const categories = await categoryModel.find({ userId }).sort({ name: 1 });
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;
        const { userId } = req;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ success: false, message: "Invalid category ID" });
        }

        const category = await categoryModel.findOne({ _id: categoryId, userId });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const inUse = await productModel.findOne({ userId, category: category.name });
        if (inUse) {
            return res.status(400).json({
                success: false,
                message: "Category is in use by products"
            });
        }

        await category.deleteOne();
        res.json({ success: true, message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addCategory, getCategories, deleteCategory };
