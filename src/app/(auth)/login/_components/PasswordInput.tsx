"use client"

import { type ChangeEvent, useState } from "react"

interface PasswordInputProps {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

export default function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

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
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
          className={`w-full pr-12 pl-4 py-3 rounded-xl border-2 transition-all
            ${
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-input focus:border-primary focus:ring-2 focus:ring-ring/50"
            }
            ${disabled ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-background"}
            text-foreground placeholder:text-muted-foreground focus:outline-none`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          {showPassword ? "👁" : "👁‍🗨"}
        </button>
      </div>
      {error && (
        <p id={`${label}-error`} className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
