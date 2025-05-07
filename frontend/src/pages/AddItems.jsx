import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiPackage,
  FiDollarSign,
  FiTag,
  FiLayers,
  FiPlus,
  FiChevronDown,
  FiLoader,
} from "react-icons/fi";

const AddItems = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { backendurl, token, currencySymbol } = useContext(AppContext);

  useEffect(() => {
    setSubCategory("");
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !price || !category) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    if (parseFloat(price) <= 0) {
      toast.error("Price must be greater than 0");
      setIsSubmitting(false);
      return;
    }

    if (quantity && parseInt(quantity) < 0) {
      toast.error("Quantity cannot be negative");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = {
        name,
        price: parseFloat(price),
        quantity: quantity ? parseInt(quantity) : undefined,
        category,
        subCategory: subCategory || undefined,
      };

      const { data } = await axios.post(
        `${backendurl}/api/user/add-items`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        setName("");
        setPrice("");
        setQuantity("");
        setSubCategory("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while adding the item."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            <FiPackage className="inline-block mr-2 mb-1" />
            Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Name Field */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Product Name
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiTag className="text-gray-400 text-lg" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Price Field */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Price
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiDollarSign className="text-gray-400 text-lg" />
                    <div className="relative w-full">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {currencySymbol}
                      </span>
                      <input
                        id="price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-gray-800/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Field */}
              <div className="relative group sm:col-span-2">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Stock Quantity (optional)
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiLayers className="text-gray-400 text-lg" />
                    <input
                      id="quantity"
                      type="number"
                      step="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="Enter stock quantity"
                    />
                  </div>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Category
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiTag className="text-gray-400 text-lg" />
                    <div className="relative w-full">
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none pr-10"
                        required
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        <option value="Valvate Box">Valvate Box</option>
                        <option value="Plastic Box">Plastic Box</option>
                        <option value="Bags">Bags</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Category Dropdown */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <label
                    htmlFor="subCategory"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Sub-Category (optional)
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiTag className="text-gray-400 text-lg" />
                    <div className="relative w-full">
                      <select
                        id="subCategory"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none pr-10"
                      >
                        <option value="" disabled>
                          Select Sub-Category
                        </option>
                        <option value="Dozen">Dozen</option>
                        <option value="Pieces">Pieces</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 py-4 px-8 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin inline-block mr-2 mb-1" />
                  Adding...
                </>
              ) : (
                <>
                  <FiPlus className="inline-block mr-2 mb-1" />
                  Add Product to Inventory
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItems;
