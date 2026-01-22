import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FiPlus, FiTrash2, FiChevronDown } from "react-icons/fi";

const NewBill = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerResults, setCustomerResults] = useState([]);
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (location.state?.customer) {
      setCustomerName(location.state.customer.name);
      setCustomerAddress(location.state.customer.address || "");
      setCustomerPhone(location.state.customer.phone || "");
      setCustomerEmail(location.state.customer.email || "");
    }
  }, [location.state]);

  useEffect(() => {
    const searchCustomers = async () => {
      if (customerQuery.trim() === "") {
        setCustomerResults([]);
        setShowCustomerResults(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `${backendurl}/api/customer/search?q=${customerQuery}`,
          { headers: { token } },
        );
        setCustomerResults(data.customers);
        setShowCustomerResults(true);
      } catch (error) {
        console.error("Error searching customers:", error);
        toast.error("Failed to search customers");
      }
    };
    const debounceTimeout = setTimeout(searchCustomers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [customerQuery, backendurl, token]);

  const handleCustomerSelect = (customer) => {
    setCustomerName(customer.name);
    setCustomerAddress(customer.address || "");
    setCustomerPhone(customer.phone || "");
    setCustomerEmail(customer.email || "");
    setCustomerQuery("");
    setCustomerResults([]);
    setShowCustomerResults(false);
  };

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
          phone: customerPhone,
          email: customerEmail,
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
            <div className="relative">
              <input
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  setCustomerQuery(e.target.value);
                }}
                placeholder="Customer Name"
                className="w-full bg-[#0b0f1a] border border-white/10 px-4 py-3 rounded-lg text-white"
              />
              {showCustomerResults && customerResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[#0f1424] border border-white/10 rounded-md shadow-lg">
                  {customerResults.map((customer) => (
                    <div
                      key={customer._id}
                      onClick={() => handleCustomerSelect(customer)}
                      className="px-4 py-2 text-white cursor-pointer hover:bg-white/10"
                    >
                      {customer.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            
              placeholder="Customer Phone"
              className="bg-[#0b0f1a] border border-white/10 px-4 py-3 rounded-lg text-white"
            />
            <input
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            
              placeholder="Customer Email"
              className="bg-[#0b0f1a] border border-white/10 px-4 py-3 rounded-lg text-white"
            />
            <div className="md:col-span-2">
              <Link
                to="/add-customer"
                className="text-cyan-400 hover:text-cyan-300"
              >
                + Add New Customer
              </Link>
            </div>
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
