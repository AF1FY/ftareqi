import * as z from 'zod'

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);

const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 100);

export const registerSchema = z.object({
    fullName: z.string("Full Name is required").min(7, "Full name must be at least 7 characters"),
    phone: z.string().regex(/^(01[0125])[0-9]{8}$/, "Invalid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."),
    gender: z.enum(['male', 'female'], {
        error: () => ({ message: "You must select gender" })
    }),
    dateOfBirth: z.date({
        error: "Invalid date",
    })
        .min(minDate, { message: "You should be dead" })
        .max(maxDate, { message: "يجب أن يكون عمرك 18 عامًا على الأقل" }),
    role: z.enum(['passenger', 'driver'], {
        error: () => ({ message: "You must select role" })
    })
})

export type RegisterSchemaType = z.infer<typeof registerSchema>