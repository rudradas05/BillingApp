import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import {
  RiDashboardLine,
  RiBillLine,
  RiAddBoxLine,
  RiStackLine,
  RiLogoutCircleRLine,
} from "react-icons/ri";

const Navbar = () => {
  const { token, setToken, setIsLoggedin } = useContext(AppContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: <RiDashboardLine className="w-5 h-5" /> },
    {
      name: "All Bills",
      path: "/all-bills",
      icon: <RiBillLine className="w-5 h-5" />,
    },
    {
      name: "New Bill",
      path: "/billing",
      icon: <RiAddBoxLine className="w-5 h-5" />,
    },
    {
      name: "Add Items",
      path: "/add-items",
      icon: <RiAddBoxLine className="w-5 h-5" />,
    },
    {
      name: "Inventory",
      path: "/all-items",
      icon: <RiStackLine className="w-5 h-5" />,
    },
  ];

  const logout = () => {
    try {
      setToken("");
      localStorage.removeItem("token");
      setIsLoggedin(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="flex  bg-gray-900 border-b border-gray-800 z-50  w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 cursor-pointer group"
            role="button"
            aria-label="Navigate to Home"
          >
            <span className="text-2xl font-bold text-indigo-400">
              BillMaster
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map(({ name, path, icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200
                  ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                {icon}
                <span>{name}</span>
              </NavLink>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-indigo-600 px-6 py-2 rounded-md 
                         hover:bg-indigo-700 transition-colors text-white"
              >
                <RiLogoutCircleRLine className="text-lg" />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-indigo-600 px-6 py-2 rounded-md 
                         hover:bg-indigo-700 transition-colors text-white"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-900">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <span className="text-2xl font-bold text-indigo-400">
                BillMaster
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white"
                aria-label="Close menu"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col p-4 space-y-2">
              {navItems.map(({ name, path, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 px-4 py-3 rounded-md
                    ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  {icon}
                  <span className="text-lg">{name}</span>
                </NavLink>
              ))}

              <div className="mt-4 p-4 border-t border-gray-800">
                {token ? (
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center space-x-2 
                             bg-indigo-600 px-6 py-3 rounded-md 
                             hover:bg-indigo-700 transition-colors text-white"
                  >
                    <RiLogoutCircleRLine className="text-lg" />
                    <span>Log Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-indigo-600 px-6 py-3 rounded-md 
                             hover:bg-indigo-700 transition-colors text-white"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
