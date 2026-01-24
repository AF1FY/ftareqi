export enum DriverStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  SUSPENDED = "suspended",
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
  DriverProfilePhoto?: File | null;
  DriverLicenseFront: File;
  DriverLicenseBack: File;
  LicenseExpiryDate: string;
}

export interface CarDetails {
  Model: string;
  Color: string;
  Plate: string;
  LicenseExpiryDate: string;          // ← موجود في Swagger للـ car
  NumOfSeats: string;                 // ← غيرته string عشان يتطابق مع الـ input
  CarPhoto: File;
  CarLicenseFront: File;
  CarLicenseBack: File;
  CarLicenseExpiryDate?: string;      // ← اختياري لو عايزة تضيفيه لاحقًا
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