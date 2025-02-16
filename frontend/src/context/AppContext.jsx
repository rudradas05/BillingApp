import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "₹";
  const backendurl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [isLoggedin, setIsLoggedin] = useState(false);

  const [userData, setUserData] = useState(null);

  const [items, setItems] = useState([]);
  const [bills, setBills] = useState([]);

  axios.defaults.withCredentials = true;

  const loadUserData = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/user/get-user-data`, {
        withCredentials: true,
      });
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      console.error("User Data Error:", error);
      toast.error("Something went wrong while fetching user data.");
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/user/is-auth`, {
        withCredentials: true,
      });
      if (data.success) {
        setIsLoggedin(true);
        loadUserData();
      }
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error("Please login again.");
    }
  };

  const getAllItems = async () => {
    try {
      const { data } = await axios.post(
        `${backendurl}/api/user/all-items`,
        { userId: userData?.userId },
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setItems(data.items);
      } else {
        toast.error("Failed to fetch items.");
      }
    } catch (error) {
      console.error("Fetch Items Error:", error);
      toast.error("Could not load items. Please try again.");
    }
  };

  const getAllBills = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/user/all-bill`, {
        withCredentials: true,
      });
      if (data.success) {
        setBills(data.bills);
      } else {
        toast.error("Failed to fetch bills.");
      }
    } catch (error) {
      console.error("Fetch Bills Error:", error);
      toast.error("Could not load bills. Please try again.");
    }
  };

  const downloadBillPDF = async (billId) => {
    try {
      const response = await axios.get(
        `${backendurl}/api/user/bills/${billId}/pdf`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      if (response.data instanceof Blob) {
        const fileURL = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `bill_${billId}.pdf`;
        link.click();
      } else {
        throw new Error("Invalid PDF response.");
      }
    } catch (error) {
      console.error("PDF Download Error:", error);
      toast.error("Error downloading PDF. Please try again.");
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  useEffect(() => {
    if (isLoggedin) {
      getAllItems();
      getAllBills();
    }
  }, [isLoggedin]);

  const value = {
    backendurl,
    isLoggedin,
    setIsLoggedin,
    currencySymbol,
    userData,
    loadUserData,
    setUserData,
    items,
    setItems,
    getAllItems,
    downloadBillPDF,
    bills,
    setBills,
    getAllBills,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
