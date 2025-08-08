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
    <div className="relative mb-6">
      <form onSubmit={handleSearch} className="flex">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
