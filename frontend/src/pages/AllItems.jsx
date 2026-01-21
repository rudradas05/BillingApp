import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiSearch, FiPlus, FiTrash2, FiChevronDown } from "react-icons/fi";

const AllItems = () => {
  const {
    items,
    backendurl,
    token,
    userData,
    getAllItems,
    currencySymbol,
    categories,
  } = useContext(AppContext);

  const [filterItems, setFilterItems] = useState(items);
  const [search, setSearch] = useState("");
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setFilterItems(items);
  }, [items]);

  useEffect(() => {
    let filtered = items;

    if (selectedCategory) {
      filtered = filtered.filter(
        (item) => item.category === selectedCategory
      );
    }

    if (search.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilterItems(filtered);
  }, [search, selectedCategory, items]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
    setShowCategoryFilter(false);
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await axios.post(
        `${backendurl}/api/user/remove-item`,
        { itemId, userId: userData.userId },
        { headers: { token } }
      );

      if (data.success) {
        getAllItems();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  

  return (
    <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Inventory
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Manage all products available for billing
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items"
                className="w-56 rounded-lg bg-[#0f1424] border border-white/10 pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryFilter((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0f1424] px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:border-cyan-400 transition"
              >
                {selectedCategory || "Category"}
                <FiChevronDown />
              </button>

              {showCategoryFilter && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-[#0f1424] shadow-lg z-10">
                  {categories?.length ? (
                    categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => handleCategoryClick(cat.name)}
                        className={`w-full text-left px-4 py-2 text-sm transition ${
                          selectedCategory === cat.name
                            ? "bg-white/10 text-white"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No categories
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Add Item */}
            <button
              onClick={() => navigate("/add-items")}
              className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-cyan-400 transition"
            >
              <FiPlus />
              Add Item
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f1424]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#0b0f1a] text-gray-400">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium text-right">Price</th>
                <th className="px-5 py-3 font-medium text-right">Quantity</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filterItems.length > 0 ? (
                filterItems.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-5 py-4 text-white">
                      {item.name}
                    </td>
                    <td className="px-5 py-4 text-gray-400">
                      {item.category}
                    </td>
                    <td className="px-5 py-4 text-right text-white">
                      {currencySymbol}
                      {item.price}
                    </td>
                    <td className="px-5 py-4 text-right text-gray-300">
                      {item.quantity ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => removeItem(item._id)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 transition"
                        title="Delete item"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-sm text-gray-500"
                  >
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllItems;
