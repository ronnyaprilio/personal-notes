"use client";

import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, dateFrom: string, dateTo: string) => void;
  onCreateNew: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onCreateNew }) => {
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleSearch = () => {
    onSearch(query, dateFrom, dateTo);
  };

  const handleClear = () => {
    setQuery("");
    setDateFrom("");
    setDateTo("");
    onSearch("", "", "");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white border border-emerald-100 shadow-xl shadow-emerald-200/40 rounded-[28px] p-3 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Search notes
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by keyword, description, or content"
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
            />
          </div>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 text-white px-5 py-2 text-sm font-semibold shadow-lg shadow-emerald-200/50 hover:bg-emerald-700 transition"
          >
            <span className="mr-2 text-base">＋</span> New Note
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Date from
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Date to
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 rounded-2xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-700 transition"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              className="flex-1 rounded-2xl border border-slate-200 bg-white text-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
