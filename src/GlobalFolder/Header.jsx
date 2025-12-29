import React, { useEffect, useState, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

// Icons
import { CiLogin, CiLogout, CiUser } from "react-icons/ci";
import {
  MdOutlineShoppingBag,
  MdFavoriteBorder,
  MdMenu,
  MdClose,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { RiDashboardLine } from "react-icons/ri";

// Stores & APIs
import { productStore } from "../Store/ProductStore";
import { CartStore } from "../Store/CartStore";
import { TokenDeconder } from "../UtilityFolder/TokenDecoder";
import { getCurrentUserOrderAPi } from "../Api/OrderApi";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // --- ফিক্সড: এই স্টেটটি যোগ করা হয়েছে ---
  const [isMobileDashboardOpen, setIsMobileDashboardOpen] = useState(false);

  const { token, role, profileImg } = useMemo(() => {
    const rawToken = localStorage.getItem("Token");
    return {
      token: rawToken ? JSON.parse(rawToken).token : null,
      role: localStorage.getItem("Role") || null,
      profileImg:
        localStorage.getItem("profile") ||
        "https://images.rawpixel.com/image_800/cHJpdmF0ZS9zdGF0aWMvaW1hZ2Uvd2Vic2l0ZS8yMDIyLTA0L2xyL2pvYjYwMi01OC5qcGc.jpg",
    };
  }, []);

  const { data: orderData } = useQuery({
    queryKey: ["getCurrentUserOrder"],
    queryFn: getCurrentUserOrderAPi,
    enabled: !!token,
    retry: 1, // এপিআই ফেইল করলে ১বার ট্রাই করবে
  });

  const { product: favorites } = productStore((state) => state);
  const { cart } = CartStore((state) => state);

  useEffect(() => {
    TokenDeconder();
    setIsMobileMenuOpen(false);
    setIsDashboardOpen(false);
    setIsMobileDashboardOpen(false); // পাথ চেঞ্জ হলে মোবাইল ড্রয়ারও বন্ধ হবে
  }, [location.pathname]);

  const handleLogOut = () => {
    const keys = ["Token", "Role", "Id", "Email", "profile"];
    keys.forEach((k) => localStorage.removeItem(k));
    toast.success("Logged out successfully");
    navigate("/");
    window.location.reload();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/Shop" },
  ];

  const dashboardLinks = {
    Admin: [
      { name: "Users", path: "/AllUser" },
      { name: "Category", path: "/CategoryDashbord" },
      { name: "Food Items", path: "/ProductDashbord" },
      { name: "All Orders", path: "/OrderUserDetails" },
    ],
    Employee: [{ name: "Delivery", path: "/Delivery" }],
  };

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* LEFT: LOGO */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              <MdMenu size={28} />
            </button>

            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-md shadow-blue-100">
                EJ
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tighter hidden xs:block">
                FOOD
              </span>
            </NavLink>
          </div>

          {/* CENTER: DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-50/50 p-1 rounded-2xl border border-gray-100">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "text-blue-600 bg-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {role && dashboardLinks[role] && (
              <div
                className="relative"
                onMouseEnter={() => setIsDashboardOpen(true)}
                onMouseLeave={() => setIsDashboardOpen(false)}
              >
                <button
                  className={`px-5 py-2 flex items-center gap-2 text-sm font-bold transition-colors ${
                    isDashboardOpen ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Dashboard <RiDashboardLine />
                </button>
                <AnimatePresence>
                  {isDashboardOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-[200]"
                    >
                      {dashboardLinks[role].map((link) => (
                        <NavLink
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsDashboardOpen(false)}
                          className="block px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                        >
                          {link.name}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* RIGHT: QUICK ACTIONS */}
          <div className="flex items-center gap-1 sm:gap-3">
            <HeaderIcon
              to="/Cart"
              icon={<MdOutlineShoppingBag size={24} />}
              count={cart?.length}
            />
            <HeaderIcon
              to="/Favorites"
              icon={<MdFavoriteBorder size={24} />}
              count={favorites?.length}
              className="hidden sm:flex"
            />
            <HeaderIcon
              to="/MyOrder"
              icon={<RiDashboardLine size={22} />}
              count={orderData?.data?.length || 0}
              className="hidden md:flex"
            />

            <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden lg:block" />

            {/* Laptop Auth */}
            <div className="hidden lg:flex items-center">
              {token ? (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar border border-gray-100 ring-2 ring-transparent hover:ring-blue-100 transition-all"
                  >
                    <div className="w-10 rounded-full">
                      <img src={profileImg} alt="Avatar" />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="mt-4 z-[200] p-2 shadow-2xl menu dropdown-content bg-white rounded-2xl w-60 border border-gray-100"
                  >
                    <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Account
                    </p>
                    <li>
                      <NavLink
                        to="/Profile"
                        className="py-3 font-bold text-gray-600"
                      >
                        <CiUser size={20} /> Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/MyOrder"
                        className="py-3 font-bold text-gray-600"
                      >
                        <RiDashboardLine size={20} /> My Orders
                      </NavLink>
                    </li>
                    <div className="h-[1px] bg-gray-100 my-1 mx-2" />
                    <li
                      onClick={handleLogOut}
                      className="text-red-500 font-black"
                    >
                      <span className="py-3">
                        <CiLogout size={20} /> Logout
                      </span>
                    </li>
                  </ul>
                </div>
              ) : (
                <NavLink
                  to="/Loggin"
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-md shadow-gray-200"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-white z-[9999] shadow-2xl flex flex-col lg:hidden overflow-hidden"
            >
              <div className="p-6 flex justify-between items-center bg-white border-b border-gray-50">
                <span className="font-black text-gray-900 text-xl italic tracking-tighter">
                  EJ FOOD
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-gray-100 rounded-full text-gray-600"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-white p-4 space-y-4">
                {token && (
                  <div className="p-4 bg-blue-50 rounded-2xl flex items-center gap-4">
                    <img
                      src={profileImg}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
                      alt="user"
                    />
                    <div className="min-w-0">
                      <p className="font-black text-gray-900 truncate text-sm">
                        {localStorage.getItem("Email")}
                      </p>
                      <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                        {role}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    Menu
                  </p>
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex justify-between items-center p-4 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-50 active:bg-blue-50 active:text-blue-600"
                    >
                      {link.name} <MdKeyboardArrowRight size={20} />
                    </NavLink>
                  ))}
                </div>

                {/* MOBILE DASHBOARD ACCORDION */}
                {role && dashboardLinks[role] && (
                  <div className="space-y-1 pt-2">
                    <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                      Management
                    </p>
                    <button
                      onClick={() =>
                        setIsMobileDashboardOpen(!isMobileDashboardOpen)
                      }
                      className={`flex justify-between items-center w-full p-4 text-sm font-bold rounded-xl transition-all ${
                        isMobileDashboardOpen
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RiDashboardLine size={22} /> Dashboard
                      </div>
                      <motion.div
                        animate={{ rotate: isMobileDashboardOpen ? 90 : 0 }}
                      >
                        <MdKeyboardArrowRight size={24} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isMobileDashboardOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-6 space-y-1"
                        >
                          {dashboardLinks[role].map((link) => (
                            <NavLink
                              key={link.path}
                              to={link.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 p-3 text-sm font-bold text-gray-500 hover:text-blue-600 rounded-xl"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />{" "}
                              {link.name}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="space-y-1 pt-2">
                  <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    Account
                  </p>
                  {token ? (
                    <>
                      <NavLink
                        to="/Profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-4 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-50"
                      >
                        <CiUser size={22} className="text-gray-400" /> My
                        Profile
                      </NavLink>
                      <NavLink
                        to="/MyOrder"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-4 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-50"
                      >
                        <RiDashboardLine size={22} className="text-gray-400" />{" "}
                        My Orders
                      </NavLink>
                      <button
                        onClick={handleLogOut}
                        className="flex items-center gap-3 w-full p-4 text-sm font-bold text-red-500 rounded-xl hover:bg-red-50 text-left transition-colors"
                      >
                        <CiLogout size={22} /> Logout
                      </button>
                    </>
                  ) : (
                    <NavLink
                      to="/Loggin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-4 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl"
                    >
                      <CiLogin size={22} /> Sign In
                    </NavLink>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HeaderIcon = ({ to, icon, count, className = "" }) => (
  <NavLink
    to={to}
    className={`${className} relative p-2 text-gray-500 hover:text-blue-600 rounded-xl active:scale-90 transition-all`}
  >
    {icon}
    {count > 0 && (
      <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
        {count}
      </span>
    )}
  </NavLink>
);

export default Header;
