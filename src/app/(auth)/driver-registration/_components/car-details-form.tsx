"use client"

interface CarDetailsFormProps {
  formData: {
    carBrand: string
    carColor: string
    carPlate: string
    numSeats: string
  }
  onInputChange: (field: "carBrand" | "carColor" | "carPlate" | "numSeats", value: string) => void
}

export default function CarDetailsForm({ formData, onInputChange }: CarDetailsFormProps) {
  return (
    <div>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Car Brand & Model"
          value={formData.carBrand}
          onChange={(e) => onInputChange("carBrand", e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <input
          type="text"
          placeholder="Car Color"
          value={formData.carColor}
          onChange={(e) => onInputChange("carColor", e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <input
          type="text"
          placeholder="Car Plate Number"
          value={formData.carPlate}
          onChange={(e) => onInputChange("carPlate", e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <input
          type="text"
          placeholder="Number of Seats"
          value={formData.numSeats}
          onChange={(e) => onInputChange("numSeats", e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
      </div>
    </div>
  )
}
