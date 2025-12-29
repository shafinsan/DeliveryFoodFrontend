import React, { useState, useMemo } from "react";
import ReactPaginate from "react-paginate";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Icons
import {
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUtensils,
} from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";

// APIs & Utilities
import { AllProduct } from "../../../Api/ProductAPi";
import Lodding from "../../../UtilityFolder/Lodding";
import Error from "../../../UtilityFolder/Error";

function ProductDashbord() {
  const BASE_URL = "/api";
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputSearch, setInputSearch] = useState("");
  const itemsPerPage = 8; // Professional dashboards usually show 8-10 items

  const { data, isError, isLoading } = useQuery({
    queryKey: ["getAllProduct"],
    queryFn: () => AllProduct(),
  });

  // 1. Professional Filtering & Pagination Engine (useMemo)
  const { filteredResults, paginatedData, pageCount } = useMemo(() => {
    if (!data) return { filteredResults: [], paginatedData: [], pageCount: 0 };

    const filtered = data.filter((product) => {
      const search = inputSearch.toLowerCase();
      return (
        product.name?.toLowerCase().includes(search) ||
        product.foodCategoryName?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search)
      );
    });

    const sliced = filtered.slice(
      currentIndex * itemsPerPage,
      (currentIndex + 1) * itemsPerPage
    );

    return {
      filteredResults: filtered,
      paginatedData: sliced,
      pageCount: Math.ceil(filtered.length / itemsPerPage),
    };
  }, [data, inputSearch, currentIndex]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Lodding />
      </div>
    );
  if (isError) return <Error />;

  const handlePage = (data) => {
    setCurrentIndex(data.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center"
    >
      <div className="w-full max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FaUtensils className="text-blue-600" /> Menu Management
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Manage your dishes, pricing, and availability
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-80 group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                value={inputSearch}
                onChange={(e) => {
                  setInputSearch(e.target.value);
                  setCurrentIndex(0);
                }}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm shadow-sm"
                placeholder="Search products..."
              />
            </div>
            <button
              onClick={() => navigate("/CreateProduct")}
              className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Desktop Table (Hidden on Mobile) */}
        <div className="hidden lg:block overflow-hidden bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.imagePath
                            ? `${BASE_URL}/${item.imagePath}`
                            : "http://via.placeholder.com/100"
                        }
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                        alt={item.name}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">
                          {item.name}
                        </span>
                        <span
                          className="text-xs text-slate-400 line-clamp-1 max-w-xs"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                      {item.foodCategoryName}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-blue-600">
                    ${item.price}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate("/UpdateProduct", { state: { id: item.id } })
                        }
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() =>
                          navigate("/deleteProduct", { state: { id: item.id } })
                        }
                        className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout (Visible only on Mobile) */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {paginatedData.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={item.id}
                className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-4"
              >
                <div className="flex gap-4">
                  <img
                    src={
                      item.imagePath
                        ? `/external-assets/${item.imagePath}` // কোনো http থাকবে না, শুধু প্রক্সি পাথ
                        : "https://via.placeholder.com/100"
                    }
                    className="w-20 h-20 rounded-2xl object-cover shadow-md"
                    alt={item.name}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-xs text-blue-600 font-black">
                      ${item.price}
                    </p>
                    <span className="inline-block mt-2 bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase">
                      {item.foodCategoryName}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() =>
                      navigate("/UpdateProduct", { state: { id: item.id } })
                    }
                    className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() =>
                      navigate("/deleteProduct", { state: { id: item.id } })
                    }
                    className="flex-1 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-black flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredResults.length === 0 && (
          <div className="py-20 flex flex-col items-center opacity-40">
            <FaSearch size={40} className="mb-4" />
            <p className="text-lg font-bold">No products matched your search</p>
          </div>
        )}

        {/* Pagination Section */}
        <div className="flex justify-center pt-8">
          <ReactPaginate
            breakLabel="..."
            nextLabel={<FaAngleRight />}
            previousLabel={<FaAngleLeft />}
            pageCount={pageCount}
            onPageChange={handlePage}
            containerClassName="flex items-center gap-2"
            pageClassName="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-sm font-bold hover:bg-blue-50 transition-all"
            activeClassName="!bg-blue-600 !text-white !border-blue-600 shadow-lg shadow-blue-200"
            previousClassName="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50"
            nextClassName="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50"
            disabledClassName="opacity-30 cursor-not-allowed"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default ProductDashbord;
