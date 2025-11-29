"use client"

import { useState } from "react"
import { User, FileText, Camera, File, ImageIcon } from "lucide-react"
import UploadSection from "./upload-section"
import CarDetailsForm from "./car-details-form"
import FormActions from "./form-actions"

interface FormData {
  profilePhoto: File | null
  carPhoto: File | null
  driverLicense: File | null
  vehicleDocuments: File | null
  carBrand: string
  carColor: string
  carPlate: string
  numSeats: string
  confirmAccurate: boolean
  uploadedFileNames: {
    [key: string]: string
  }
}

export default function DriverRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    profilePhoto: null,
    carPhoto: null,
    driverLicense: null,
    vehicleDocuments: null,
    carBrand: "",
    carColor: "",
    carPlate: "",
    numSeats: "",
    confirmAccurate: false,
    uploadedFileNames: {},
  })

  const [preview, setPreview] = useState<string | null>(null)

  const handleFileUpload = (
    field: keyof Pick<FormData, "profilePhoto" | "carPhoto" | "driverLicense" | "vehicleDocuments">,
    file: File,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
      uploadedFileNames: { ...prev.uploadedFileNames, [field]: file.name },
    }))

    if (field === "carPhoto") {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (
    field: keyof Pick<FormData, "carBrand" | "carColor" | "carPlate" | "numSeats">,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, confirmAccurate: checked }))
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    alert("Application submitted successfully!")
  }

  const handleBack = () => {
    console.log("Going back")
  }

  return (
    <div className="bg-white dark:bg-[#1f2937] rounded-3xl shadow-lg p-8 transition-colors">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
        Driver Registration
      </h1>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-6">
          <UploadSection
            title="Your Profile"
            label="Upload Profile Photo (Optional)"
            icon={User}
            fileName={formData.uploadedFileNames["profilePhoto"]}
            onUpload={(file) => handleFileUpload("profilePhoto", file)}
          />

          <UploadSection
            title="Your License"
            label="Upload Driver's License"
            icon={FileText}
            fileName={formData.uploadedFileNames["driverLicense"]}
            onUpload={(file) => handleFileUpload("driverLicense", file)}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <UploadSection
            title="Car Photo"
            label="Upload Car Photo"
            icon={Camera}
            fileName={formData.uploadedFileNames["carPhoto"]}
            onUpload={(file) => handleFileUpload("carPhoto", file)}
          />

          <UploadSection
            title="Vehicle Documents"
            label="Vehicle Registration or Insurance"
            icon={File}
            fileName={formData.uploadedFileNames["vehicleDocuments"]}
            onUpload={(file) => handleFileUpload("vehicleDocuments", file)}
          />
        </div>
      </div>

      {/* Car Details + Preview */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Car Details Form */}
        <div className="">
          <h3 className="font-semibold mb-3 text-xs">Car Details</h3>
          <CarDetailsForm formData={formData} onInputChange={handleInputChange} />
        </div>

        {/* Image Preview */}
        <div className="flex items-center justify-center bg-gray-50 dark:bg-[#111827] rounded-2xl min-h-64 border border-gray-200 dark:border-gray-700">
          {preview ? (
            <div className="w-full">
              <img
                src={preview}
                alt="Car preview"
                className="w-full h-56 object-cover rounded-2xl"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                {formData.uploadedFileNames["carPhoto"]}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-400 text-xs">Image Preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-2 mb-8">
        <input
          type="checkbox"
          id="confirm"
          checked={formData.confirmAccurate}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          className="w-4 h-4 border-gray-300 rounded cursor-pointer"
        />
        <label htmlFor="confirm" className="text-gray-700 dark:text-gray-300 text-xs cursor-pointer">
          I confirm all information is accurate.
        </label>
      </div>

      {/* Action Buttons */}
      <FormActions onBack={handleBack} onSubmit={handleSubmit} />
    </div>
  )
}
