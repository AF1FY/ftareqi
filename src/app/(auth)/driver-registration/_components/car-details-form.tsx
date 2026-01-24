"use client"

import { CAR_COLORS_MAP } from "@/types/Driver"

interface CarDetailsFormProps {
  formData: {
    Model: string
    Color: string
    Plate: string
    NumOfSeats: string
  }
  onInputChange: (field: "Model" | "Color" | "Plate" | "NumOfSeats", value: string) => void
}

export default function CarDetailsForm({ formData, onInputChange }: CarDetailsFormProps) {
  return (
    <div>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Car Brand & Model"
          value={formData.Model}
          onChange={(e) => onInputChange("Model", e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-[#111827] dark:text-gray-100 dark:border-gray-600"
        />
        <select
          value={formData.Color}
          onChange={(e) => onInputChange("Color", e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-[#111827] dark:text-gray-100 dark:border-gray-600"
        >
          <option value="">Select Car Color</option>
          {Object.entries(CAR_COLORS_MAP).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Car Plate Number"
          value={formData.Plate}
          onChange={(e) => onInputChange("Plate", e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-[#111827] dark:text-gray-100 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Number of Seats"
          value={formData.NumOfSeats}
          onChange={(e) => onInputChange("NumOfSeats", e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-[#111827] dark:text-gray-100 dark:border-gray-600"
        />
      </div>
    </div>
  )
}
