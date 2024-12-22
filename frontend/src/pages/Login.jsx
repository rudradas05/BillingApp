import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { backendurl, token, setToken, setIsLoggedin } = useContext(AppContext);
  const navigate = useNavigate();

  const REGISTER_URL = `${backendurl}/api/user/register`;
  const LOGIN_URL = `${backendurl}/api/user/login`;

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (token) {
      toast.error(
        "You are already logged in. Please logout first.",
        toastConfig
      );
      return;
    }

    if (!email || !password || (state === "Sign Up" && !name)) {
      toast.error("Please fill in all required fields.", toastConfig);
      return;
    }

    setLoading(true);

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(REGISTER_URL, {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setIsLoggedin(true);
          navigate("/email-verify");
          toast.success("Account created successfully!", toastConfig);
        } else {
          toast.error(
            data.message || "Sign up failed, please try again.",
            toastConfig
          );
        }
      } else {
        const { data } = await axios.post(LOGIN_URL, { email, password });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setIsLoggedin(true);
          navigate("/");
          toast.success("Login successful!", toastConfig);
        } else {
          toast.error(
            data.message || "Login failed, please check your credentials.",
            toastConfig
          );
        }
      }
    } catch (error) {
      toast.error("Failed to connect. Please try again later.", toastConfig);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-6 sm:px-0">
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          Please {state === "Sign Up" ? "Sign Up" : "Login"} to book appointment
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="Person Icon" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Enter Full Name"
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="Mail Icon" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Enter Email Address"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="Lock Icon" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Enter Password"
              required
            />
          </div>
          {state !== "Sign Up" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-indigo-500 cursor-pointer"
            >
              Forgot Password?
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-900 text-white font-medium"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : state === "Sign Up"
              ? "Create Account"
              : "Login"}
          </button>
        </form>
        <p className="text-gray-400 text-center text-xs mt-4">
          {state === "Sign Up"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
            className="text-blue-400 cursor-pointer underline"
          >
            {state === "Sign Up" ? "Login here" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
