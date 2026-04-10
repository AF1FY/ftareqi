'use client';

import { Menu, Bell, Sun, Moon } from 'lucide-react';

export default function Header({ isDark, toggleDarkMode }: { isDark: boolean; toggleDarkMode: () => void }) {
  return (
    <header
      className={`h-16 border-b flex items-center justify-between px-6 lg:px-10 shrink-0 z-20 transition-colors bg-slate-800 border-slate-700 dark:bg-white dark:border-gray-200`}
    >
      <div className="flex items-center gap-4">
        <button
          className={`lg:hidden p-2 -ml-2 rounded-lg transition-colors ${
            isDark ? 'text-gray-400 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Menu size={24} />
        </button>
        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          User Profile
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          className={`relative p-2 rounded-lg transition-colors ${
            isDark
              ? 'text-gray-400 hover:bg-slate-700 hover:text-blue-400'
              : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
          }`}
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className={`h-6 w-px ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>

        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-colors ${
            isDark
              ? 'text-gray-400 hover:bg-slate-700 hover:text-blue-400'
              : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
          }`}
          title="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          className={`flex items-center gap-3 p-1.5 rounded-full transition-colors border ${
            isDark
              ? 'border-slate-700 hover:border-slate-600 hover:bg-slate-700'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-100'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full overflow-hidden ring-2 ${
              isDark ? 'ring-slate-700 bg-blue-900' : 'ring-gray-200 bg-gray-200'
            }`}
          >
            <img
              alt="User Avatar"
              className="w-full h-full object-cover"
              src=""
            />
          </div>
          <span className={`text-sm font-bold hidden md:block ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            samar k.
          </span>
        </button>
      </div>
    </header>
  );
}
