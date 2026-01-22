import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendurl, token } = useContext(AppContext);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const { data } = await axios.get(`${backendurl}/api/customer/${id}`, {
          headers: { token },
        });
        if (data.success) {
          setForm({
            name: data.customer.name,
            phone: data.customer.phone,
            email: data.customer.email || "",
            address: data.customer.address || "",
          });
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (id) {
      getCustomer();
    }
  }, [id, backendurl, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`${backendurl}/api/customer/${id}`, form, {
        headers: { token },
      });
      if (data.success) {
        toast.success("Customer updated successfully!");
        navigate("/beneficiary-customer");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error updating customer");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-16">
      <div className="max-w-md mx-auto p-8 bg-[#0f1424] rounded-xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Update Customer</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-cyan-500 text-black font-semibold px-4 py-3 rounded-lg hover:bg-cyan-400 transition"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Customer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCustomer;
