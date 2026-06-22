'use client';

import { Car, Edit2, Calendar, AlertCircle } from 'lucide-react';

const vehicle = {
  image: 'path/to/image.jpg',
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  color: 'Blue',
  licensePlate: 'XYZ123',
  insuranceExpiry: '2023-12-31',
};

export default function VehicleCard({ isDark }: { isDark: boolean }) {

  return (
    <div
      className={`rounded-2xl border p-8 shadow-sm transition-colors ${
        isDark
          ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Car size={24} /> Vehicle Information
        </h3>
        <button
          className={`p-2 rounded-full transition-colors border ${
            isDark
              ? 'bg-slate-700 hover:bg-slate-600 text-blue-400 border-slate-600'
              : 'bg-gray-100 hover:bg-gray-200 text-blue-600 border-gray-300'
          }`}
          title="Edit Vehicle"
        >
          <Edit2 size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Car Image */}
        <div className={`w-full md:w-5/12 aspect-[4/3] rounded-xl overflow-hidden relative group border transition-colors ${
          isDark
            ? 'bg-slate-700 border-slate-600'
            : 'bg-gray-100 border-gray-300'
        }`}>
          <img
            alt="Car photo"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src=""
          />
          <div className={`absolute bottom-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider`}>
            Primary
          </div>
        </div>

        {/* Info Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
          {/* Make & Model */}
          <div className="group">
            <label className={`text-xs font-bold uppercase tracking-wider block mb-1 transition-colors ${
              isDark
                ? 'text-gray-500 group-focus-within:text-blue-400'
                : 'text-gray-600 group-focus-within:text-blue-600'
            }`}>
              Make & Model
            </label>
            <input
              className={`w-full bg-transparent border-b focus:ring-0 px-0 py-1 text-base font-bold transition-colors ${
                isDark
                  ? 'border-slate-600 focus:border-blue-500 text-gray-200 placeholder-slate-600'
                  : 'border-gray-300 focus:border-blue-600 text-gray-900 placeholder-gray-400'
              }`}
              type="text"
              value="Hyundai Elantra"
              readOnly
            />
          </div>

          {/* Year */}
          <div className="group">
            <label className={`text-xs font-bold uppercase tracking-wider block mb-1 transition-colors ${
              isDark
                ? 'text-gray-500 group-focus-within:text-blue-400'
                : 'text-gray-600 group-focus-within:text-blue-600'
            }`}>
              Year
            </label>
            <input
              className={`w-full bg-transparent border-b focus:ring-0 px-0 py-1 text-base font-bold transition-colors ${
                isDark
                  ? 'border-slate-600 focus:border-blue-500 text-gray-200 placeholder-slate-600'
                  : 'border-gray-300 focus:border-blue-600 text-gray-900 placeholder-gray-400'
              }`}
              type="number"
              value="2024"
              readOnly
            />
          </div>

          {/* Color */}
          <div className="group">
            <label className={`text-xs font-bold uppercase tracking-wider block mb-1 transition-colors ${
              isDark
                ? 'text-gray-500 group-focus-within:text-blue-400'
                : 'text-gray-600 group-focus-within:text-blue-600'
            }`}>
              Color
            </label>
            <input
              className={`w-full bg-transparent border-b focus:ring-0 px-0 py-1 text-base font-bold transition-colors ${
                isDark
                  ? 'border-slate-600 focus:border-blue-500 text-gray-200 placeholder-slate-600'
                  : 'border-gray-300 focus:border-blue-600 text-gray-900 placeholder-gray-400'
              }`}
              type="text"
              value="Silver Metallic"
              readOnly
            />
          </div>

          {/* License Plate */}
          <div className="group">
            <label className={`text-xs font-bold uppercase tracking-wider block mb-1 transition-colors ${
              isDark
                ? 'text-gray-500 group-focus-within:text-blue-400'
                : 'text-gray-600 group-focus-within:text-blue-600'
            }`}>
              License Plate
            </label>
            <div className="flex items-center">
              <input
                className={`w-full bg-transparent border-b focus:ring-0 px-0 py-1 text-base font-bold uppercase tracking-widest transition-colors ${
                  isDark
                    ? 'border-slate-600 focus:border-blue-500 text-gray-200 placeholder-slate-600'
                    : 'border-gray-300 focus:border-blue-600 text-gray-900 placeholder-gray-400'
                }`}
                type="text"
                value="ABC 123"
                readOnly
              />
              <AlertCircle size={18} className={`ml-2 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} />
            </div>
          </div>

          {/* Insurance Expiry */}
          <div className="sm:col-span-2 pt-2">
            <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer group ${
              isDark
                ? 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50'
                : 'bg-gray-50 border-gray-300 hover:border-blue-600'
            }`}>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Insurance Expiry
                </p>
                <p className={`text-sm font-bold mt-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  15 Dec, 2025
                </p>
              </div>
              <Calendar size={20} className={`${isDark ? 'text-slate-500 group-hover:text-blue-400' : 'text-gray-400 group-hover:text-blue-600'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
