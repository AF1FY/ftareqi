"use client"

import type { ReactNode } from "react"

interface SecondaryButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  icon?: ReactNode
  className?: string
}

export default function SecondaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  icon,
  className = "",
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-secondary text-secondary-foreground py-3 rounded-full font-semibold 
        transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        flex items-center justify-center gap-2 ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}
