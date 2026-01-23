import Customer from "../models/customerModel.js";


export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ userId: req.userId });
        res.json({ success: true, customers });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const addCustomer = async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ success: false, message: "Name and phone are required" });
        }
        const existing = await Customer.findOne({ phone, userId: req.userId });
        if (existing) {
            return res.status(400).json({ success: false, message: "Customer with this phone already exists" });
        }
        const customer = new Customer({ name, phone, email, address, userId: req.userId });
        await customer.save();
        res.status(201).json({ success: true, customer });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Search customers by name, phone, or email
export const searchCustomers = async (req, res) => {
    try {
        const { q } = req.query;
        const customers = await Customer.find({
            userId: req.userId,
            $or: [
                { name: { $regex: q, $options: "i" } },
                { phone: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } }
            ]
        }).limit(10);
        res.json({ success: true, customers });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get customer by ID
export const getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, userId: req.userId });
        if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });
        res.json({ success: true, customer });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update customer by ID
export const updateCustomer = async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;
        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { name, phone, email, address },
            { new: true }
        );
        if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });
        res.json({ success: true, customer });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete customer by ID
export const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });
        res.json({ success: true, message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
