import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  theme: "colored",
};

const Login = () => {
  const [state, setState] = useState("Login");
  const [signUpStep, setSignUpStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendurl, token, setToken, setIsLoggedin } = useContext(AppContext);
  const navigate = useNavigate();

  const REGISTER_URL = `${backendurl}/api/user/register`;
  const LOGIN_URL = `${backendurl}/api/user/login`;

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (token) {
      toast.error("You are already logged in.", toastConfig);
      return;
    }

    if (state === "Sign Up" && signUpStep === 1) {
      if (!name || !email || !password) {
        toast.error("Please fill all required fields.", toastConfig);
        return;
      }
      setSignUpStep(2);
      return;
    }

    if (state === "Sign Up" && signUpStep === 2) {
      if (!phoneNumber || !address || !companyName) {
        toast.error("Please fill all required fields.", toastConfig);
        return;
      }

      setLoading(true);
      try {
        const { data } = await axios.post(REGISTER_URL, {
          name,
          email,
          password,
          phoneNumber,
          address,
          companyName,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setIsLoggedin(true);
          navigate("/email-verify");
          toast.success("Account created successfully!", toastConfig);
        } else {
          toast.error(data.message, toastConfig);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Signup failed",
          toastConfig,
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    if (state === "Login") {
      if (!email || !password) {
        toast.error("Please fill all required fields.", toastConfig);
        return;
      }

      setLoading(true);
      try {
        const { data } = await axios.post(LOGIN_URL, { email, password });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setIsLoggedin(true);
          navigate("/");
          toast.success("Login successful!", toastConfig);
        } else {
          toast.error(data.message, toastConfig);
        }
      } catch {
        toast.error("Login failed. Try again.", toastConfig);
      } finally {
        setLoading(false);
      }
    }
  };

  const inputBase =
    "w-full rounded-lg bg-[#0b0f1a] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400";

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0f1424] p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-white tracking-tight">
            {state === "Sign Up" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {state === "Sign Up"
              ? "Start managing billing and inventory"
              : "Sign in to continue"}
          </p>

          {state === "Sign Up" && (
            <p className="mt-3 text-xs text-gray-500">Step {signUpStep} of 2</p>
          )}
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {state === "Sign Up" && signUpStep === 1 && (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputBase}
                placeholder="Full name"
                required
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
                type="email"
                placeholder="Email address"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputBase}
                type="password"
                placeholder="Password"
                required
              />
            </>
          )}

          {state === "Sign Up" && signUpStep === 2 && (
            <>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={inputBase}
                placeholder="Phone number"
                required
              />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputBase}
                placeholder="Business address"
                required
              />
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputBase}
                placeholder="Company name"
                required
              />
            </>
          )}

          {state === "Login" && (
            <>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
                type="email"
                placeholder="Email address"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputBase}
                type="password"
                placeholder="Password"
                required
              />
            </>
          )}

          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="text-xs text-gray-400 cursor-pointer hover:text-white"
            >
              Forgot password?
            </p>
          )}

          <div className="flex gap-3 pt-2">
            {state === "Sign Up" && signUpStep === 2 && (
              <button
                type="button"
                onClick={() => setSignUpStep(1)}
                className="w-full rounded-lg border border-white/10 py-3 text-sm text-gray-300 hover:text-white transition"
              >
                Back
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-black hover:bg-cyan-400 transition disabled:opacity-60"
            >
              {loading
                ? "Processing..."
                : state === "Sign Up"
                  ? signUpStep === 1
                    ? "Continue"
                    : "Create account"
                  : "Login"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          {state === "Sign Up"
            ? "Already have an account?"
            : "Don’t have an account?"}{" "}
          <span
            onClick={() => {
              setState(state === "Sign Up" ? "Login" : "Sign Up");
              setSignUpStep(1);
            }}
            className="cursor-pointer text-cyan-400 hover:underline"
          >
            {state === "Sign Up" ? "Login" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
