import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ onSearch, placeholder = "Search music..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative mb-4 lg:mb-6">
      <form onSubmit={handleSearch} className="flex">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 lg:py-4 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-l-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 transition-all duration-200 text-sm lg:text-base hover:bg-gray-700/80"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-gray-600/50 active:scale-95"
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-4 lg:px-6 py-3 lg:py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-r-xl hover:from-purple-700 hover:to-purple-800 active:from-purple-800 active:to-purple-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm lg:text-base font-medium shadow-lg hover:shadow-purple-500/25 active:scale-95 touch-manipulation"
        >
          <span className="hidden sm:inline">Search</span>
          <FaSearch className="sm:hidden" size={16} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
