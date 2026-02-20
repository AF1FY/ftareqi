export enum DriverStatus {
  PENDING = "Pending",
  ACTIVE = "Active",
  REJECTED = "Rejected",
  SUSPENDED = "Suspended",
  PendingImageUpload = 'Pending Image Upload',
  ImageUploadFailed = 'Image Upload Failed',
  EXPIRED = 'Expired'
}

export enum CarColor {
  BLACK = "black",
  WHITE = "white",
  SILVER = "silver",
  GRAY = "gray",
  RED = "red",
  BLUE = "blue",
  GREEN = "green",
  YELLOW = "yellow",
  ORANGE = "orange",
  BROWN = "brown",
  BEIGE = "beige",
  GOLD = "gold",
  PURPLE = "purple",
}

export const CAR_COLORS_MAP: Record<CarColor, string> = {
  [CarColor.BLACK]: "Black",
  [CarColor.WHITE]: "White",
  [CarColor.SILVER]: "Silver",
  [CarColor.GRAY]: "Gray",
  [CarColor.RED]: "Red",
  [CarColor.BLUE]: "Blue",
  [CarColor.GREEN]: "Green",
  [CarColor.YELLOW]: "Yellow",
  [CarColor.ORANGE]: "Orange",
  [CarColor.BROWN]: "Brown",
  [CarColor.BEIGE]: "Beige",
  [CarColor.GOLD]: "Gold",
  [CarColor.PURPLE]: "Purple",
};

export interface DriverDetails {
  id: number,
  licenseExpiryDate: string,
  status: DriverStatus,
  createdAt: string,
  driverProfilePhoto: string,
  driverLicenseFront: string,
  driverLicenseBack: string
}

export interface CarDetails {
  Model: string;
  Color: string;
  Plate: string;
  LicenseExpiryDate: string;
  NumOfSeats: string;
  CarPhoto: File;
  CarLicenseFront: File;
  CarLicenseBack: File;
  CarLicenseExpiryDate?: string;
}

export interface DriverProfile {
  driverDetails: DriverDetails;
  carDetails: CarDetails;
}

export interface AuthResponse<T = null> {
  success: boolean;
  message: string;
  errors?: unknown[] | Record<string, string[]>;
  data?: T;
}