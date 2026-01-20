"use client"

interface FormActionsProps {
  onBack: () => void
  onSubmit: () => void
  isLoading?: boolean
  step?: "driver" | "car"
}

export default function FormActions({ onBack, onSubmit, isLoading, step = "driver" }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      {step === "car" && (
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-1.5 bg-gray-200 text-gray-900 font-semibold text-xs rounded-full hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Back
        </button>
      )}
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="px-6 py-1.5 bg-gray-900 text-white font-semibold text-xs rounded-full hover:bg-black transition-colors disabled:opacity-50"
      >
        {isLoading ? "Loading..." : step === "driver" ? "Next" : "Submit Application"}
      </button>
    </div>
  )
}
