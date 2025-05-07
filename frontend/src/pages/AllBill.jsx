import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiPrinter,
  FiDownload,
} from "react-icons/fi";
import { format } from "date-fns";
import { toast } from "react-toastify";

const AllBill = () => {
  const { bills, getAllBills, currencySymbol, downloadBillPDF } =
    useContext(AppContext);
  const [expandedBill, setExpandedBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllBills();
  }, [getAllBills]);

  const filteredBills = bills.filter((bill) =>
    bill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (billId) => {
    setExpandedBill((prev) => (prev === billId ? null : billId));
  };

  const handleDownloadPDF = (billId) => {
    if (!billId) {
      console.error("Bill ID is missing.");
      toast.error("Error downloading PDF. Bill ID is missing.");
      return;
    }
    downloadBillPDF(billId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Transaction History
          </h2>
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredBills.length > 0 ? (
            filteredBills.map((bill) => (
              <div
                key={bill._id}
                className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden"
              >
                <div
                  className="p-6 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(bill._id)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-100">
                        {bill.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-gray-400">
                        <span className="flex items-center space-x-2">
                          <FiPrinter className="text-sm" />
                          <span>#{bill.billNumber}</span>
                        </span>
                        <span>
                          {format(new Date(bill.date), "dd MMM yyyy, hh:mm a")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8 mt-4 md:mt-0">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-400">
                          {currencySymbol}
                          {bill.total.toFixed(2)}
                        </p>
                        <span className="text-sm text-gray-400">
                          {bill.items.length} items
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                        {expandedBill === bill._id ? (
                          <FiChevronUp size={24} />
                        ) : (
                          <FiChevronDown size={24} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {expandedBill === bill._id && (
                  <div className="border-t border-white/10 p-6 bg-gray-900/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100 mb-4">
                          Items Breakdown
                        </h4>
                        <div className="space-y-4">
                          {bill.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg"
                            >
                              <div>
                                <p className="text-gray-100">{item.name}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  {item.quantity} x {currencySymbol}
                                  {item.rate.toFixed(2)}
                                </p>
                              </div>
                              <p className="text-cyan-400 font-medium">
                                {currencySymbol}
                                {item.amount.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="lg:pl-8">
                        <div className="space-y-6">
                          <div className="p-6 bg-gray-800/50 rounded-xl">
                            <h4 className="text-lg font-semibold text-gray-100 mb-4">
                              Payment Summary
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between text-gray-300">
                                <span>Subtotal</span>
                                <span>
                                  {currencySymbol}
                                  {bill.total.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between text-gray-300">
                                <span>Tax (0%)</span>
                                <span>{currencySymbol}0.00</span>
                              </div>
                              <div className="flex justify-between text-gray-300">
                                <span>Discount</span>
                                <span>{currencySymbol}0.00</span>
                              </div>
                              <div className="pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center text-gray-100 font-semibold">
                                  <span>Total</span>
                                  <span className="text-cyan-400 text-xl">
                                    {currencySymbol}
                                    {bill.total.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleDownloadPDF(bill._id)}
                              className="flex items-center space-x-2 px-6 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                            >
                              <FiDownload className="text-lg" />
                              <span>Download PDF</span>
                            </button>
                            <button className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-gray-100 rounded-lg hover:bg-gray-700 transition-colors">
                              <FiPrinter className="text-lg" />
                              <span>Print Bill</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBill;
