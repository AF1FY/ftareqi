import * as z from "zod";

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);

const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 80);

const phoneNumber = z
  .string("Phone number is required.")
  .regex(/^(0?1[0125])[0-9]{8}$/, "Invalid phone number.")
  .transform((phone) => formatPhoneNumber(phone));
const password = z
  .string("Password is required.")
  .min(8, "Password must be at least 8 characters.")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
  );
const otp = z.string("OTP is required.").length(6);

export const registerSchemaAPI = z.object({
  fullName: z
    .string("Full Name is required.")
    .min(7, "Full name must be at least 7 characters.")
    .max(100, "Full name can't bee more than 100 characters."),
  phoneNumber,
  password,
  gender: z.number("Gender is required").min(1).max(2),
  dateOfBirth: z
    .date({
      error: "Invalid date",
    })
    .min(minDate, "You should be dead")
    .max(maxDate, "You must be at least 18 years old"),
});

export const registerSchema = registerSchemaAPI.extend({
  role: z.number("Role is required").min(1).max(2),
});

export const loginSchema = z.object({
  phoneNumber,
  password,
});

export const verifyOtpSchema = z.object({
  otp,
  phoneNumber,
});
export const requestOTP = z.object({
  phoneNumber,
});
export const resetPasswordDTOSchema = z
  .object({
    newPassword: password,
    confirmPassword: password,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const resetPasswordSchema = loginSchema.extend({
  resetToken: z.string("Reset token is required"),
});
export type VerifyOTPSchemaType = z.infer<typeof verifyOtpSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type RegisterSchemaAPIType = z.infer<typeof registerSchemaAPI>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RequestOTPSchemaType = z.infer<typeof requestOTP>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordDTOSchemaType = z.infer<typeof resetPasswordDTOSchema>;

export const formatPhoneNumber = (phone: string) =>
  phone.startsWith("0") ? `+2${phone}` : `+20${phone}`;

export function mapToRegistration(
  user: RegisterSchemaType
): RegisterSchemaAPIType {
  return {
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    password: user.password,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
  };
}
