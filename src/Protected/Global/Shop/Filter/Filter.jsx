import React, { useState } from "react";
import { FoodCategory } from "../../../../Api/FoodApi";
import { useQuery } from "@tanstack/react-query";
import { RiResetLeftFill } from "react-icons/ri";
import { getAllCategory } from "../../../../Api/CategoryApi";

function Filter({
  category,
  setCategory,
  minTime,
  maxTime,
  minPrice,
  maxPrice,
  priceRange,
  setPriceRange,
  timeRange,
  setTimeRange,
  search,
  setSearch,
}) {
  const [selectedFilter, setSelectedFilter] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["Category"],
    queryFn: () => getAllCategory(),
    staleTime: 5000,
  });
  console.log("catagoty :",data)

  // Toggle filter logic: click same filter again to close it
  const handleFilterClick = (filter) => {
    setSelectedFilter((prev) => (prev === filter ? null : filter));
  };

  const handleReset = () => {
    setCategory(null);
    setTimeRange(null);
    setPriceRange(null);
    setSelectedFilter(null);
    setSearch("");
  };

  // Helper for button styling
  const getBtnClass = (filter) =>
    `cursor-pointer transition-colors ${
      selectedFilter === filter
        ? "text-yellow-600 font-bold"
        : "hover:text-yellow-500"
    }`;

  return (
    <div className="w-full flex flex-col items-center my-4 space-y-4">
      {/* Top Bar: Nav & Search */}
      <div className="w-full flex flex-col sm:flex-row justify-around items-center px-4">
        <ul className="flex justify-center items-center space-x-6 md:space-x-12 py-2">
          {["range", "time", "category", "hot"].map((type) => (
            <li key={type}>
              <button
                onClick={() => handleFilterClick(type)}
                className={getBtnClass(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={handleReset}
              title="Reset Filters"
              className="mt-1 hover:text-red-500 transition-colors"
            >
              <RiResetLeftFill size={20} />
            </button>
          </li>
        </ul>

        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="relative">
            <input
              value={search}
              type="text"
              placeholder="Search dishes..."
              className="input input-bordered input-sm w-48 md:w-64 focus:outline-yellow-500"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="absolute right-2 top-1.5 opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Filter Controls Panel */}
      <div className="w-full bg-base-200/50 py-3 rounded-lg flex justify-center min-h-[60px]">
        {!selectedFilter && (
          <p className="text-gray-400 text-sm italic">
            Select a filter above to refine results
          </p>
        )}

        {selectedFilter === "range" && (
          <div className="flex items-center space-x-4 animate-fadeIn">
            <span className="text-sm font-medium">
              Price Range: 0 - ${priceRange || maxPrice}
            </span>
            <input
              type="range"
              min={minPrice || 0}
              max={maxPrice || 1000}
              value={priceRange || 0}
              className="range range-warning range-xs w-48"
              onChange={(e) => setPriceRange(e.target.value)}
            />
          </div>
        )}

        {selectedFilter === "time" && (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              Cooking Time: {timeRange || 0} mins
            </span>
            <input
              type="range"
              min={minTime || 0}
              max={maxTime || 120}
              value={timeRange || 0}
              className="range range-info range-xs w-48"
              onChange={(e) => setTimeRange(e.target.value)}
            />
          </div>
        )}

        {selectedFilter === "category" && (
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium">Category:</label>
            <select
              value={category || ""}
              className="select select-bordered select-sm w-40"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {isLoading ? (
                <option disabled>Loading...</option>
              ) : isError ? (
                <option disabled>Error loading categories</option>
              ) : (
                data?.map((d) => (
                  <option key={d?.id} value={d?.name}>
                    {d?.name}
                  </option>
                ))
              )}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default Filter;
