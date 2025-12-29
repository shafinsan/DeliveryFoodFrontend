import React, { useState, useMemo } from "react";
import ReactPaginate from "react-paginate";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Icons
import {
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaUserPlus,
  FaLock,
  FaLockOpen,
  FaUserTag,
  FaTimes,
} from "react-icons/fa";
import { MdChangeCircle } from "react-icons/md";

// APIs & Utilities
import {
  getAllRole,
  getAllUserAdmin,
  LockedUser,
  UnlockedUser,
  UserUpdateRole,
} from "../../../Api/AdminUserApi";
import Lodding from "../../../UtilityFolder/Lodding";

function User() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputSearch, setInputSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRoleId, setNewRoleId] = useState("");
  const itemsPerPage = 10;

  // 1. Data Fetching
  const {
    data: usersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getAllUser"],
    queryFn: getAllUserAdmin,
  });

  const { data: rolesData } = useQuery({
    queryKey: ["getAllRole"],
    queryFn: getAllRole,
  });

  // 2. Professional Filter Engine
  const { paginatedData, pageCount } = useMemo(() => {
    if (!usersData?.data) return { paginatedData: [], pageCount: 0 };

    const filtered = usersData.data.filter((u) => {
      const search = inputSearch.toLowerCase();
      return (
        u.email?.toLowerCase().includes(search) ||
        u.firstName?.toLowerCase().includes(search) ||
        u.lastName?.toLowerCase().includes(search)
      );
    });

    return {
      pageCount: Math.ceil(filtered.length / itemsPerPage),
      paginatedData: filtered.slice(
        currentIndex * itemsPerPage,
        (currentIndex + 1) * itemsPerPage
      ),
    };
  }, [usersData, inputSearch, currentIndex]);

  // 3. Mutations
  const lockMutation = useMutation({
    mutationFn: (payload) =>
      payload.isLocked ? UnlockedUser(payload) : LockedUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["getAllUser"]);
      toast.success("Security status updated");
    },
  });

  const roleMutation = useMutation({
    mutationFn: UserUpdateRole,
    onSuccess: () => {
      queryClient.invalidateQueries(["getAllUser"]);
      toast.success("User role updated");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Action Restricted"),
  });

  if (isLoading) return <Lodding />;
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        Error loading users.
      </div>
    );

  const toggleLock = (user) => {
    if (user.role === "Admin")
      return toast.warning("Cannot lock primary Administrator");
    lockMutation.mutate({
      id: user.id,
      email: user.email,
      isLocked: user.lockCheck,
    });
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRoleId(user.roleId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              User Directory
            </h1>
            <p className="text-sm text-slate-500">
              Managing {usersData?.data?.length || 0} total accounts
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-72 group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                value={inputSearch}
                onChange={(e) => {
                  setInputSearch(e.target.value);
                  setCurrentIndex(0);
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                placeholder="Search email or name..."
              />
            </div>
            <button
              onClick={() => navigate("/Resgister", { state: { value: true } })}
              className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <FaUserPlus />
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-hidden bg-white border border-slate-100 rounded-3xl shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Access Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.profilePic
                            ? `http://ejfoodieordernow.runasp.net/${user.profilePic}`
                            : "https://img.daisyui.com/images/profile/demo/2@94.webp"
                        }
                        className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
                        alt="Profile"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {user.phone || "No Phone"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-700 border-purple-200"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => toggleLock(user)}
                      className={`p-2 rounded-xl transition-all ${
                        user.lockCheck
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      } hover:scale-110`}
                    >
                      {user.lockCheck ? <FaLock /> : <FaLockOpen />}
                    </button>
                    <button
                      onClick={() => openRoleModal(user)}
                      className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <FaUserTag />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout (Vertical Stack) */}
        <div className="lg:hidden space-y-4">
          {paginatedData.map((user) => (
            <div
              key={user.id}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.profilePic
                        ? `http://ejfoodieordernow.runasp.net/${user.profilePic}`
                        : "https://via.placeholder.com/100"
                    }
                    className="w-12 h-12 rounded-2xl object-cover"
                    alt="User"
                  />
                  <div>
                    <h3 className="font-bold text-slate-800">
                      {user.firstName}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      {user.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleLock(user)}
                    className={`p-3 rounded-2xl ${
                      user.lockCheck
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {user.lockCheck ? <FaLock /> : <FaLockOpen />}
                  </button>
                  <button
                    onClick={() => openRoleModal(user)}
                    className="p-3 bg-slate-100 text-slate-600 rounded-2xl"
                  >
                    <FaUserTag />
                  </button>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-50 text-xs text-slate-500 space-y-1">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Pagination */}
        <div className="flex justify-center pt-8">
          <ReactPaginate
            breakLabel="..."
            nextLabel={<FaAngleRight />}
            previousLabel={<FaAngleLeft />}
            pageCount={pageCount}
            onPageChange={(d) => {
              setCurrentIndex(d.selected);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            containerClassName="flex items-center gap-2"
            pageClassName="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-sm font-bold hover:bg-blue-50 transition-all"
            activeClassName="!bg-blue-600 !text-white !border-blue-600 shadow-lg shadow-blue-200"
            previousClassName="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200"
            nextClassName="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200"
          />
        </div>
      </div>

      {/* Modern Role Update Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-900">
                  Modify Access
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Target Account
                  </p>
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {selectedUser?.email}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Assign New Role
                  </label>
                  <select
                    value={newRoleId}
                    onChange={(e) => setNewRoleId(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-800"
                  >
                    {rolesData?.data?.map((r) => (
                      <option key={r.roleId} value={r.roleId}>
                        {r.roleName}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() =>
                    roleMutation.mutate({ userId: selectedUser.id, newRoleId })
                  }
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  Update Permissions
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default User;
