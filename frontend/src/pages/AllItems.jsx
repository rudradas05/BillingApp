import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-teal-600 mb-4 md:mb-0">
          All Products
        </h1>
        <button
          onClick={() => navigate("/add-items")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full md:w-auto text-sm md:text-base"
        >
          Add Item
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search by name or category"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-80 text-sm md:text-base"
        />
        <button
          onClick={() => setShowCategoryFilter(!showCategoryFilter)}
          className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition text-sm md:text-base"
        >
          {selectedCategory || "All Categories"}
        </button>
      </div>

      {/* Category Filter Dropdown */}
      {showCategoryFilter && (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
          <p className="text-lg font-semibold mb-4">Filter by Category:</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`${
                  selectedCategory === category
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 text-black"
                } px-4 py-2 rounded-lg hover:bg-teal-200 transition text-sm`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg hidden sm:block">
        <table className="w-full table-auto border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="py-3 px-4 text-center">Name</th>
              <th className="py-3 px-4 text-center">Price</th>
              <th className="py-3 px-4 text-center">Quantity</th>
              <th className="py-3 px-4 text-center">Category</th>
              <th className="py-3 px-4 text-center">Sub Category</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterItems.length > 0 ? (
              filterItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3 text-center">{item.name}</td>
                  <td className="px-4 py-3 text-center">
                    {currencySymbol}
                    {item.price}
                  </td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-center">{item.category}</td>
                  <td className="px-4 py-3 text-center">{item.subCategory}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => removeItem(item._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Cards */}
      <div className="sm:hidden">
        {filterItems.length > 0 ? (
          filterItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 mb-4 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600">
                <strong>Price:</strong> {currencySymbol}
                {item.price}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Quantity:</strong> {item.quantity}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Category:</strong> {item.category}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Sub Category:</strong> {item.subCategory}
              </p>
              <button
                onClick={() => removeItem(item._id)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No items found.</p>
        )}
      </div>
    </div>
  );
};

export default AllItems;
