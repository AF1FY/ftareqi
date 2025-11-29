"use client"

import type React from "react"
import { useRef } from "react"
import type { LucideIcon } from "lucide-react"

interface UploadSectionProps {
  title: string
  label: string
  icon: LucideIcon
  onUpload: (file: File) => void
  fileName?: string
}

export default function UploadSection({ title, label, icon: Icon, onUpload, fileName }: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      {/* Title + Icon */}
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">
          {title}
        </h3>
      </div>

      {/* Upload Row */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            {label}
          </p>
        </div>

        <button
          onClick={handleUploadClick}
          className="px-4 py-1.5 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
        >
          Upload
        </button>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf"
        />
      </div>

      {/* File Name Display */}
      {fileName && (
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 ml-6 truncate">
          {fileName}
        </p>
      )}
    </div>
  )
}
