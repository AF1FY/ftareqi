"use client"

import { useState } from "react"
import { uploadDriverInfo, uploadCarDetails } from "../_lib/api-client"
import { submitCarDetailsAsync, submitDriverProfile } from "@/lib/actions/Driver.actions"

// Interface names now match Swagger exactly (case-sensitive)
interface DriverFormData {
  DriverProfilePhoto?: File | null
  DriverLicenseFront?: File | null
  DriverLicenseBack?: File | null
  LicenseExpiryDate?: string
  CarPhoto?: File | null
  CarLicenseFront?: File | null
  CarLicenseBack?: File | null
  Model?: string
  Color?: string
  Plate?: string
  NumOfSeats?: string
  CarLicenseExpiryDate?: string
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

      // Now no mapping needed - names match Swagger directly
      if (formData.DriverProfilePhoto) data.append("DriverProfilePhoto", formData.DriverProfilePhoto)
      if (formData.DriverLicenseFront) data.append("DriverLicenseFront", formData.DriverLicenseFront)
      if (formData.DriverLicenseBack) data.append("DriverLicenseBack", formData.DriverLicenseBack)
      if (formData.LicenseExpiryDate) {
        // Full ISO date-time format for Swagger string($date-time)
        const formattedDate = `${formData.LicenseExpiryDate}T00:00:00.000Z`
        data.append("LicenseExpiryDate", formattedDate)
      }

      console.log("Submitting driver info with FormData")

      const result = await submitDriverProfile(data);

      if (result.success) {
        return result;
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
    setIsLoading(true)
    setError(null)

    try {
      const data = new FormData()

      if (formData.CarPhoto) data.append("CarPhoto", formData.CarPhoto)
      if (formData.CarLicenseFront) data.append("CarLicenseFront", formData.CarLicenseFront)
      if (formData.CarLicenseBack) data.append("CarLicenseBack", formData.CarLicenseBack)

      if (formData.Model) data.append("Model", formData.Model)
      if (formData.Color) data.append("Color", formData.Color)
      if (formData.Plate) data.append("Plate", formData.Plate)
      if (formData.NumOfSeats) data.append("NumOfSeats", formData.NumOfSeats)

      if (formData.CarLicenseExpiryDate) {
        const formattedDate = `${formData.CarLicenseExpiryDate}T00:00:00.000Z`
        data.append("LicenseExpiryDate", formattedDate)
      }

      console.log("Submitting car details with FormData")

      const result = await submitCarDetailsAsync(data);

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
