// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../context/AppContext";
// import { useNavigate } from "react-router-dom";
// import {
//   FiSearch,
//   FiChevronDown,
//   FiChevronUp,
//   FiDownload,
// } from "react-icons/fi";
// import { format } from "date-fns";
// import { toast } from "react-toastify";

// const AllBill = () => {
//   const { bills, getAllBills, token, currencySymbol, downloadBillPDF } =
//     useContext(AppContext);

//   const navigate = useNavigate();
//   const [expandedBill, setExpandedBill] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     if (!token) {
//       toast.error("Please login to view bills");
//       navigate("/login");
//       return;
//     }
//     getAllBills();
//   }, [token, navigate, getAllBills]);

//   const filteredBills = bills.filter((bill) =>
//     bill.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleViewDetails = (billId) => {
//     setExpandedBill((prev) => (prev === billId ? null : billId));
//   };

//   const handleDownloadPDF = (billId) => {
//     if (!billId) {
//       toast.error("Error downloading PDF");
//       return;
//     }
//     downloadBillPDF(billId);
//   };

//   return (
//     <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-16">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl font-semibold text-white tracking-tight">
//               Bills
//             </h1>
//             <p className="text-sm text-gray-400 mt-1">
//               View and manage all customer transactions
//             </p>
//           </div>

//           <div className="relative w-full md:w-80">
//             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
//             <input
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by customer name"
//               className="w-full rounded-lg bg-[#0f1424] border border-white/10 pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f1424]">
//           <table className="w-full text-sm text-left">
//             <thead className="bg-[#0b0f1a] text-gray-400">
//               <tr>
//                 <th className="px-5 py-3 font-medium">Customer</th>
//                 <th className="px-5 py-3 font-medium">Date</th>
//                 <th className="px-5 py-3 font-medium text-right">Total</th>
//                 <th className="px-5 py-3 font-medium text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredBills.length > 0 ? (
//                 filteredBills.map((bill) => (
//                   <React.Fragment key={bill._id}>
//                     <tr
//                       className="border-t border-white/5 hover:bg-white/5 transition cursor-pointer"
//                       onClick={() => handleViewDetails(bill._id)}
//                     >
//                       <td className="px-5 py-4 text-white flex items-center gap-2">
//                         {bill.name}
//                         {expandedBill === bill._id ? (
//                           <FiChevronUp className="text-gray-400" />
//                         ) : (
//                           <FiChevronDown className="text-gray-500" />
//                         )}
//                       </td>

//                       <td className="px-5 py-4 text-gray-400">
//                         {format(new Date(bill.date), "dd MMM yyyy")}
//                       </td>

//                       <td className="px-5 py-4 text-right text-white font-medium">
//                         {currencySymbol}
//                         {bill.total}
//                       </td>

//                       <td
//                         className="px-5 py-4 text-right"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <button
//                           onClick={() => handleDownloadPDF(bill._id)}
//                           className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white hover:bg-white/10 transition"
//                           title="Download PDF"
//                         >
//                           <FiDownload />
//                         </button>
//                       </td>
//                     </tr>

//                     {expandedBill === bill._id && (
//                       <tr className="bg-[#0b0f1a] border-t border-white/5">
//                         <td colSpan={4} className="px-6 py-5">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                               <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
//                                 Items
//                               </p>
//                               <ul className="space-y-1 text-sm text-gray-300">
//                                 {bill.items.map((item, idx) => (
//                                   <li key={idx} className="flex justify-between">
//                                     <span>
//                                       {item.name} × {item.quantity}
//                                     </span>
//                                     <span className="text-gray-400">
//                                       {currencySymbol}
//                                       {item.amount}
//                                     </span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>

//                             <div>
//                               <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
//                                 Billing Address
//                               </p>
//                               <p className="text-sm text-gray-300">
//                                 {bill.address || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={4}
//                     className="py-10 text-center text-sm text-gray-500"
//                   >
//                     No bills found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllBill;

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
} from "react-icons/fi";
import { format } from "date-fns";
import { toast } from "react-toastify";

const AllBill = () => {
  const { bills, getAllBills, token, currencySymbol, downloadBillPDF } =
    useContext(AppContext);

  const navigate = useNavigate();
  const [expandedBill, setExpandedBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view bills");
      navigate("/login");
      return;
    }
    getAllBills();
  }, [token, navigate, getAllBills]);

  const filteredBills = bills.filter((bill) =>
    bill.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleBill = (billId) => {
    setExpandedBill((prev) => (prev === billId ? null : billId));
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">Bills</h1>
            <p className="text-sm text-gray-400">
              View and manage all customer transactions
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name"
              className="w-full rounded-lg bg-[#0f1424] border border-white/10 pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Bills */}
        <div className="space-y-4">
          {filteredBills.length > 0 ? (
            filteredBills.map((bill) => (
              <div
                key={bill._id}
                className="rounded-xl border border-white/10 bg-[#0f1424] overflow-hidden"
              >
                {/* Bill Summary Row */}
                <div
                  onClick={() => toggleBill(bill._id)}
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/5 transition"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{bill.name}</span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(bill.date), "dd MMM yyyy")}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-white font-semibold">
                      {currencySymbol}
                      {bill.total}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadBillPDF(bill._id);
                      }}
                      className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition"
                      title="Download PDF"
                    >
                      <FiDownload />
                    </button>

                    {expandedBill === bill._id ? (
                      <FiChevronUp className="text-gray-400" />
                    ) : (
                      <FiChevronDown className="text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedBill === bill._id && (
                  <div className="border-t border-white/10 bg-[#0b0f1a] px-6 py-5">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Items Table */}
                      <div className="md:col-span-2">
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                          Items
                        </p>

                        <div className="overflow-hidden rounded-lg border border-white/10">
                          <table className="w-full text-sm">
                            <thead className="bg-[#0f1424] text-gray-400">
                              <tr>
                                <th className="px-4 py-2 text-left">Item</th>
                                <th className="px-4 py-2 text-right">Qty</th>
                                <th className="px-4 py-2 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bill.items.map((item, idx) => (
                                <tr
                                  key={idx}
                                  className="border-t border-white/5"
                                >
                                  <td className="px-4 py-2 text-gray-300">
                                    {item.name}
                                  </td>
                                  <td className="px-4 py-2 text-right text-gray-400">
                                    {item.quantity}
                                  </td>
                                  <td className="px-4 py-2 text-right text-white">
                                    {currencySymbol}
                                    {item.amount}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                          Billing Address
                        </p>
                        <div className="rounded-lg border border-white/10 bg-[#0f1424] p-4 text-sm text-gray-300">
                          {bill.address || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-gray-500">
              No bills found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBill;
