import React, { useState, useMemo } from "react";
import ReactPaginate from "react-paginate";
import {
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// APIs & Utilities
import { getAllCategory } from "../../../Api/CategoryApi";
import Lodding from "../../../UtilityFolder/Lodding";

function Category() {
  const navigate = useNavigate();
  const [inputSearch, setInputSearch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 8;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: getAllCategory,
  });

  // 1. Memoized Filtering & Pagination logic
  const { paginatedData, pageCount } = useMemo(() => {
    if (!data) return { paginatedData: [], pageCount: 0 };

    const filtered = data.filter((cat) =>
      cat.name.toLowerCase().includes(inputSearch.toLowerCase())
    );

    const count = Math.ceil(filtered.length / itemsPerPage);
    const sliced = filtered.slice(
      currentIndex * itemsPerPage,
      currentIndex * itemsPerPage + itemsPerPage
    );

    return { paginatedData: sliced, pageCount: count };
  }, [data, inputSearch, currentIndex]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Lodding />
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        Failed to load categories.
      </div>
    );

  const handleAction = (type, id) => {
    const route = type === "edit" ? "/UpdateCategory" : "/DeleteCategory";
    navigate(route, { state: { id } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 max-w-7xl mx-auto w-full"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Food Categories
          </h1>
          <p className="text-sm text-gray-500">
            Manage your menu categories and linked items.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          {/* Professional Search Bar */}
          <div className="relative group flex-1 sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              value={inputSearch}
              onChange={(e) => {
                setInputSearch(e.target.value);
                setCurrentIndex(0);
              }}
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <button
            onClick={() => navigate("/CreateCategory")}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FaPlus size={14} /> Create New
          </button>
        </div>
      </div>

      {/* Desktop Table (Hidden on Mobile) */}
      <div className="hidden lg:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">
                Category Details
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider text-center">
                Items Count
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedData.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        cat?.imagePath
                          ? `http://ejfoodieordernow.runasp.net/${cat.imagePath}`
                          : "https://via.placeholder.com/150"
                      }
                      className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                      alt={cat.name}
                    />
                    <span className="font-bold text-gray-800">{cat.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                    {cat.foods?.length || 0} Foods
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleAction("edit", cat.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleAction("delete", cat.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout (Visible on Mobile) */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {paginatedData.map((cat) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={cat.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    cat?.imagePath
                      ? `http://ejfoodieordernow.runasp.net/${cat.imagePath}`
                      : "https://via.placeholder.com/150"
                  }
                  className="w-14 h-14 rounded-2xl object-cover"
                  alt={cat.name}
                />
                <div>
                  <h3 className="font-black text-gray-900">{cat.name}</h3>
                  <p className="text-xs text-gray-400">
                    {cat.foods?.length || 0} Linked Items
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleAction("edit", cat.id)}
                  className="p-3 bg-blue-50 text-blue-600 rounded-xl"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleAction("delete", cat.id)}
                  className="p-3 bg-red-50 text-red-600 rounded-xl"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Section */}
      {pageCount > 1 && (
        <div className="mt-10 flex justify-center">
          <ReactPaginate
            breakLabel="..."
            nextLabel={<FaAngleRight />}
            previousLabel={<FaAngleLeft />}
            pageCount={pageCount}
            onPageChange={(data) => {
              setCurrentIndex(data.selected);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            containerClassName="flex gap-2 items-center"
            pageClassName="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-sm font-bold hover:bg-blue-50 transition-all"
            activeClassName="!bg-blue-600 !text-white !border-blue-600 shadow-lg shadow-blue-100"
            previousClassName="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 bg-white hover:bg-gray-50"
            nextClassName="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 bg-white hover:bg-gray-50"
            disabledClassName="opacity-30 cursor-not-allowed"
          />
        </div>
      )}

      {/* Empty State */}
      {paginatedData.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-400 font-medium">
            No categories match your search.
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default Category;
