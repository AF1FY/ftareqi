"use client"

import type { ChangeEvent } from "react"

interface CheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function Checkbox({ id, label, checked, onChange, disabled = false }: CheckboxProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked)
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        aria-label={label}
        className="w-5 h-5 rounded border-2 border-input cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <label htmlFor={id} className="text-sm text-foreground cursor-pointer select-none disabled:opacity-50">
        {label}
      </label>
    </div>
  )
}
