import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

function Pagination({ temp, length, setPaginatedData }) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;
  
  // Calculate total pages
  const pageCount = length ? Math.ceil(length / itemsPerPage) : 1;

  // Reset to first page if the filtered data (temp) changes in length
  // this prevents staying on a high page number when results shrink
  useEffect(() => {
    setCurrentPage(0);
  }, [length]);

  useEffect(() => {
    if (temp) {
      const startingIndex = currentPage * itemsPerPage;
      const endingIndex = startingIndex + itemsPerPage;
      
      // Update the parent's data state
      setPaginatedData(temp.slice(startingIndex, endingIndex));
    }
  }, [currentPage, temp, itemsPerPage, setPaginatedData]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    // Optional: Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex justify-center w-full">
      <ReactPaginate
        forcePage={currentPage} // Keeps UI in sync with state
        pageCount={pageCount}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        
        // Styling Classes
        containerClassName="flex justify-center items-center space-x-2 md:space-x-4 my-6 p-4 bg-base-100 rounded-xl shadow-lg"
        pageClassName="px-3 py-1 border rounded hover:bg-gray-100 transition-colors"
        activeClassName="!bg-slate-800 !text-white !border-slate-800"
        disabledClassName="opacity-50 cursor-not-allowed"
        
        previousLabel={
          <span className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition-all">
            Prev
          </span>
        }
        nextLabel={
          <span className="px-3 py-1 rounded bg-black text-white text-sm hover:bg-gray-800 transition-all">
            Next
          </span>
        }
        breakLabel="..."
        breakClassName="text-gray-400"
      />
    </div>
  );
}

export default Pagination;