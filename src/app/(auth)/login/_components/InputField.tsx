"use client"

import type { ChangeEvent, ReactNode } from "react"

interface InputFieldProps {
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  icon?: ReactNode
  required?: boolean
  disabled?: boolean
}

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  disabled = false,
}: InputFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-muted-foreground text-lg">{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border-2 transition-all
            ${
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-input focus:border-primary focus:ring-2 focus:ring-ring/50"
            }
            ${disabled ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-background"}
            text-foreground placeholder:text-muted-foreground focus:outline-none`}
        />
      </div>
      {error && (
        <p id={`${label}-error`} className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
