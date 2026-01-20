export interface DriverData {
  firstName: string
  lastName: string
  email: string
  phone: string
  profilePhotoUrl?: string
  driverLicenseUrl: string
}

export interface CarDetailsData {
  driverId: string
  carBrand: string
  carColor: string
  carPlate: string
  numSeats: number
  carPhotoUrl: string
  vehicleDocumentsUrl: string
}

export interface RegistrationResponse {
  success: boolean
  driverId?: string
  message: string
}
