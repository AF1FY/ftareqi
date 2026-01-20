import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const driverId = request.headers.get("X-Driver-ID")
    if (!driverId) {
      return NextResponse.json({ success: false, message: "Driver ID is required" }, { status: 400 })
    }

    const formData = await request.formData()

    // استخراج البيانات
    const carBrand = formData.get("carBrand")?.toString() || ""
    const carColor = formData.get("carColor")?.toString() || ""
    const carPlate = formData.get("carPlate")?.toString() || ""
    const numSeats = formData.get("numSeats")?.toString() || ""
    const carPhoto = formData.get("carPhoto") as File | null
    const vehicleDocumentsFront = formData.get("vehicleDocumentsFront") as File | null
    const vehicleDocumentsBack = formData.get("vehicleDocumentsBack") as File | null

    if (!carBrand || !carColor || !carPlate || !numSeats || !carPhoto || !vehicleDocumentsFront || !vehicleDocumentsBack) {
      return NextResponse.json({ success: false, message: "All car details and files are required" }, { status: 400 })
    }

    // معالجة الملفات
    let carPhotoUrl: string | undefined
    let vehicleDocumentsFrontUrl: string | undefined
    let vehicleDocumentsBackUrl: string | undefined

    if (carPhoto) {
      const buffer = await carPhoto.arrayBuffer()
      console.log("Car photo received:", carPhoto.name, buffer.byteLength, "bytes")
      carPhotoUrl = `uploads/car/${Date.now()}-${carPhoto.name}`
    }

    if (vehicleDocumentsFront) {
      const buffer = await vehicleDocumentsFront.arrayBuffer()
      console.log("Vehicle documents front received:", vehicleDocumentsFront.name, buffer.byteLength, "bytes")
      vehicleDocumentsFrontUrl = `uploads/documents/front-${Date.now()}-${vehicleDocumentsFront.name}`
    }

    if (vehicleDocumentsBack) {
      const buffer = await vehicleDocumentsBack.arrayBuffer()
      console.log("Vehicle documents back received:", vehicleDocumentsBack.name, buffer.byteLength, "bytes")
      vehicleDocumentsBackUrl = `uploads/documents/back-${Date.now()}-${vehicleDocumentsBack.name}`
    }

    // حفظ البيانات (تجريبي)
    console.log("Car details saved:", {
      driverId,
      carBrand,
      carColor,
      carPlate,
      numSeats,
      carPhotoUrl,
      vehicleDocumentsFrontUrl,
      vehicleDocumentsBackUrl,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Car details saved successfully",
        data: {
          driverId,
          carBrand,
          carColor,
          carPlate,
          numSeats,
          carPhotoUrl,
          vehicleDocumentsFrontUrl,
          vehicleDocumentsBackUrl,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error processing car details:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
