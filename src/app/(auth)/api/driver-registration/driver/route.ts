import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const firstName = formData.get("firstName")?.toString() || "Unknown"
    const lastName = formData.get("lastName")?.toString() || "Unknown"
    const email = formData.get("email")?.toString() || "unknown@example.com"
    const phone = formData.get("phone")?.toString() || "0000000000"
    const profilePhoto = formData.get("profilePhoto") as File | null
    const driverLicenseFront = formData.get("driverLicenseFront") as File | null
    const driverLicenseBack = formData.get("driverLicenseBack") as File | null
    const driverLicenseExpiry = formData.get("driverLicenseExpiry")?.toString() || ""

    if (!driverLicenseFront || !driverLicenseBack || !driverLicenseExpiry) {
      return NextResponse.json(
        { success: false, message: "Driver license and expiry date are required" },
        { status: 400 }
      )
    }

    // معالجة الملفات
    let profilePhotoUrl: string | undefined
    let driverLicenseFrontUrl: string | undefined
    let driverLicenseBackUrl: string | undefined

    if (profilePhoto) {
      const buffer = await profilePhoto.arrayBuffer()
      console.log("Profile photo received:", profilePhoto.name, buffer.byteLength, "bytes")
      profilePhotoUrl = `uploads/profile/${Date.now()}-${profilePhoto.name}`
    }

    if (driverLicenseFront) {
      const buffer = await driverLicenseFront.arrayBuffer()
      console.log("Driver license front received:", driverLicenseFront.name, buffer.byteLength, "bytes")
      driverLicenseFrontUrl = `uploads/license/front-${Date.now()}-${driverLicenseFront.name}`
    }

    if (driverLicenseBack) {
      const buffer = await driverLicenseBack.arrayBuffer()
      console.log("Driver license back received:", driverLicenseBack.name, buffer.byteLength, "bytes")
      driverLicenseBackUrl = `uploads/license/back-${Date.now()}-${driverLicenseBack.name}`
    }

    // معرف فريد
    const driverId = `driver_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`

    // حفظ البيانات (تجريبي)
    console.log("Driver data saved:", {
      driverId,
      firstName,
      lastName,
      email,
      phone,
      profilePhotoUrl,
      driverLicenseFrontUrl,
      driverLicenseBackUrl,
      driverLicenseExpiry,
    })

    return NextResponse.json(
      {
        success: true,
        driverId,
        message: "Driver information saved successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error processing driver registration:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
