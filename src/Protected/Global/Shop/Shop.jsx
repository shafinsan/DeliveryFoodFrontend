import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

// Components
import Card from "./Card/Card";
import Filter from "./Filter/Filter";
import Pagination from "./Pagination/Pagination";
import Lodding from "../../../UtilityFolder/Lodding";
import Error from "../../../UtilityFolder/Error";

// Data & Store
import { Food } from "../../../Api/FoodApi";
import { productStore } from "../../../Store/ProductStore";

function Shop() {
  // 1. ALL HOOKS MUST GO AT THE TOP
  const { product } = productStore((state) => state);
  const [paginatedData, setPaginatedData] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(null);
  const [timeRange, setTimeRange] = useState(null);
  const [category, setCategory] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["food"],
    queryFn: () => Food(),
  });

  // Calculate stats even if data is loading to keep hook order consistent
  const stats = useMemo(() => {
    // FIX: Add "!Array.isArray(data)" to safely handle non-array responses
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { minPrice: 0, maxPrice: 1000, minTime: 0, maxTime: 120 };
    }

    return {
      minPrice: Math.min(...data.map((d) => d.price)),
      maxPrice: Math.max(...data.map((d) => d.price)),
      minTime: Math.min(...data.map((d) => d.cookingTime)),
      maxTime: Math.max(...data.map((d) => d.cookingTime)),
    };
  }, [data]);

  const filteredResults = useMemo(() => {
    // FIX: Check if data is an array
    if (!data || !Array.isArray(data)) return [];

    return data.filter((item) => {
      const matchesCategory = category
        ? item.foodCategoryName === category
        : true;
      const matchesPrice = priceRange ? item.price <= priceRange : true;
      const matchesTime = timeRange ? item.cookingTime <= timeRange : true;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesPrice && matchesTime && matchesSearch;
    });
  }, [data, category, priceRange, timeRange, search]);

  // 2. NOW YOU CAN DO EARLY RETURNS
  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Lodding />
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Error />
      </div>
    );

  // 3. ACTUAL RENDERING
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-[1600px] px-2 sm:px-6 lg:px-8 py-4">
        <Filter
          category={category}
          setCategory={setCategory}
          minTime={stats.minTime}
          maxTime={stats.maxTime}
          minPrice={stats.minPrice}
          maxPrice={stats.maxPrice}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          search={search}
          setSearch={setSearch}
        />

        <div className="mb-4 px-2 text-sm text-slate-500 font-medium">
          Showing {filteredResults.length} items
        </div>

        {/* 100% Responsive Grid: 2 columns on tiny phones, up to 6 on desktop */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {paginatedData?.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={item.id}
              >
                <Card data={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredResults.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center opacity-60">
            <p className="text-xl font-semibold text-slate-400">
              No foods found
            </p>
          </div>
        )}

        <div className="mt-10 mb-6">
          <Pagination
            temp={filteredResults}
            length={filteredResults.length}
            setPaginatedData={setPaginatedData}
          />
        </div>
      </div>
    </main>
  );
}

export default Shop;
