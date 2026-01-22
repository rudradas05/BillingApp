import express from "express";
import { addCustomer, searchCustomers, getCustomer, updateCustomer, getAllCustomers, deleteCustomer } from "../controllers/customerController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();
router.use(authUser);

// Get all customers
router.get("/all", getAllCustomers);

// Add a new customer
router.post("/add", addCustomer);

// Search customers
router.get("/search", searchCustomers);

// Get customer by ID
router.get("/:id", getCustomer);

// Update customer by ID
router.put("/:id", updateCustomer);

// Delete customer by ID
router.delete("/:id", deleteCustomer);

export default router;
