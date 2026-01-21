// import React, { useContext, useState, useEffect } from "react";
// import { AppContext } from "../context/AppContext";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
// import { FiPlus, FiTrash2 } from "react-icons/fi";

// const NewBill = () => {
//   const navigate = useNavigate();
//   const { currencySymbol, userData } = useContext(AppContext);

//   const [name, setName] = useState("");
//   const [date, setDate] = useState("");
//   const [customerAddress, setCustomerAddress] = useState("");

//   const [total, setTotal] = useState(0);

//   const [billItems, setBillItems] = useState([
//     {
//       name: "",
//       quantity: 1,
//       rate: 0,
//       amount: 0,
//       subCategory: "",
//       searchQuery: "",
//     },
//   ]);

//   /* ---------------- TOTAL ---------------- */
//   useEffect(() => {
//     const sum = billItems.reduce((acc, item) => acc + item.amount, 0);
//     setTotal(sum);
//   }, [billItems]);

//   const handleAddItem = () => {
//     setBillItems([
//       ...billItems,
//       {
//         name: "",
//         quantity: 1,
//         rate: 0,
//         amount: 0,
//         subCategory: "",
//         searchQuery: "",
//       },
//     ]);
//   };

//   const handleRemoveItem = (index) => {
//     setBillItems(billItems.filter((_, i) => i !== index));
//   };

//   const handleInputChange = (index, e) => {
//     const { name, value } = e.target;
//     const updated = [...billItems];

//     updated[index][name] = name === "quantity" ? Number(value) : value;
//     updated[index].amount = updated[index].quantity * updated[index].rate;

//     setBillItems(updated);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!name || billItems.length === 0) {
//       toast.error("Please fill required fields");
//       return;
//     }

//     try {
//       await axios.post("/api/bill/create", {
//         name,
//         address: customerAddress,
//         date: new Date(date),
//         items: billItems,
//         total,
//       });

//       toast.success("Bill generated successfully");
//       navigate("/all-bills");
//     } catch {
//       toast.error("Failed to generate bill");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-16">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* ================= HEADER ================= */}
//         <div className="mb-10">
//           <h1 className="text-2xl font-semibold text-white tracking-tight">
//             New Bill
//           </h1>
//           <p className="text-sm text-gray-400 mt-1">Create a new invoice</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-10">
//           {/* ================= BUSINESS DETAILS ================= */}
//           <div className="rounded-xl border border-white/10 bg-[#0f1424] p-6">
//             <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-4">
//               Business Details
//             </h2>

//             <p className="text-white font-semibold">
//               {userData?.companyName || "Company Name"}
//             </p>

//             <p className="text-sm text-gray-400 mt-1">
//               Prop. {userData?.name || "Owner Name"}
//             </p>

//             <p className="text-sm text-gray-400 mt-1">
//               {userData?.address || "Business Address"}
//             </p>

//             <p className="text-sm text-gray-400 mt-1">
//               Mobile: {userData?.phoneNumber || "Phone Number"}
//             </p>
//           </div>

//           {/* ================= CUSTOMER DETAILS ================= */}
//           <div className="rounded-xl border border-white/10 bg-[#0f1424] p-6">
//             <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-4">
//               Customer Details
//             </h2>

//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm text-gray-400 mb-2">
//                   Customer Name *
//                 </label>
//                 <input
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full rounded-lg bg-[#0b0f1a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
//                   placeholder="Customer name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-400 mb-2">
//                   Bill Date
//                 </label>
//                 <input
//                   type="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className="w-full rounded-lg bg-[#0b0f1a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm text-gray-400 mb-2">
//                   Address
//                 </label>
//                 <input
//                   value={customerAddress}
//                   onChange={(e) => setCustomerAddress(e.target.value)}
//                   className="w-full rounded-lg bg-[#0b0f1a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
//                   placeholder="Customer address (auto-filled)"
//                 />
//                 <p className="mt-1 text-xs text-gray-500">
//                   Auto-filled from business profile. Editable.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ================= LINE ITEMS ================= */}
//           <div className="rounded-xl border border-white/10 bg-[#0f1424] p-6">
//             <div className="flex justify-between mb-4">
//               <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
//                 Line Items
//               </h2>
//               <button
//                 type="button"
//                 onClick={handleAddItem}
//                 className="flex items-center gap-2 bg-cyan-500 px-4 py-2 rounded-lg text-black font-semibold hover:bg-cyan-400"
//               >
//                 <FiPlus /> Add Item
//               </button>
//             </div>

//             <table className="w-full text-sm">
//               <thead className="border-b border-white/10 text-gray-400">
//                 <tr>
//                   <th className="text-left py-2">Item</th>
//                   <th className="text-right py-2">Qty</th>
//                   <th className="text-right py-2">Rate</th>
//                   <th className="text-right py-2">Amount</th>
//                   <th />
//                 </tr>
//               </thead>

//               <tbody>
//                 {billItems.map((item, index) => (
//                   <tr key={index} className="border-b border-white/5">
//                     <td className="py-3">
//                       <input
//                         name="name"
//                         value={item.name}
//                         onChange={(e) => handleInputChange(index, e)}
//                         className="w-full bg-[#0b0f1a] border border-white/10 rounded-md px-3 py-2 text-white"
//                         placeholder="Item name"
//                       />
//                     </td>

//                     <td className="py-3 text-right">
//                       <input
//                         type="number"
//                         min="1"
//                         name="quantity"
//                         value={item.quantity}
//                         onChange={(e) => handleInputChange(index, e)}
//                         className="w-20 bg-[#0b0f1a] border border-white/10 rounded-md px-2 py-2 text-right text-white"
//                       />
//                     </td>

//                     <td className="py-3 text-right text-gray-300">
//                       {currencySymbol}
//                       {item.rate.toFixed(2)}
//                     </td>

//                     <td className="py-3 text-right text-white font-medium">
//                       {currencySymbol}
//                       {item.amount.toFixed(2)}
//                     </td>

//                     <td className="py-3 text-right">
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveItem(index)}
//                         className="text-gray-400 hover:text-red-400"
//                       >
//                         <FiTrash2 />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* ================= TOTAL ================= */}
//           <div className="flex justify-between items-center">
//             <div className="text-lg font-semibold text-white">
//               Total:
//               <span className="ml-2 text-cyan-400">
//                 {currencySymbol}
//                 {total.toFixed(2)}
//               </span>
//             </div>

//             <button
//               type="submit"
//               className="bg-cyan-500 px-8 py-3 rounded-lg font-semibold text-black hover:bg-cyan-400"
//             >
//               Generate Bill
//             </button>
//           </div>
//         </form>
//       </div>

//       <ToastContainer position="bottom-right" />
//     </div>
//   );
// };

// export default NewBill;

import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FiPlus, FiTrash2, FiChevronDown } from "react-icons/fi";

const NewBill = () => {
  const navigate = useNavigate();

  const {
    backendurl,
    token,
    userData,
    currencySymbol,
    items,
    downloadBillPDF,
  } = useContext(AppContext);

  /* ================= CUSTOMER ================= */
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [date, setDate] = useState("");

  /* ================= BILL ITEMS ================= */
  const [billItems, setBillItems] = useState([
    {
      name: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      subCategory: "",
      searchQuery: "",
    },
  ]);

  /* ================= AUTO DATE ================= */
  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  /* ================= TOTAL ================= */
  const total = billItems.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  /* ================= HELPERS ================= */
  const filteredItems = (query) => {
    if (!query) return [];
    return items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    );
  };

  /* ================= HANDLERS ================= */
  const handleAddItem = () => {
    setBillItems([
      ...billItems,
      {
        name: "",
        quantity: 1,
        rate: 0,
        amount: 0,
        subCategory: "",
        searchQuery: "",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...billItems];

    updated[index][name] = name === "quantity" ? Number(value) : value;

    /* ---------- SEARCH + AUTO RATE ---------- */
    if (name === "name") {
      updated[index].searchQuery = value;

      const matched = items.find(
        (i) => i.name.toLowerCase() === value.toLowerCase(),
      );

      if (matched) {
        const rate =
          matched.subCategory?.toLowerCase() === "dozen"
            ? matched.price / 12
            : matched.price;

        updated[index].rate = Number(rate.toFixed(2));
        updated[index].subCategory = matched.subCategory || "";
        updated[index].amount = rate * updated[index].quantity;
        updated[index].searchQuery = "";
      }
    }

    /* ---------- RECALCULATE ---------- */
    if (name === "quantity" || name === "rate") {
      updated[index].amount =
        Number(updated[index].quantity) * Number(updated[index].rate || 0);
    }

    setBillItems(updated);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || billItems.length === 0) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendurl}/api/user/new-bill`,
        {
          name: customerName,
          address: customerAddress,
          date,
          items: billItems,
          total,
        },
        { headers: { token } },
      );

      toast.success("Bill created successfully");

      if (data.billId) {
        downloadBillPDF(data.billId);
      }

      navigate("/all-bills");
    } catch (err) {
      toast.error("Failed to generate bill");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-2xl font-semibold text-white mb-6">New Bill</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ================= BUSINESS ================= */}
          <div className="bg-[#0f1424] border border-white/10 rounded-xl p-6">
            <p className="text-white font-semibold">{userData?.companyName}</p>
            <p className="text-gray-400 text-sm">Prop. {userData?.name}</p>
            <p className="text-gray-400 text-sm">{userData?.address}</p>
            <p className="text-gray-400 text-sm">
              Mobile: {userData?.phoneNumber}
            </p>
          </div>

          {/* ================= CUSTOMER ================= */}
          <div className="bg-[#0f1424] border border-white/10 rounded-xl p-6 grid md:grid-cols-2 gap-6">
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="bg-[#0b0f1a] border border-white/10 px-4 py-3 rounded-lg text-white"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#0b0f1a] border border-white/10 px-4 py-3 rounded-lg text-white"
            />

            <input
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Customer Address"
              className="bg-[#0b0f1a] border border-white/10 px-4 py-3 rounded-lg text-white md:col-span-2"
            />
          </div>

          {/* ================= ITEMS ================= */}
          <div className="rounded-xl border border-white/10 bg-[#0f1424] p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                 Items
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-2 bg-cyan-500 px-4 py-2 rounded-lg text-black font-semibold hover:bg-cyan-400"
              >
                <FiPlus /> Add Item
              </button>
            </div>

            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left">Item</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Rate</th>
                  <th className="text-right">Amount</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {billItems.map((item, index) => (
                  <tr key={index} className="border-t border-white/5">
                    {/* ITEM SEARCH */}
                    <td className="relative py-3">
                      <input
                        name="name"
                        value={item.name}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder="Search item"
                        className="w-full bg-[#0b0f1a] border border-white/10 px-3 py-2 rounded-md text-white"
                      />

                      {item.searchQuery &&
                        filteredItems(item.searchQuery).length > 0 && (
                          <div className="absolute z-20 w-full mt-1 bg-[#0f1424] border border-white/10 rounded-md shadow-lg">
                            {filteredItems(item.searchQuery).map((it) => (
                              <div
                                key={it._id}
                                onClick={() => {
                                  const rate =
                                    it.subCategory === "dozen"
                                      ? it.price / 12
                                      : it.price;

                                  const updated = [...billItems];
                                  updated[index] = {
                                    ...updated[index],
                                    name: it.name,
                                    rate: Number(rate.toFixed(2)),
                                    amount: rate * updated[index].quantity,
                                    subCategory: it.subCategory || "",
                                    searchQuery: "",
                                  };
                                  setBillItems(updated);
                                }}
                                className="px-3 py-2 text-gray-300 hover:bg-white/10 cursor-pointer"
                              >
                                {it.name}
                              </div>
                            ))}
                          </div>
                        )}
                    </td>

                    <td className="text-right">
                      <input
                        type="number"
                        min="1"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-20 bg-[#0b0f1a] border border-white/10 px-2 py-2 rounded-md text-right text-white"
                      />
                    </td>

                    <td className="text-right text-gray-300">
                      {currencySymbol}
                      {item.rate.toFixed(2)}
                    </td>

                    <td className="text-right text-white">
                      {currencySymbol}
                      {item.amount.toFixed(2)}
                    </td>

                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= TOTAL ================= */}
          <div className="flex justify-between items-center">
            <p className="text-xl text-white">
              Total:{" "}
              <span className="text-cyan-400">
                {currencySymbol}
                {total.toFixed(2)}
              </span>
            </p>

            <button
              type="submit"
              className="bg-cyan-500 px-8 py-3 rounded-lg text-black font-semibold"
            >
              Generate Bill
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default NewBill;
