import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendurl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [isLoggedin, setIsLoggedin] = useState(!!localStorage.getItem("token"));
  const [userData, setUserData] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [items, setItems] = useState("");
  const [bills, setBills] = useState([]);
  const [categories, setCategories] = useState([]);

  // Category management
  const getCategories = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/category/all", {
        headers: { token },
      });
      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addCategory = async (name) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/category/add",
        { name },
        { headers: { token } }
      );
      if (data.success) {
        toast.success("Category added");
        getCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/category/delete",
        { categoryId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success("Category deleted");
        getCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const loadUserData = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/user/get-user-data", {
        headers: {
          token,
        },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const verification_status_user = async () => {
    if (userData && userData.IsAccountVerified === true) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  };

  const getAllItems = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/user/all-items", {
        headers: {
          token,
        },
      });
      if (data.success) {
        setItems(data.items);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllBills = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/user/all-bill", {
        headers: {
          token,
        },
      });
      if (data.success) {
        setBills(data.bills);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const downloadBillPDF = async (billId) => {
    try {
      const response = await axios.get(
        `${backendurl}/api/user/bills/${billId}/pdf`,
        {
          responseType: "blob",
          headers: {
            token,
          },
        }
      );

      if (response.data instanceof Blob) {
        const fileURL = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `bill_${billId}.pdf`;
        link.click();
      } else {
        throw new Error("PDF data is not valid.");
      }
    } catch (error) {
      toast.error("Error downloading PDF. Please try again.");
    }
  };

  useEffect(() => {
    if (token) {
      loadUserData();
      getAllItems();
      getAllBills();
      getCategories();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsLoggedin(true);
    } else {
      localStorage.removeItem("token");
      setIsLoggedin(false);
    }
  }, [token]);

  const value = {
    token,
    setToken,
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
    categories,
    getCategories,
    addCategory,
    deleteCategory,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
