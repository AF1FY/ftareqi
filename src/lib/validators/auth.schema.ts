import * as z from 'zod'

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);

const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 80);

const phoneNumber = z.string('Phone number is required.')
    .regex(/^(01[0125])[0-9]{8}$/, "Invalid phone number.");
const password = z.string('Password is required.')
    .min(8, "Password must be at least 8 characters.")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/, "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
const otpCode = z.string("OTP is required.").length(6);

export const registerSchema = z.object({
    fullName: z.string("Full Name is required.")
        .min(7, "Full name must be at least 7 characters.")
        .max(100, "Full name can't bee more than 100 characters."),
    phoneNumber,
    password,
    gender: z.number("Gender is required").min(1).max(2),
    dateOfBirth: z.date({
        error: "Invalid date",
    })
        .min(minDate, "You should be dead")
        .max(maxDate, "You must be at least 18 years old"),
    //     role: z.enum(['passenger', 'driver'], {
    //     error: "You must select role"
    // })
});

export const loginSchema = z.object({
    phoneNumber,
    password
});

export const verifyPhoneNumberSchema = z.object({
    phoneNumber,
    otpCode
});
export const resetPassword = z.object({
    phoneNumber
})
export type VerifyPhoneNumberSchemaType = z.infer<typeof verifyPhoneNumberSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type ResetPassword = z.infer<typeof resetPassword>;