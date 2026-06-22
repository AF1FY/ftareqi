'use client';

import { FileText, Upload, Edit2 } from 'lucide-react';

export default function DocumentsCard({ isDark }: { isDark: boolean }) {
  const documents = [
    { title: 'License (Front)', status: 'Pending', image: '' },
    { title: 'License (Back)', status: 'Pending', image: '' },
  ];

  return (
    <div
      className={`rounded-2xl border p-8 shadow-sm transition-colors ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <FileText size={24} /> Driver Documents
        </h3>
        <button
          className={`text-sm font-bold border px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            isDark
              ? 'text-gray-300 border-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600'
              : 'text-gray-700 border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600'
          }`}
        >
          <Upload size={16} /> Upload New
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.title}
            className={`border rounded-xl p-4 flex flex-col gap-4 hover:shadow-lg transition-all group cursor-pointer ${
              isDark
                ? 'border-slate-600 bg-slate-700/30 hover:border-blue-500 hover:shadow-blue-900/20'
                : 'border-gray-300 bg-gray-50 hover:border-blue-600 hover:shadow-blue-200'
            }`}
          >
            {/* Document Header */}
            <div className="flex items-center justify-between">
              <p className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                {doc.title}
              </p>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide border ${
                isDark
                  ? 'border-amber-900/50 bg-amber-900/20 text-amber-500'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}>
                {doc.status}
              </span>
            </div>

            {/* Document Image */}
            <div className={`aspect-[3/2] rounded-lg overflow-hidden relative border transition-colors ${
              isDark
                ? 'bg-slate-600 border-slate-600'
                : 'bg-gray-200 border-gray-300'
            }`}>
              <img
                alt={doc.title}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                src={doc.image || "/placeholder.svg"}
              />
              <div className={`absolute inset-0 flex items-center justify-center transition-colors ${
                isDark
                  ? 'bg-blue-900/0 group-hover:bg-blue-900/30'
                  : 'bg-blue-900/0 group-hover:bg-blue-900/20'
              }`}>
                <Edit2
                  size={20}
                  className={`opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all p-2 rounded-full shadow-lg border box-content ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-blue-400'
                      : 'bg-white border-gray-300 text-blue-600'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
