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
  RiUserLine,
} from "react-icons/ri";

const Navbar = () => {
  const { token, setToken, setIsLoggedin } = useContext(AppContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/", icon: <RiDashboardLine className="w-5 h-5" /> },
    { name: "Bills", path: "/all-bills", icon: <RiBillLine className="w-5 h-5" /> },
    { name: "New Bill", path: "/billing", icon: <RiAddBoxLine className="w-5 h-5" /> },
    { name: "Items", path: "/add-items", icon: <RiAddBoxLine className="w-5 h-5" /> },
    { name: "Inventory", path: "/all-items", icon: <RiStackLine className="w-5 h-5" /> },
  ];

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setIsLoggedin(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const linkBase =
    "relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0b0f1a] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer select-none"
          >
            <span className="text-lg font-semibold tracking-tight text-white">
              Invoice<span className="text-cyan-400">Master</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.icon}
                    {item.name}
                    {isActive && (
                      <span className="absolute left-3 right-3 -bottom-2 h-[2px] bg-cyan-400 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <div className="mx-2 h-5 w-px bg-white/10" />

            {/* WHEN LOGGED IN */}
            {token ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `${linkBase} ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <RiUserLine className="w-5 h-5" />
                      Profile
                      {isActive && (
                        <span className="absolute left-3 right-3 -bottom-2 h-[2px] bg-cyan-400 rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>

                <button
                  onClick={logout}
                  className="ml-2 flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400 transition"
                >
                  <RiLogoutCircleRLine className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              /* WHEN NOT LOGGED IN */
              <button
                onClick={() => navigate("/login")}
                className="ml-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-400 transition"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white transition"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 rounded-xl bg-[#0f1424] border border-white/10 p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}

            {token ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <RiUserLine className="w-5 h-5" />
                  Profile
                </NavLink>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-red-400 transition"
                >
                  <RiLogoutCircleRLine className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full mt-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-400 transition"
              >
                Get Started
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
