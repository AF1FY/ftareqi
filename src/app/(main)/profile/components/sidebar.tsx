'use client';

import { BarChart3, User, Map, Wallet, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';

const navigationItems = [
  { name: 'Dashboard', Icon: BarChart3 },
  { name: 'Profile', Icon: User, active: true },
  { name: 'My Trips', Icon: Map },
  { name: 'Wallet', Icon: Wallet },
  { name: 'Settings', Icon: Settings },
];

export default function Sidebar({ isDark }: { isDark: boolean }) {
  return (
    <aside
      className={`hidden lg:flex flex-col w-72 border-r h-full flex-shrink-0 z-30 transition-colors ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-6">
        <a href="#" className="flex items-center gap-3 group">
          <Image
            src={isDark ? '/logo-light.png' : '/logo-dark.png'}
            alt="shareup logo"
            width={140}
            height={50}
            className="h-auto w-full max-w-[140px]"
            priority
          />
        </a>
      </div>

      <nav
        className={`flex-1 px-4 flex flex-col gap-1 overflow-y-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
      >
        {navigationItems.map((item) => (
          <a
            key={item.name}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              item.active
                ? isDark
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : isDark
                ? 'text-gray-400 hover:bg-slate-700 hover:text-blue-400'
                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
            }`}
            href="#"
          >
            <item.Icon size={20} />
            <span className="font-medium">{item.name}</span>
          </a>
        ))}
      </nav>

      <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        <a
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
          }`}
          href="#"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </a>
      </div>
    </aside>
  );
}
