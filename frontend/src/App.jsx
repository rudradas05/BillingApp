import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddItems from "./pages/AddItems";
import Footer from "./components/Footer";
import NewBill from "./pages/NewBill";
import Login from "./pages/Login";
import AllBill from "./pages/AllBill";
import AllItems from "./pages/AllItems";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  return (
    <div className=" mx-4 sm:mx-[5%]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-items" element={<AddItems />} />
        <Route path="/all-items" element={<AllItems />} />
        <Route path="/all-bills" element={<AllBill />} />
        <Route path="billing" element={<NewBill />} />
        <Route path="login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
