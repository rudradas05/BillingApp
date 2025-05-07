// import React, { useContext, useState, useEffect } from "react";
// import { AppContext } from "../context/AppContext";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// const NewBill = () => {
//   const {
//     backendurl,
//     userData,
//     token,
//     currencySymbol,
//     items,
//     downloadBillPDF,
//   } = useContext(AppContext);

//   const [name, setName] = useState("");
//   const [address, setAddress] = useState("");
//   const [date, setDate] = useState("");
//   const [billItems, setBillItems] = useState([
//     {
//       name: "",
//       quantity: 1,
//       rate: "",
//       amount: 0,
//       subCategory: "",
//       searchQuery: "",
//     },
//   ]);

//   const handleAddItem = () => {
//     setBillItems([
//       ...billItems,
//       {
//         name: "",
//         quantity: 1,
//         rate: "",
//         amount: 0,
//         subCategory: "",
//         searchQuery: "",
//       },
//     ]);
//   };

//   const handleRemoveItem = (index) => {
//     const updatedItems = billItems.filter((_, i) => i !== index);
//     setBillItems(updatedItems);
//   };

//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const updatedItems = [...billItems];
//     updatedItems[index] = { ...updatedItems[index], [name]: value };

//     if (name === "name" && value) {
//       const selectedItem = items.find((item) => item.name === value);
//       if (selectedItem) {
//         const ratePerUnit =
//           selectedItem.subCategory === "dozen"
//             ? selectedItem.price / 12
//             : selectedItem.price;

//         updatedItems[index].rate = ratePerUnit.toFixed(2);
//         updatedItems[index].subCategory = selectedItem.subCategory;
//         updatedItems[index].amount = ratePerUnit * updatedItems[index].quantity;
//       }
//     }

//     if (name === "rate" || name === "quantity") {
//       const currentRate = updatedItems[index].rate || 0;
//       updatedItems[index].amount = currentRate * updatedItems[index].quantity;
//     }

//     setBillItems(updatedItems);
//   };

//   const filteredItems = (query) =>
//     items.filter((item) =>
//       item.name.toLowerCase().includes(query.toLowerCase())
//     );

//   const total = billItems.reduce(
//     (sum, item) => sum + parseFloat(item.amount || 0),
//     0
//   );

//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0];
//     setDate(today);
//   }, []);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const billData = {
//       name,
//       address,
//       date,
//       items: billItems,
//       total,
//     };

//     try {
//       const response = await axios.post(
//         backendurl + "/api/user/new-bill",
//         billData,
//         {
//           headers: { token },
//           params: { userId: userData.userId },
//         }
//       );
//       toast.success("Bill created successfully!");

//       const billId = response.data.billId;
//       if (billId) {
//         downloadBillPDF(billId);
//       } else {
//         console.error("Bill ID is missing from the response.");
//       }

//       setName("");
//       setAddress("");
//       setDate(new Date().toISOString().split("T")[0]);
//       setBillItems([
//         {
//           name: "",
//           quantity: 1,
//           rate: "",
//           amount: 0,
//           subCategory: "",
//           searchQuery: "",
//         },
//       ]);
//     } catch (error) {
//       toast.error("Error creating bill. Please try again!");
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">
//           DAS JEWELLERY BOX & BAG SUPPLY
//         </h2>
//         <p className="text-gray-600">
//           Prop. - Mantu Das | Khalore, Bagnan, Howrah
//         </p>
//         <p className="text-gray-600">Mobile: 9775166264 / 9679490960</p>
//         <hr className="my-4 border-t-2 border-gray-300" />
//       </div>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-6">
//           <div className="flex mb-4">
//             <label className="w-1/4 font-bold text-gray-700">Name:</label>
//             <input
//               type="text"
//               placeholder="Enter Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-3/4 p-2 border border-gray-300 rounded-md"
//             />
//           </div>
//           <div className="flex mb-4">
//             <label className="w-1/4 font-bold text-gray-700">Address:</label>
//             <input
//               type="text"
//               placeholder="Enter Address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               className="w-3/4 p-2 border border-gray-300 rounded-md"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto border-collapse mb-20">
//             <thead>
//               <tr>
//                 <th className="p-3 text-left bg-gray-100 border-b font-medium text-gray-700">
//                   ITEM NAME
//                 </th>
//                 <th className="p-3 text-left bg-gray-100 border-b font-medium text-gray-700">
//                   QUANTITY
//                 </th>
//                 <th className="p-3 text-left bg-gray-100 border-b font-medium text-gray-700">
//                   RATE
//                 </th>
//                 <th className="p-3 text-left bg-gray-100 border-b font-medium text-gray-700">
//                   AMOUNT {currencySymbol}
//                 </th>
//                 <th className="p-3 text-left bg-gray-100 border-b font-medium text-gray-700">
//                   ACTION
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {billItems.map((item, index) => (
//                 <tr key={index}>
//                   <td className="p-3 border-b">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         placeholder="Search item"
//                         value={item.name}
//                         name="name"
//                         onChange={(e) => {
//                           handleInputChange(index, e);
//                           const updatedItems = [...billItems];
//                           updatedItems[index].searchQuery = e.target.value;
//                           setBillItems(updatedItems);
//                         }}
//                         className="w-full p-2 border border-gray-300 rounded-md z-10"
//                       />
//                       {item.searchQuery && (
//                         <ul className="absolute bg-white border rounded-md w-full mt-1 z-10">
//                           {filteredItems(item.searchQuery).map(
//                             (filteredItem) => (
//                               <li
//                                 key={filteredItem.id}
//                                 onClick={() => {
//                                   const ratePerUnit =
//                                     filteredItem.subCategory === "dozen"
//                                       ? filteredItem.price / 12
//                                       : filteredItem.price;

//                                   const updatedItems = [...billItems];
//                                   updatedItems[index].name = filteredItem.name;
//                                   updatedItems[index].rate =
//                                     ratePerUnit.toFixed(2);
//                                   updatedItems[index].amount =
//                                     ratePerUnit * updatedItems[index].quantity;
//                                   updatedItems[index].subCategory =
//                                     filteredItem.subCategory;
//                                   updatedItems[index].searchQuery = "";
//                                   setBillItems(updatedItems);
//                                 }}
//                                 className="p-2 hover:bg-gray-200 cursor-pointer z-10"
//                               >
//                                 {filteredItem.name}
//                               </li>
//                             )
//                           )}
//                         </ul>
//                       )}
//                     </div>
//                   </td>
//                   <td className="p-3 border-b">
//                     <input
//                       type="number"
//                       name="quantity"
//                       value={item.quantity}
//                       onChange={(e) => handleInputChange(index, e)}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                       min="1"
//                     />
//                   </td>
//                   <td className="p-3 border-b">
//                     {item.rate} {item.subCategory && `/${item.subCategory}`}
//                   </td>
//                   <td className="p-3 border-b">{item.amount}</td>
//                   <td className="p-3 border-b text-center">
//                     <button
//                       onClick={() => handleRemoveItem(index)}
//                       className="bg-red-500 text-white p-2 rounded-md"
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <button
//           type="button"
//           onClick={handleAddItem}
//           className="bg-blue-500 text-white p-3 rounded-md mb-6 block mx-auto"
//         >
//           Add Item
//         </button>

//         <div className="text-right mb-6">
//           <h3 className="text-xl font-bold text-gray-700">TOTAL</h3>
//           <h2 className="text-3xl font-bold text-red-500">
//             {currencySymbol}
//             {total}
//           </h2>
//         </div>

//         <div className="mt-6">
//           <div className="flex mb-4">
//             <p className="w-1/4 font-bold">Date:</p>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="w-3/4 p-2 border border-gray-300 rounded-md"
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-green-500 text-white p-3 rounded-md w-full"
//           >
//             Create Bill
//           </button>
//         </div>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default NewBill;

import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FiPlus, FiTrash2, FiChevronDown } from "react-icons/fi";

const NewBill = () => {
  const {
    backendurl,
    userData,
    token,
    currencySymbol,
    items,
    downloadBillPDF,
  } = useContext(AppContext);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [billItems, setBillItems] = useState([
    {
      name: "",
      quantity: 1,
      rate: "",
      amount: 0,
      subCategory: "",
      searchQuery: "",
    },
  ]);

  const handleAddItem = () => {
    setBillItems([
      ...billItems,
      {
        name: "",
        quantity: 1,
        rate: "",
        amount: 0,
        subCategory: "",
        searchQuery: "",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = billItems.filter((_, i) => i !== index);
    setBillItems(updatedItems);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedItems = [...billItems];
    updatedItems[index] = { ...updatedItems[index], [name]: value };

    if (name === "name" && value) {
      const selectedItem = items.find((item) => item.name === value);
      if (selectedItem) {
        const ratePerUnit =
          selectedItem.subCategory === "dozen"
            ? selectedItem.price / 12
            : selectedItem.price;

        updatedItems[index].rate = ratePerUnit.toFixed(2);
        updatedItems[index].subCategory = selectedItem.subCategory;
        updatedItems[index].amount = ratePerUnit * updatedItems[index].quantity;
      }
    }

    if (name === "rate" || name === "quantity") {
      const currentRate = updatedItems[index].rate || 0;
      updatedItems[index].amount = currentRate * updatedItems[index].quantity;
    }

    setBillItems(updatedItems);
  };

  const filteredItems = (query) =>
    items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

  const total = billItems.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const billData = {
      name,
      address,
      date,
      items: billItems,
      total,
    };

    try {
      const response = await axios.post(
        backendurl + "/api/user/new-bill",
        billData,
        {
          headers: { token },
          params: { userId: userData.userId },
        }
      );
      toast.success("Bill created successfully!");

      const billId = response.data.billId;
      if (billId) {
        downloadBillPDF(billId);
      } else {
        console.error("Bill ID is missing from the response.");
      }

      setName("");
      setAddress("");
      setDate(new Date().toISOString().split("T")[0]);
      setBillItems([
        {
          name: "",
          quantity: 1,
          rate: "",
          amount: 0,
          subCategory: "",
          searchQuery: "",
        },
      ]);
    } catch (error) {
      toast.error("Error creating bill. Please try again!");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Company Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">
            DAS JEWELLERY BOX & BAG SUPPLY
          </h1>
          <p className="text-sm opacity-90">
            Prop. - Mantu Das | Khalore, Bagnan, Howrah
          </p>
          <p className="text-sm mt-1 opacity-90">
            Mobile: 9775166264 / 9679490960
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="Enter customer name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter customer address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Items</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="text-lg" />
                Add Item
              </button>
            </div>

            {billItems.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 relative group"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Item Name */}
                  <div className="md:col-span-2 relative">
                    <label className="block text-sm text-gray-600 mb-1">
                      Item Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search item..."
                        value={item.name}
                        name="name"
                        onChange={(e) => {
                          handleInputChange(index, e);
                          const updatedItems = [...billItems];
                          updatedItems[index].searchQuery = e.target.value;
                          setBillItems(updatedItems);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-8 focus:ring-2 focus:ring-blue-500"
                      />
                      <FiChevronDown className="absolute right-3 top-3 text-gray-400" />

                      {item.searchQuery && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                          {filteredItems(item.searchQuery).map(
                            (filteredItem) => (
                              <div
                                key={filteredItem.id}
                                onClick={() => {
                                  const ratePerUnit =
                                    filteredItem.subCategory === "dozen"
                                      ? filteredItem.price / 12
                                      : filteredItem.price;

                                  const updatedItems = [...billItems];
                                  updatedItems[index].name = filteredItem.name;
                                  updatedItems[index].rate =
                                    ratePerUnit.toFixed(2);
                                  updatedItems[index].amount =
                                    ratePerUnit * updatedItems[index].quantity;
                                  updatedItems[index].subCategory =
                                    filteredItem.subCategory;
                                  updatedItems[index].searchQuery = "";
                                  setBillItems(updatedItems);
                                }}
                                className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                              >
                                {filteredItem.name}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>

                  {/* Rate */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Rate
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{item.rate}</span>
                      {item.subCategory && (
                        <span className="text-sm text-gray-500">
                          /{item.subCategory}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Amount
                    </label>
                    <div className="font-medium">
                      {currencySymbol}
                      {item.amount.toFixed(2)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <FiTrash2 className="text-lg" />
                </button>
              </div>
            ))}
          </div>

          {/* Total Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <div className="flex justify-end items-center gap-4">
              <span className="text-lg font-semibold text-gray-700">
                Total:
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {currencySymbol}
                {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Generate Bill
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default NewBill;
