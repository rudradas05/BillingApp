import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          DAS JEWELLERY BOX & BAG SUPPLY
        </h2>
        <p className="text-gray-600">
          Prop. - Mantu Das | Khalore, Bagnan, Howrah
        </p>
        <p className="text-gray-600">Mobile: 9775166264 / 9679490960</p>
        <hr className="my-4 border-t-2 border-gray-300" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex mb-4">
            <label className="w-1/4 font-bold text-gray-700">Name:</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-3/4 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex mb-4">
            <label className="w-1/4 font-bold text-gray-700">Address:</label>
            <input
              type="text"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-3/4 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse mb-20">
            <thead>
              <tr>
                <th className="p-3 text-left bg-gray-100 border-b font-medium text-gray-700">
                  ITEM NAME
                </th>
                <th className="p-3 text-left bg-gray-100 border-b font-medium text-gray-700">
                  QUANTITY
                </th>
                <th className="p-3 text-left bg-gray-100 border-b font-medium text-gray-700">
                  RATE
                </th>
                <th className="p-3 text-left bg-gray-100 border-b font-medium text-gray-700">
                  AMOUNT {currencySymbol}
                </th>
                <th className="p-3 text-left bg-gray-100 border-b font-medium text-gray-700">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index}>
                  <td className="p-3 border-b">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search item"
                        value={item.name}
                        name="name"
                        onChange={(e) => {
                          handleInputChange(index, e);
                          const updatedItems = [...billItems];
                          updatedItems[index].searchQuery = e.target.value;
                          setBillItems(updatedItems);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md z-10"
                      />
                      {item.searchQuery && (
                        <ul className="absolute bg-white border rounded-md w-full mt-1 z-10">
                          {filteredItems(item.searchQuery).map(
                            (filteredItem) => (
                              <li
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
                                className="p-2 hover:bg-gray-200 cursor-pointer z-10"
                              >
                                {filteredItem.name}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  </td>
                  <td className="p-3 border-b">
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="1"
                    />
                  </td>
                  <td className="p-3 border-b">
                    {item.rate} {item.subCategory && `/${item.subCategory}`}
                  </td>
                  <td className="p-3 border-b">{item.amount}</td>
                  <td className="p-3 border-b text-center">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="bg-red-500 text-white p-2 rounded-md"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-500 text-white p-3 rounded-md mb-6 block mx-auto"
        >
          Add Item
        </button>

        <div className="text-right mb-6">
          <h3 className="text-xl font-bold text-gray-700">TOTAL</h3>
          <h2 className="text-3xl font-bold text-red-500">
            {currencySymbol}
            {total}
          </h2>
        </div>

        <div className="mt-6">
          <div className="flex mb-4">
            <p className="w-1/4 font-bold">Date:</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-3/4 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-3 rounded-md w-full"
          >
            Create Bill
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default NewBill;
