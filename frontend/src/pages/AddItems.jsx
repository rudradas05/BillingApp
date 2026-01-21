import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FiPackage, FiPlus, FiChevronDown, FiLoader } from "react-icons/fi";

const AddItems = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showAddCategory, setShowAddCategory] = useState(false);

  const { backendurl, token, categories, getCategories } =
    useContext(AppContext);
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    setSubCategory("");
  }, [category]);

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await addCategory(newCategory.trim());
    setNewCategory("");
    setShowAddCategory(false);
  };

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
        { headers: { token } },
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
          "An error occurred while adding the item.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const addCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name required");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendurl}/api/category/add`,
        { name: newCategory },
        { headers: { token } },
      );

      if (data.success) {
        toast.success("Category added");
        setNewCategory("");
        setAddingCategory(false);
        // refresh categories from context
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("refreshCategories"));
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Add Item
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Create a new product to be used in billing and inventory.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-white/10 bg-[#0f1424] p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Product Name *
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg bg-[#0b0f1a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Gold Ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-lg bg-[#0b0f1a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">
                    Stock Quantity (optional)
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full rounded-lg bg-[#0b0f1a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    placeholder="Available quantity"
                  />
                </div>
              </div>
            </div>

            {/* Classification */}
            <div className="space-y-6 pt-6 border-t border-white/10">
              <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                Classification
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Category *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-full">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full appearance-none rounded-lg bg-[#0b0f1a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                        required
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        {categories?.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddCategory((v) => !v)}
                      className="px-3 rounded-lg border border-white/10 text-sm text-gray-300 hover:border-cyan-400 hover:text-white transition"
                    >
                      +
                    </button>
                  </div>

                  {showAddCategory && (
                    <div className="mt-3 rounded-lg border border-white/10 bg-[#0b0f1a] p-3">
                      <p className="text-xs text-gray-400 mb-2">
                        Add new category
                      </p>

                      <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Category name"
                        className="w-full rounded-md bg-[#0f1424] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />

                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={addCategory}
                          className="flex-1 rounded-md bg-cyan-500 py-1.5 text-sm font-semibold text-black hover:bg-cyan-400 transition"
                        >
                          Add
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowAddCategory(false);
                            setNewCategory("");
                          }}
                          className="flex-1 rounded-md border border-white/10 py-1.5 text-sm text-gray-400 hover:text-white transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Sub-Category (optional)
                  </label>
                  <div className="relative">
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full appearance-none rounded-lg bg-[#0b0f1a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="" disabled>
                        Select sub-category
                      </option>
                      <option value="Dozen">Dozen</option>
                      <option value="Pieces">Pieces</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-black hover:bg-cyan-400 transition disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Adding item...
                  </>
                ) : (
                  <>
                    <FiPlus />
                    Add Item
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItems;
