import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100">
      <h1 className="text-4xl font-bold mb-10 text-primary">
        Welcome to the Billing App
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-4/6 max-w-4xl">
        <div
          onClick={() => navigate("/add-items")}
          className="bg-primary text-white rounded-lg shadow-lg p-8 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700"
        >
          <h2 className="text-2xl font-semibold text-center">Add Items</h2>
          <p className="mt-4 text-center">
            Add new items to the inventory or catalog.
          </p>
        </div>
        <div
          onClick={() => navigate("/all-bills")}
          className="bg-primary text-white rounded-lg shadow-lg p-8 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700"
        >
          <h2 className="text-2xl font-semibold text-center">All Bills</h2>
          <p className="mt-4 text-center">
            View and manage all existing bills.
          </p>
        </div>
        <div
          onClick={() => navigate("/billing")}
          className="bg-primary text-white rounded-lg shadow-lg p-8 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700"
        >
          <h2 className="text-2xl font-semibold text-center">New Billing</h2>
          <p className="mt-4 text-center">Generate a new bill for customers.</p>
        </div>
        <div
          onClick={() => navigate("/all-items")}
          className="bg-primary text-white rounded-lg shadow-lg p-8 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700"
        >
          <h2 className="text-2xl font-semibold text-center">All Items</h2>
          <p className="mt-4 text-center">All items are listed here</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
