'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UserForm from '@/src/components/ui/UserForm';

export default function EditProfilePage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = localStorage.getItem('theme') === 'dark' || 
                       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-sm font-medium mb-4 transition-colors ${
              isDark
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <ArrowLeft size={16} />
            Back to Profile
          </Link>
        </div>

        {/* Form */}
        <UserForm isDark={isDark} onSubmit={() => {
          // Optional: redirect or show success message
          console.log(' Profile updated successfully');
        }} />
      </div>
    </div>
  );
}
