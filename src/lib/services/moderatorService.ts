import { CAR_COLORS_MAP, CarDetailsType, DriverDetailsType, DriverProfileDetails, DriverStatus } from "@/types/Moderator"

export function mapToCarDetails(obj?:DriverProfileDetails):CarDetailsType{
    return{
        model: obj?.model ?? "Model is undefined",
        color: obj?.color ?? "Color is undefined",
        plate: obj?.plate ?? "Plate is undefined",
        numOfSeats: obj?.numOfSeats ?? 2,
        carPhoto: obj?.carPhoto ?? "",
        carLicenseFront: obj?.carLicenseFront ?? "",
        carLicenseBack: obj?.carLicenseBack ?? "",
    }
}
export function mapToDriverDetails(obj?:DriverProfileDetails):DriverDetailsType{
    return{
        fullName: obj?.fullName ?? "Full name is unknown",
        phoneNumber: obj?.phoneNumber ?? "Phone number is unknown",
        driverStatus: obj?.driverStatus ?? DriverStatus.Pending,
        driverLicenseExpiryDate: obj?.driverLicenseExpiryDate ?? new Date().toISOString(),
        profileCreationDate: obj?.profileCreationDate ?? new Date().toISOString(),
        driverPhoto: obj?.driverPhoto ?? "",
        driverLicenseFront: obj?.driverLicenseFront ?? "",
        driverLicenseBack: obj?.driverLicenseBack ?? "",
    }
}
export const getCarColorHex = (colorName: string): string => {
    if (!colorName) return '#E5E7EB';
    const normalizedName = colorName.toLowerCase().trim();
    return CAR_COLORS_MAP[normalizedName] || normalizedName;
};