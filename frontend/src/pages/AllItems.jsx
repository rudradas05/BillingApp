import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiSearch, FiPlus, FiX, FiEdit, FiTrash2 } from "react-icons/fi";

const AllItems = () => {
  const {
    items,
    setItems,
    backendurl,
    token,
    userData,
    getAllItems,
    currencySymbol,
  } = useContext(AppContext);
  const [filterItems, setFilterItems] = useState(items);
  const [search, setSearch] = useState("");
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = ["Valvate Box", "Plastic Box", "Bags"];
  const navigate = useNavigate();

  const applyFilter = () => {
    let filteredItems = items;

    if (selectedCategory) {
      filteredItems = filteredItems.filter(
        (item) => item.category === selectedCategory
      );
    }

    if (search.trim()) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilterItems(filteredItems);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
    setShowCategoryFilter(false);
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/user/remove-item",
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

  useEffect(() => {
    applyFilter();
  }, [search, items, selectedCategory]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800">
              Product Inventory
            </h1>
            <p className="text-gray-600 mt-1">
              {filterItems.length} items found
            </p>
          </div>
          <button
            onClick={() => navigate("/add-items")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <FiPlus className="text-lg" />
            Add New Product
          </button>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-64 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterItems.length > 0 ? (
            filterItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/edit-item/${item._id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <FiEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium text-gray-800">
                        {currencySymbol}
                        {item.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Stock</p>
                      <p
                        className={`font-medium ${
                          item.quantity > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.quantity} in stock
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Sub Category</p>
                      <p className="font-medium text-gray-800">
                        {item.subCategory}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Updated</p>
                      <p className="font-medium text-gray-800">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                <FiX className="text-4xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllItems;
