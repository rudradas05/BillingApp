import express from "express";
import { addCustomer, searchCustomers, getCustomer, updateCustomer, getAllCustomers, deleteCustomer } from "../controllers/customerController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();
router.use(authUser);


router.get("/all", getAllCustomers);

router.post("/add", addCustomer);


router.get("/search", searchCustomers);


router.get("/:id", getCustomer);


router.put("/:id", updateCustomer);


router.delete("/:id", deleteCustomer);

export default router;
