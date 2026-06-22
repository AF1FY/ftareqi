'use client'

import { useState, useEffect } from 'react'
import ProfileCard from './_components/profile-card'
import ModeToggle from './_components/mode-toggle'
import PerformanceCard from './_components/performance-card'
import VehicleCard from './_components/vehicle-card'
import DocumentsCard from './_components/documents-card'
import { useTheme } from 'next-themes'

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [isDriver, setIsDriver] = useState(false)
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark'

  return (
    <div className={`w-full`}>
      <div className="overflow-y-auto p-4 md:p-8 lg:px-12 pb-20 scroll-smooth">
        <div className="max-w-5xl mx-auto space-y-8">
          <ProfileCard isDark={isDark} />
          <ModeToggle isDriver={isDriver} setIsDriver={setIsDriver} />

          {isDriver && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
              <div className="md:col-span-4">
                <PerformanceCard isDark={isDark} />
              </div>
              <div className="md:col-span-8 space-y-6">
                <VehicleCard isDark={isDark} />
                <DocumentsCard isDark={isDark} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
