import express from "express";
import { addCategory, getCategories, deleteCategory } from "../controllers/categoryController.js";
import authUser from "../middlewares/authUser.js";

const categoryRouter = express.Router();

categoryRouter.post("/add", authUser, addCategory);
categoryRouter.get("/all", authUser, getCategories);
categoryRouter.post("/delete", authUser, deleteCategory);

export default categoryRouter;
