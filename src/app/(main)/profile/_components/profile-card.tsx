'use client';

import { Star, CheckCircle, Pencil, Wallet, Plus, ArrowRight } from 'lucide-react';

export default function ProfileCard({ isDark }: { isDark: boolean }) {
  return (
    <div className={`max-w-6xl mx-auto`}>

      {/* CARD */}
      <div className={`rounded-3xl border shadow-sm overflow-hidden transition-colors bg-background border-athens-gray`}>

        {/* BLUE HEADER */}
        <div className="h-24 sm:h-28 md:h-32 lg:h-36 bg-linear-to-r from-blue-600 to-blue-500" />

        {/* WHITE SECTION */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 pb-6 sm:pb-8 md:pb-10 lg:pb-12 pt-4 sm:pt-5 md:pt-6">

          <div className="flex flex-col lg:flex-row lg:justify-between gap-6 sm:gap-8 lg:gap-10">

            {/* LEFT SIDE */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-8">

              {/* Avatar */}
              <div className="relative shrink-0 flex justify-center sm:justify-start w-fit mx-auto sm:w-auto -mt-12 sm:-mt-14 md:-mt-16">

                <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full border-2 border-white dark:border-black shadow-md overflow-hidden bg-background`}>
                  <img
                    src=""
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className={`absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full ${isDark ? 'bg-green-500 border-slate-800' : 'bg-green-500 border-white'
                  }`} />
              </div>

              {/* USER INFO */}
              <div className="pt-2 sm:pt-3 md:pt-4 w-full">

                {/* Name */}
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <h1 className={`text-xl sm:text-2xl md:text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    John Doe
                  </h1>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">

                  <span className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold ${isDark
                      ? 'bg-amber-900/30 text-amber-400 border border-amber-900/50'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                    <Star size={13} fill="currentColor" />
                    GOLD MEMBER
                  </span>

                  <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-royale-blue text-white text-xs font-semibold shadow-sm">
                    <Star size={13} fill="white" />
                    4.8 Rating
                  </span>

                </div>

                <p className={`text-xs sm:text-sm font-medium mb-4 sm:mb-6 md:mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Joined September 2025
                </p>

                {/* DETAILS */}
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12 lg:gap-16">

                  <div>
                    <p className={`text-xs uppercase font-semibold mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Phone
                    </p>
                    <p className={`font-medium text-xs sm:text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      +20 111 069 357
                    </p>
                  </div>

                  <div>
                    <p className={`text-xs uppercase font-semibold mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Gender
                    </p>
                    <p className={`font-medium text-xs sm:text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Male
                    </p>
                  </div>

                  <div>
                    <p className={`text-xs uppercase font-semibold mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Status
                    </p>

                    <div className={`flex items-center gap-1 font-medium text-xs sm:text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      <CheckCircle size={14} />
                      Active
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* BALANCE CARD */}
            <div className="w-full lg:w-72 flex items-center">

              <div className={`rounded-2xl w-full dark:border-2 border-athens-gray p-4 shadow-sm transition-colors bg-white-athens-gray`}>

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-10 h-10 rounded-lg bg-royale-blue flex items-center justify-center text-white shadow">
                    <Wallet size={18} />
                  </div>

                  <div>
                    <p className="text-xs uppercase font-semibold text-pale-sky">
                      Balance
                    </p>

                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      500.00 <span className={`text-dodger-blue`}>EGP</span>
                    </p>
                  </div>

                </div>

                {/* BUTTONS */}
                <div className="flex gap-2">

                  <button className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border text-xs font-medium border-royale-blue text-dodger-blue cursor-pointer`}>
                    <Plus size={14} />
                    Add Funds
                  </button>

                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-royale-blue text-white text-xs font-medium hover:bg-blue-700">
                    Wallet
                    <ArrowRight size={14} />
                  </button>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
