import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { token, setToken, setIsLoggedin } = useContext(AppContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
    setIsLoggedin(false);
  };
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 sticky top-0 bg-white z-50">
      <img
        className="w-44 cursor-pointer"
        onClick={() => navigate("/")}
        src=""
        alt="Logo"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className=" text-xl py-1 scroll-smooth">Home</li>
          <hr className="border-none outline-node h-0.5 bg-primary w-5/6 m-auto hidden" />
        </NavLink>
        <NavLink to="/all-bills">
          <li className=" text-xl py-1 scroll-smooth">All Bills</li>
          <hr className="border-none outline-node h-0.5 bg-primary w-5/6 m-auto hidden" />
        </NavLink>
        <NavLink to="billing">
          <li className="text-xl py-1 scroll-smooth">New Billing</li>
          <hr className="border-none outline-node h-0.5 bg-primary w-5/6 m-auto hidden" />
        </NavLink>
        <NavLink to="/add-items">
          <li className=" text-xl py-1 scroll-smooth">Add Items</li>
          <hr className="border-none outline-node h-0.5 bg-primary w-5/6 m-auto hidden" />
        </NavLink>
        <NavLink to="/all-items">
          <li className=" text-xl py-1 scroll-smooth">All Items</li>
          <hr className="border-none outline-node h-0.5 bg-primary w-5/6 m-auto hidden" />
        </NavLink>
      </ul>
      <div>
        {token ? (
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
          >
            Log Out
          </button>
        ) : (
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
          >
            Create Account
          </button>
        )}
        <CiMenuBurger
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
        />
        <div
          className={`${
            showMenu ? "fixed w-full h-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-38" src="" alt="Logo" />
            <IoCloseCircleOutline
              onClick={() => setShowMenu(false)}
              className="text-4xl cursor-pointer"
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink to="/" onClick={() => setShowMenu(false)}>
              <li className="text-xl py-1 scroll-smooth">Home</li>
            </NavLink>
            <NavLink to="/all-bills" onClick={() => setShowMenu(false)}>
              <li className="text-xl py-1 scroll-smooth">All Bills</li>
            </NavLink>
            <NavLink to="billing" onClick={() => setShowMenu(false)}>
              <li className="text-xl py-1 scroll-smooth">New Billing</li>
            </NavLink>
            <NavLink to="/add-items" onClick={() => setShowMenu(false)}>
              <li className="text-xl py-1 scroll-smooth">Add Items</li>
            </NavLink>
            <NavLink to="/all-items" onClick={() => setShowMenu(false)}>
              <li className="text-xl py-1 scroll-smooth">All Items</li>
            </NavLink>
            <div className="mt-4">
              {token ? (
                <button
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="bg-primary text-white px-6 py-2 rounded-full font-light transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
                >
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setShowMenu(false);
                  }}
                  className="bg-primary text-white px-6 py-2 rounded-full font-light transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
                >
                  Create Account
                </button>
              )}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
