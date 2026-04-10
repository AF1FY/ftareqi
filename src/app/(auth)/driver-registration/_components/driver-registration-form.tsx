"use client"

import { useState } from "react"
import { User, FileText, Camera, File, ImageIcon } from "lucide-react"
import UploadSection from "./upload-section"
import CarDetailsForm from "./car-details-form"
import FormActions from "./form-actions"
import { useDriverRegistration } from "../_hooks/useDriverRegistration"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Interface now matches Swagger field names exactly
interface FormData {
  DriverProfilePhoto: File | null
  DriverLicenseFront: File | null
  DriverLicenseBack: File | null
  LicenseExpiryDate: string
  CarPhoto: File | null
  CarLicenseFront: File | null
  CarLicenseBack: File | null
  Model: string
  Color: string
  Plate: string
  NumOfSeats: string
  CarLicenseExpiryDate: string
  confirmAccurate: boolean
  uploadedFileNames: { [key: string]: string }
}

export default function DriverRegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    DriverProfilePhoto: null,
    DriverLicenseFront: null,
    DriverLicenseBack: null,
    LicenseExpiryDate: "",
    CarPhoto: null,
    CarLicenseFront: null,
    CarLicenseBack: null,
    Model: "",
    Color: "",
    Plate: "",
    NumOfSeats: "",
    CarLicenseExpiryDate: "",
    confirmAccurate: false,
    uploadedFileNames: {},
  })

  const [preview, setPreview] = useState<string | null>(null)
  const [step, setStep] = useState<"driver" | "car">("driver")
  const { submitDriverInfo, submitCarDetails, isLoading, error } = useDriverRegistration();

  const handleFileUpload = (
    field: keyof Pick<
      FormData,
      | "DriverProfilePhoto"
      | "DriverLicenseFront"
      | "DriverLicenseBack"
      | "CarPhoto"
      | "CarLicenseFront"
      | "CarLicenseBack"
    >,
    file: File
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: file,
      uploadedFileNames: { ...prev.uploadedFileNames, [field]: file.name },
    }))

    if (field === "DriverProfilePhoto" || field === "CarPhoto") {
      const reader = new FileReader()
      reader.onload = e => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (
    field: keyof Pick<FormData, "Model" | "Color" | "Plate" | "NumOfSeats" | "LicenseExpiryDate" | "CarLicenseExpiryDate">,
    value: string
  ) => setFormData(prev => ({ ...prev, [field]: value }))

  const handleCheckboxChange = (checked: boolean) =>
    setFormData(prev => ({ ...prev, confirmAccurate: checked }))

  const handleSubmitDriver = async () => {
    try {
      if (!formData.DriverLicenseFront || !formData.DriverLicenseBack || !formData.LicenseExpiryDate) {
        alert("Please upload both sides of your driver's license and enter the expiry date")
        return
      }

      console.log("Submitting driver info...", formData)
      const result = await submitDriverInfo(formData)

      if (result?.success) {
        toast.success("Driver info saved successfully");
        setStep("car")
      } else {
        console.error("Driver API failed:", result);
      }
    } catch (err) {
      console.error("Error submitting driver info:", err)
      alert("Error submitting driver info. Check console for details.")
    }
  }

  const handleSubmitCar = async () => {
    try {
      if (
        !formData.CarLicenseFront ||
        !formData.CarLicenseBack ||
        !formData.CarPhoto
      ) {
        alert("Please upload vehicle photos and documents")
        return
      }

      if (!formData.Model || !formData.Color || !formData.Plate || !formData.NumOfSeats || !formData.CarLicenseExpiryDate) {
        alert("Please fill in all car details including expiry date")
        return
      }

      if (!formData.confirmAccurate) {
        alert("Please confirm all information is accurate")
        return
      }

      console.log("Submitting car info...", formData)
      const result = await submitCarDetails(formData)

      if (result?.success) {
        toast.success("Registration completed successfully" , {position: 'top-right'})
        setTimeout(() => {
          router.push('/home');
        }, 1500);
        setFormData({
          DriverProfilePhoto: null,
          DriverLicenseFront: null,
          DriverLicenseBack: null,
          LicenseExpiryDate: "",
          CarPhoto: null,
          CarLicenseFront: null,
          CarLicenseBack: null,
          Model: "",
          Color: "",
          Plate: "",
          NumOfSeats: "",
          CarLicenseExpiryDate: "",
          confirmAccurate: false,
          uploadedFileNames: {},
        })
        setPreview(null)
      } else {
        console.warn("Car API failed:", result)
        alert(result?.message || "Something went wrong with car submission")
      }
    } catch (err) {
      console.error("Error submitting car info:", err)
      alert("Error submitting car info. Check console for details.")
    }
  }

  const handleBack = () => {
    if (step === "car") setStep("driver")
  }

  return (
    <div className="bg-popover rounded-3xl shadow-lg p-8 transition-colors">
      <h1 className="text-2xl font-bold mb-12 text-center">Driver Registration</h1>

      {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 text-xs rounded-lg">{error}</div>}

      {step === "driver" ? (
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <UploadSection
              title="Profile Photo"
              label="Upload Profile Photo (Optional)"
              icon={User}
              fileName={formData.uploadedFileNames["DriverProfilePhoto"]}
              onUpload={file => handleFileUpload("DriverProfilePhoto", file)}
            />
            <UploadSection
              title="Driver's License Front"
              label="Upload Front Side of License"
              icon={FileText}
              fileName={formData.uploadedFileNames["DriverLicenseFront"]}
              onUpload={file => handleFileUpload("DriverLicenseFront", file)}
            />
            <UploadSection
              title="Driver's License Back"
              label="Upload Back Side of License"
              icon={FileText}
              fileName={formData.uploadedFileNames["DriverLicenseBack"]}
              onUpload={file => handleFileUpload("DriverLicenseBack", file)}
            />
            <div>
              <label className="text-gray-700 dark:text-gray-300 text-xs mb-1 block">
                License Expiry Date
              </label>
              <input
                type="date"
                value={formData.LicenseExpiryDate}
                onChange={e => handleInputChange("LicenseExpiryDate", e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-[#111827] dark:text-gray-100 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-center bg-gray-50 dark:bg-[#111827] rounded-2xl min-h-64 border">
            {preview ? (
              <img src={preview || "/placeholder.svg"} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="text-center">
                <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-xs">Image Preview</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <UploadSection
                title="Car Photo"
                label="Upload Car Photo"
                icon={Camera}
                fileName={formData.uploadedFileNames["CarPhoto"]}
                onUpload={file => handleFileUpload("CarPhoto", file)}
              />
              <UploadSection
                title="Vehicle Documents Front"
                label="Upload Front Side of Vehicle Docs"
                icon={File}
                fileName={formData.uploadedFileNames["CarLicenseFront"]}
                onUpload={file => handleFileUpload("CarLicenseFront", file)}
              />
              <UploadSection
                title="Vehicle Documents Back"
                label="Upload Back Side of Vehicle Docs"
                icon={File}
                fileName={formData.uploadedFileNames["CarLicenseBack"]}
                onUpload={file => handleFileUpload("CarLicenseBack", file)}
              />
            </div>

            <div className="flex items-center justify-center bg-gray-50 dark:bg-[#111827] rounded-2xl min-h-64 border">
              {preview ? (
                <img src={preview || "/placeholder.svg"} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-xs">Image Preview</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <CarDetailsForm formData={formData} onInputChange={handleInputChange} />
            <div>
              <label className="text-gray-700 dark:text-gray-300 text-xs mb-1 block">
                Car License Expiry Date
              </label>
              <input
                type="date"
                value={formData.CarLicenseExpiryDate}
                onChange={e => handleInputChange("CarLicenseExpiryDate", e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-[#111827] dark:text-gray-100 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-8">
            <input
              type="checkbox"
              checked={formData.confirmAccurate}
              onChange={e => handleCheckboxChange(e.target.checked)}
            />
            <label className="text-gray-700 dark:text-gray-300 text-xs">I confirm all information is accurate.</label>
          </div>
        </>
      )}

      <FormActions
        onBack={handleBack}
        onSubmit={step === "driver" ? handleSubmitDriver : handleSubmitCar}
        isLoading={isLoading}
        step={step}
      />
    </div>
  )
}
