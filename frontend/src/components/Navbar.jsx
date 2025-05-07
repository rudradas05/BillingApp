// // // import React, { useContext, useState } from "react";
// // // import { NavLink, useNavigate } from "react-router-dom";
// // // import { CiMenuBurger } from "react-icons/ci";
// // // import { IoCloseCircleOutline } from "react-icons/io5";
// // // import { AppContext } from "../context/AppContext";

// // // const Navbar = () => {
// // //   const { token, setToken, setIsLoggedin } = useContext(AppContext);
// // //   const navigate = useNavigate();
// // //   const [showMenu, setShowMenu] = useState(false);

// // //   const logout = () => {
// // //     setToken("");
// // //     localStorage.removeItem("token");
// // //     navigate("/");
// // //     setIsLoggedin(false);
// // //   };
// // //   return (
// // //     <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 sticky top-0 bg-white z-50">
// // //       <img
// // //         className="w-44 cursor-pointer"
// // //         onClick={() => navigate("/")}
// // //         src=""
// // //         alt="Logo"
// // //       />
// // //       <ul className="hidden md:flex items-start gap-5 font-medium">
// // //         <NavLink to="/">
// // //           <li className=" text-xl py-1 scroll-smooth">Home</li>
// // //           <hr className="border-none outline-node h-0.5 bg-primary w-5/6 m-auto hidden" />
// // //         </NavLink>
// // //         <NavLink to="/all-bills">
// // //           <li className=" text-xl py-1 scroll-smooth">All Bills</li>
// // //           <hr className="border-none outline-node h-0.5 bg-primary w-5/6 m-auto hidden" />
// // //         </NavLink>
// // //         <NavLink to="billing">
// // //           <li className="text-xl py-1 scroll-smooth">New Billing</li>
// // //           <hr className="border-none outline-node h-0.5 bg-primary w-5/6 m-auto hidden" />
// // //         </NavLink>
// // //         <NavLink to="/add-items">
// // //           <li className=" text-xl py-1 scroll-smooth">Add Items</li>
// // //           <hr className="border-none outline-node h-0.5 bg-primary w-5/6 m-auto hidden" />
// // //         </NavLink>
// // //         <NavLink to="/all-items">
// // //           <li className=" text-xl py-1 scroll-smooth">All Items</li>
// // //           <hr className="border-none outline-node h-0.5 bg-primary w-5/6 m-auto hidden" />
// // //         </NavLink>
// // //       </ul>
// // //       <div>
// // //         {token ? (
// // //           <button
// // //             onClick={() => {
// // //               logout();
// // //               navigate("/");
// // //             }}
// // //             className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
// // //           >
// // //             Log Out
// // //           </button>
// // //         ) : (
// // //           <button
// // //             onClick={() => {
// // //               navigate("/login");
// // //             }}
// // //             className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
// // //           >
// // //             Create Account
// // //           </button>
// // //         )}
// // //         <CiMenuBurger
// // //           onClick={() => setShowMenu(true)}
// // //           className="w-6 md:hidden cursor-pointer"
// // //         />
// // //         <div
// // //           className={`${
// // //             showMenu ? "fixed w-full h-full" : "h-0 w-0"
// // //           } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
// // //         >
// // //           <div className="flex items-center justify-between px-5 py-6">
// // //             <img className="w-38" src="" alt="Logo" />
// // //             <IoCloseCircleOutline
// // //               onClick={() => setShowMenu(false)}
// // //               className="text-4xl cursor-pointer"
// // //             />
// // //           </div>
// // //           <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
// // //             <NavLink to="/" onClick={() => setShowMenu(false)}>
// // //               <li className="text-xl py-1 scroll-smooth">Home</li>
// // //             </NavLink>
// // //             <NavLink to="/all-bills" onClick={() => setShowMenu(false)}>
// // //               <li className="text-xl py-1 scroll-smooth">All Bills</li>
// // //             </NavLink>
// // //             <NavLink to="billing" onClick={() => setShowMenu(false)}>
// // //               <li className="text-xl py-1 scroll-smooth">New Billing</li>
// // //             </NavLink>
// // //             <NavLink to="/add-items" onClick={() => setShowMenu(false)}>
// // //               <li className="text-xl py-1 scroll-smooth">Add Items</li>
// // //             </NavLink>
// // //             <NavLink to="/all-items" onClick={() => setShowMenu(false)}>
// // //               <li className="text-xl py-1 scroll-smooth">All Items</li>
// // //             </NavLink>
// // //             <div className="mt-4">
// // //               {token ? (
// // //                 <button
// // //                   onClick={() => {
// // //                     logout();
// // //                     setShowMenu(false);
// // //                   }}
// // //                   className="bg-primary text-white px-6 py-2 rounded-full font-light transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
// // //                 >
// // //                   Log Out
// // //                 </button>
// // //               ) : (
// // //                 <button
// // //                   onClick={() => {
// // //                     navigate("/login");
// // //                     setShowMenu(false);
// // //                   }}
// // //                   className="bg-primary text-white px-6 py-2 rounded-full font-light transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
// // //                 >
// // //                   Create Account
// // //                 </button>
// // //               )}
// // //             </div>
// // //           </ul>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Navbar;

// // import React, { useContext, useState } from "react";
// // import { NavLink, useNavigate } from "react-router-dom";
// // import { FiMenu, FiX } from "react-icons/fi";
// // import { AppContext } from "../context/AppContext";
// // import {
// //   RiDashboardLine,
// //   RiBillLine,
// //   RiAddBoxLine,
// //   RiStackLine,
// //   RiLogoutCircleRLine,
// // } from "react-icons/ri";

// // const Navbar = () => {
// //   const { token, setToken, setIsLoggedin } = useContext(AppContext);
// //   const navigate = useNavigate();
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);

// //   const navItems = [
// //     { name: "Home", path: "/", icon: <RiDashboardLine className="nav-icon" /> },
// //     {
// //       name: "All Bills",
// //       path: "/all-bills",
// //       icon: <RiBillLine className="nav-icon" />,
// //     },
// //     {
// //       name: "New Bill",
// //       path: "/billing",
// //       icon: <RiAddBoxLine className="nav-icon" />,
// //     },
// //     {
// //       name: "Add Items",
// //       path: "/add-items",
// //       icon: <RiAddBoxLine className="nav-icon" />,
// //     },
// //     {
// //       name: "Inventory",
// //       path: "/all-items",
// //       icon: <RiStackLine className="nav-icon" />,
// //     },
// //   ];

// //   const logout = () => {
// //     setToken("");
// //     localStorage.removeItem("token");
// //     setIsLoggedin(false);
// //     navigate("/");
// //     setIsMenuOpen(false);
// //   };

// //   return (
// //     <nav className="flex backdrop-blur-lg bg-white/5 border-b border-white/10 z-50">
// //       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex items-center justify-between h-16">
// //           {/* Logo */}
// //           <div
// //             onClick={() => navigate("/")}
// //             className="flex items-center space-x-2 cursor-pointer group"
// //           >
// //             <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
// //               BillMaster
// //             </span>
// //           </div>

// //           {/* Desktop Navigation */}
// //           <div className="hidden md:flex items-center space-x-8">
// //             {navItems.map((item) => (
// //               <NavLink
// //                 key={item.path}
// //                 to={item.path}
// //                 className={({ isActive }) =>
// //                   `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all
// //                   ${
// //                     isActive
// //                       ? "bg-indigo-500/20 text-indigo-400"
// //                       : "hover:bg-white/5 text-gray-400 hover:text-gray-200"
// //                   }`
// //                 }
// //               >
// //                 {item.icon}
// //                 <span className="font-medium">{item.name}</span>
// //               </NavLink>
// //             ))}
// //           </div>

// //           {/* Auth Section */}
// //           <div className="hidden md:flex items-center space-x-4">
// //             {token ? (
// //               <button
// //                 onClick={logout}
// //                 className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-2 rounded-full
// //                          hover:from-indigo-600 hover:to-cyan-600 transition-all"
// //               >
// //                 <RiLogoutCircleRLine className="text-lg" />
// //                 <span>Log Out</span>
// //               </button>
// //             ) : (
// //               <button
// //                 onClick={() => navigate("/login")}
// //                 className="bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-2 rounded-full
// //                          hover:from-indigo-600 hover:to-cyan-600 transition-all"
// //               >
// //                 Get Started
// //               </button>
// //             )}
// //           </div>

// //           {/* Mobile Menu Button */}
// //           <button
// //             onClick={() => setIsMenuOpen(!isMenuOpen)}
// //             className="md:hidden p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
// //           >
// //             <FiMenu className="w-6 h-6" />
// //           </button>
// //         </div>
// //       </div>

// //       {/* Mobile Menu Overlay */}
// //       <div className={`md:hidden fixed inset-0 z-50 bg-gray-900 `}>
// //         <div className="flex flex-col h-full">
// //           <div className="flex justify-between items-center p-6 border-b border-white/10">
// //             <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
// //               BillMaster
// //             </span>
// //             <button
// //               onClick={() => setIsMenuOpen(false)}
// //               className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
// //             >
// //               <FiX className="w-6 h-6" />
// //             </button>
// //           </div>

// //           <div className="flex-1 flex flex-col items-center pt-8 space-y-6">
// //             {navItems.map((item) => (
// //               <NavLink
// //                 key={item.path}
// //                 to={item.path}
// //                 onClick={() => setIsMenuOpen(false)}
// //                 className={({ isActive }) =>
// //                   `flex items-center space-x-3 px-6 py-3 rounded-full w-4/5
// //                   ${
// //                     isActive
// //                       ? "bg-indigo-500/20 text-indigo-400"
// //                       : "hover:bg-white/10 text-gray-400 hover:text-white"
// //                   }`
// //                 }
// //               >
// //                 {item.icon}
// //                 <span className="text-lg font-medium">{item.name}</span>
// //               </NavLink>
// //             ))}

// //             <div className="mt-8 w-4/5">
// //               {token ? (
// //                 <button
// //                   onClick={logout}
// //                   className="w-full flex items-center justify-center space-x-2
// //                            bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 rounded-full
// //                            hover:from-indigo-600 hover:to-cyan-600 transition-all"
// //                 >
// //                   <RiLogoutCircleRLine className="text-lg" />
// //                   <span>Log Out</span>
// //                 </button>
// //               ) : (
// //                 <button
// //                   onClick={() => {
// //                     navigate("/login");
// //                     setIsMenuOpen(false);
// //                   }}
// //                   className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 rounded-full
// //                            hover:from-indigo-600 hover:to-cyan-600 transition-all"
// //                 >
// //                   Get Started
// //                 </button>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;

// import React, { useContext, useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { FiMenu, FiX } from "react-icons/fi";
// import { AppContext } from "../context/AppContext";
// import {
//   RiDashboardLine,
//   RiBillLine,
//   RiAddBoxLine,
//   RiStackLine,
//   RiLogoutCircleRLine,
// } from "react-icons/ri";

// const Navbar = () => {
//   const { token, setToken, setIsLoggedin } = useContext(AppContext);
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const navItems = [
//     { name: "Home", path: "/", icon: <RiDashboardLine className="nav-icon" /> },
//     {
//       name: "All Bills",
//       path: "/all-bills",
//       icon: <RiBillLine className="nav-icon" />,
//     },
//     {
//       name: "New Bill",
//       path: "/billing",
//       icon: <RiAddBoxLine className="nav-icon" />,
//     },
//     {
//       name: "Add Items",
//       path: "/add-items",
//       icon: <RiAddBoxLine className="nav-icon" />,
//     },
//     {
//       name: "Inventory",
//       path: "/all-items",
//       icon: <RiStackLine className="nav-icon" />,
//     },
//   ];

//   const logout = () => {
//     try {
//       setToken("");
//       localStorage.removeItem("token");
//       setIsLoggedin(false);
//       navigate("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     } finally {
//       setIsMenuOpen(false);
//     }
//   };

//   return (
//     <nav className="flex backdrop-blur-lg bg-white/5 border-b border-white/10 z-50">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div
//             onClick={() => navigate("/")}
//             className="flex items-center space-x-2 cursor-pointer group"
//             role="button"
//             aria-label="Navigate to Home"
//           >
//             <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
//               BillMaster
//             </span>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navItems.map(({ name, path, icon }) => (
//               <NavLink
//                 key={path}
//                 to={path}
//                 className={({ isActive }) =>
//                   `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all
//                   ${
//                     isActive
//                       ? "bg-indigo-500/20 text-indigo-400"
//                       : "hover:bg-white/5 text-gray-400 hover:text-gray-200"
//                   }`
//                 }
//               >
//                 {icon}
//                 <span className="font-medium">{name}</span>
//               </NavLink>
//             ))}
//           </div>

//           {/* Auth Section */}
//           <div className="hidden md:flex items-center space-x-4">
//             {token ? (
//               <button
//                 onClick={logout}
//                 className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-2 rounded-full
//                          hover:from-indigo-600 hover:to-cyan-600 transition-all"
//               >
//                 <RiLogoutCircleRLine className="text-lg" />
//                 <span>Log Out</span>
//               </button>
//             ) : (
//               <button
//                 onClick={() => navigate("/login")}
//                 className="bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-2 rounded-full
//                          hover:from-indigo-600 hover:to-cyan-600 transition-all"
//               >
//                 Get Started
//               </button>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
//             aria-label="Toggle menu"
//           >
//             {isMenuOpen ? (
//               <FiX className="w-6 h-6" />
//             ) : (
//               <FiMenu className="w-6 h-6" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu Overlay */}
//       {isMenuOpen && (
//         <div className="md:hidden relative w-full inset-0 z-50 bg-gray-900 backdrop-blur-sm transition-opacity">
//           <div className=" h-full w-full">
//             <div className="flex justify-between items-center p-6 border-b border-white/10">
//               <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
//                 BillMaster
//               </span>
//               <button
//                 onClick={() => setIsMenuOpen(false)}
//                 className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
//                 aria-label="Close menu"
//               >
//                 <FiX className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="flex-1 flex flex-col items-center pt-8 space-y-6">
//               {navItems.map(({ name, path, icon }) => (
//                 <NavLink
//                   key={path}
//                   to={path}
//                   onClick={() => setIsMenuOpen(false)}
//                   className={({ isActive }) =>
//                     `flex items-center space-x-3 px-6 py-3 rounded-full w-4/5
//                     ${
//                       isActive
//                         ? "bg-indigo-500/20 text-indigo-400"
//                         : "hover:bg-white/10 text-gray-400 hover:text-white"
//                     }`
//                   }
//                 >
//                   {icon}
//                   <span className="text-lg font-medium">{name}</span>
//                 </NavLink>
//               ))}

//               <div className="mt-8 w-4/5">
//                 {token ? (
//                   <button
//                     onClick={logout}
//                     className="w-full flex items-center justify-center space-x-2
//                              bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 rounded-full
//                              hover:from-indigo-600 hover:to-cyan-600 transition-all"
//                   >
//                     <RiLogoutCircleRLine className="text-lg" />
//                     <span>Log Out</span>
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       navigate("/login");
//                       setIsMenuOpen(false);
//                     }}
//                     className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 rounded-full
//                              hover:from-indigo-600 hover:to-cyan-600 transition-all"
//                   >
//                     Get Started
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

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
