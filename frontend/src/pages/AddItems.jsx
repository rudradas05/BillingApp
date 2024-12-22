import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddItems = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const { backendurl, token, currencySymbol } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formData = {
        name,
        price,
        quantity: quantity || undefined,
        category,
        subCategory: subCategory || undefined,
      };

      const { data } = await axios.post(
        `${backendurl}/api/user/add-items`,
        formData,
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);

        setName("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setSubCategory("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while adding the item.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-6 min-h-[80vh]">
      <h2 className="text-3xl font-semibold text-center text-teal-600 mb-8">
        Add New Item
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price:
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {currencySymbol}
            </span>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-12 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity (optional):
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Category dropdown */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          >
            <option value="">Select Category</option>
            <option value="Valvate Box">Valvate Box</option>
            <option value="Plastic Box">Plastic Box</option>
            <option value="Bags">Bags</option>
          </select>
        </div>

        {/* Sub-Category dropdown */}
        <div>
          <label
            htmlFor="subCategory"
            className="block text-sm font-medium text-gray-700"
          >
            Sub-Category (optional):
          </label>
          <select
            id="subCategory"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select Sub-Category</option>
            <option value="Dozens">Dozen</option>
            <option value="Pieces">Pieces</option>
          </select>
        </div>

        {/* Submit button */}
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItems;
