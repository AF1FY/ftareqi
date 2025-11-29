"use client"

interface FormActionsProps {
  onBack: () => void
  onSubmit: () => void
}

export default function FormActions({ onBack, onSubmit }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="px-6 py-1.5 bg-gray-200 text-gray-900 font-semibold text-xs rounded-full hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        Back
      </button>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        className="px-6 py-1.5 bg-gray-900 text-white font-semibold text-xs rounded-full hover:bg-black transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
      >
        Submit Application
      </button>
    </div>
  )
}
