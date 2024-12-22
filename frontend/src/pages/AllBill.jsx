import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const AllBill = () => {
  const { bills, setBills, getAllBills } = useContext(AppContext);
  const [expandedBill, setExpandedBill] = useState(null);
  useEffect(() => {
    getAllBills();
  }, [getAllBills]);

  const handleViewDetails = (billId) => {
    setExpandedBill((prevBill) => (prevBill === billId ? null : billId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-200 to-pink-200 py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">
        All Bills
      </h2>
      {Array.isArray(bills) && bills.length > 0 ? (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white p-4">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 border-b">
                  Customer Name
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 border-b">
                  No. of Items
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 border-b">
                  Total Amount
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 border-b">
                  Date
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 border-b">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <React.Fragment key={bill._id}>
                  <tr className="hover:bg-gray-50 transition duration-300 ease-in-out">
                    <td className="py-4 px-6 text-sm text-gray-700 border-b">
                      {bill.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 border-b">
                      {bill.items.length}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 border-b">
                      ₹{bill.total}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 border-b">
                      {new Date(bill.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 border-b">
                      <button
                        onClick={() => handleViewDetails(bill._id)}
                        className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:from-teal-500 hover:to-blue-600 transition"
                      >
                        {expandedBill === bill._id
                          ? "Hide Details"
                          : "View Details"}
                      </button>
                    </td>
                  </tr>

                  {expandedBill === bill._id && (
                    <tr>
                      <td colSpan="5" className="py-4 px-6 bg-gray-50 border-b">
                        <div className="space-y-4">
                          <h4 className="text-xl font-semibold text-gray-700">
                            Items:
                          </h4>
                          <table className="min-w-full">
                            <thead>
                              <tr>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                                  Item Name
                                </th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                                  Quantity
                                </th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                                  Rate
                                </th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {bill.items.map((item) => (
                                <tr key={item._id} className="border-t">
                                  <td className="py-3 px-4 text-sm text-gray-700">
                                    {item.name}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-700">
                                    {item.quantity}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-700">
                                    ₹{item.rate}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-700">
                                    ₹{item.amount}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="mt-4 flex justify-between">
                            <h4 className="text-xl font-semibold text-gray-700">
                              Total Amount:
                            </h4>
                            <p className="text-2xl font-semibold text-gray-800">
                              ₹{bill.total}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No bills available.</p>
      )}
    </div>
  );
};

export default AllBill;
