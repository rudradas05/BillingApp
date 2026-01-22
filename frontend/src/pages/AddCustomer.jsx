import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCustomer = () => {
  const { backendurl, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendurl}/api/customer/add`, form, {
        headers: { token },
      });
      if (data.success) {
        toast.success("Customer added successfully!");
        navigate("/beneficiary-customer");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error adding customer");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-16">
      <div className="max-w-xl mx-auto px-6">
        <h1 className="text-2xl font-semibold text-white mb-8">Add Customer</h1>
        <div className="p-8 bg-[#0f1424] rounded-xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full bg-[#0b0f1a] border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="w-full bg-[#0b0f1a] border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-[#0b0f1a] border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full bg-[#0b0f1a] border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="w-full bg-cyan-500 text-black font-semibold px-4 py-3 rounded-lg hover:bg-cyan-400 transition"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Customer"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/beneficiary-customer")}
                className="w-full bg-red-500 text-white font-semibold px-4 py-3 rounded-lg hover:bg-red-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
