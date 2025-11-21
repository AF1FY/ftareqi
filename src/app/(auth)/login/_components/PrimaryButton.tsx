"use client"

import type { ReactNode } from "react"

interface PrimaryButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  isLoading?: boolean
  className?: string
}

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  className = "",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold 
        transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin">⟳</span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
