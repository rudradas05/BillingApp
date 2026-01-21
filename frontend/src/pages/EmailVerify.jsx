import React, { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

const EmailVerify = () => {
  const { backendurl, token, userData, isLoggedin, isVerified } =
    useContext(AppContext);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isOtpInvalid, setIsOtpInvalid] = useState(false);

  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    const { value } = e.target;
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const sendVerificationOtp = async () => {
    try {
      if (!userData || !userData._id) {
        toast.error("User data not loaded. Please refresh and try again.", toastConfig);
        return;
      }
      const userId = userData._id;
      const { data } = await axios.post(
        `${backendurl}/api/user/send-verify-otp`,
        { userId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Verification OTP sent successfully", toastConfig);
        setIsOtpSubmitted(true);
      } else {
        toast.error(data.message, toastConfig);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong", toastConfig);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    const enteredOtp = otpArray.join("");

    if (enteredOtp.length !== 6) {
      setIsOtpInvalid(true);
      toast.error("Please enter a valid 6-digit OTP.", toastConfig);
      return;
    }

    try {
      if (!userData || !userData._id) {
        toast.error("User data not loaded. Please refresh and try again.", toastConfig);
        return;
      }
      const userId = userData._id;
      const { data } = await axios.post(
        `${backendurl}/api/user/verify-account`,
        { userId, otp: enteredOtp },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Email verified successfully!", toastConfig);
        navigate("/");
      } else {
        setIsOtpInvalid(true);
        toast.error(data.message, toastConfig);
      }
    } catch (error) {
      toast.error(error.message || "Verification failed", toastConfig);
    }
  };

  const inputClass = (index) =>
    `w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md ${
      isOtpInvalid && inputRefs.current[index]?.value === ""
        ? "border-red-500"
        : ""
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pt-24 pb-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl shadow-lg p-8 backdrop-blur-md">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-2xl font-semibold mb-4">
            Welcome to InvoiceMaster Pro
          </h1>
          <p className="mb-6 text-center">
            For the first time and to stay updated with us, please verify your
            email.
          </p>

          {!isOtpSubmitted ? (
            <button
              onClick={sendVerificationOtp}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-900 text-white font-medium"
            >
              Send Verification OTP
            </button>
          ) : (
            <form
              onSubmit={verifyOtp}
              className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
            >
              <h1 className="text-white text-2xl font-semibold text-center mb-4">
                Verify Email
              </h1>
              <p className="text-center mb-6 text-indigo-300">
                Enter the 6-digit code sent to your email ID.
              </p>
              <div className="flex justify-between mb-8" onPaste={handlePaste}>
                {Array(6)
                  .fill("")
                  .map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className={inputClass(index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      onInput={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-900 text-white font-medium"
              >
                Verify OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
