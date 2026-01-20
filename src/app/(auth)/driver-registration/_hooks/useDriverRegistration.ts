"use client" 
import { useState } from "react"
import { uploadDriverInfo, uploadCarDetails } from "../_lib/api-client" 

interface DriverFormData {
  profilePhoto?: File | null
  driverLicenseFront?: File | null
  driverLicenseBack?: File | null
  driverLicenseExpiry?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  carPhoto?: File | null
  vehicleDocumentsFront?: File | null
  vehicleDocumentsBack?: File | null
  carBrand?: string
  carColor?: string
  carPlate?: string
  numSeats?: string
}

export function useDriverRegistration() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [driverId, setDriverId] = useState<string | null>(null)

  const submitDriverInfo = async (formData: DriverFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = new FormData()

      if (formData.profilePhoto) data.append("profilePhoto", formData.profilePhoto)
      if (formData.driverLicenseFront) data.append("driverLicenseFront", formData.driverLicenseFront)
      if (formData.driverLicenseBack) data.append("driverLicenseBack", formData.driverLicenseBack)
      if (formData.driverLicenseExpiry) data.append("driverLicenseExpiry", formData.driverLicenseExpiry)

      data.append("firstName", formData.firstName || "")
      data.append("lastName", formData.lastName || "")
      data.append("email", formData.email || "")
      data.append("phone", formData.phone || "")

      const result = await uploadDriverInfo(data)

      if (result.success && result.driverId) {
        setDriverId(result.driverId)
        return { success: true, driverId: result.driverId }
      } else {
        setError(result.message)
        return { success: false, message: result.message }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const submitCarDetails = async (formData: DriverFormData) => {
    if (!driverId) {
      setError("Driver ID not found. Please submit driver information first.")
      return { success: false, message: "Driver ID not found" }
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = new FormData()

      if (formData.carPhoto) data.append("carPhoto", formData.carPhoto)
      if (formData.vehicleDocumentsFront) data.append("vehicleDocumentsFront", formData.vehicleDocumentsFront)
      if (formData.vehicleDocumentsBack) data.append("vehicleDocumentsBack", formData.vehicleDocumentsBack)

      data.append("carBrand", formData.carBrand || "")
      data.append("carColor", formData.carColor || "")
      data.append("carPlate", formData.carPlate || "")
      data.append("numSeats", formData.numSeats || "")

      const result = await uploadCarDetails(data, driverId)

      if (result.success) return { success: true, message: result.message }
      else {
        setError(result.message)
        return { success: false, message: result.message }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    submitDriverInfo,
    submitCarDetails,
    isLoading,
    error,
    driverId,
    setError,
  }
}
