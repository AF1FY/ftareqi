export async function uploadDriverInfo(formData: FormData) {
  try {
    const response = await fetch("/api/driver-registration/driver", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload driver info: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, driverId: data.driverId, message: "Driver info uploaded successfully" }
  } catch (error) {
    console.error("[] Driver upload error:", error)
    return { success: false, message: "Failed to upload driver information" }
  }
}

export async function uploadCarDetails(formData: FormData, driverId: string) {
  try {
    const response = await fetch("/api/driver-registration/car-details", {
      method: "POST",
      headers: {
        "X-Driver-ID": driverId,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload car details: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, message: "Car details uploaded successfully", data }
  } catch (error) {
    console.error("[] Car details upload error:", error)
    return { success: false, message: "Failed to upload car details" }
  }
}
