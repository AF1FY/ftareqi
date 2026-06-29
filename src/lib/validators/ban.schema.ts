import { z } from "zod";
import { ReportReasonEnum } from "./report.schema";

export const MAX_INT_DAYS = 2147483647;

export const createBanSchema = z.object({
    type: ReportReasonEnum,

    days: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Please select a ban duration."
                    : "Invalid duration format.",
        })
        .int({ error: "Days must be an integer." })
        .positive({ error: "Days must be a positive number." }),

    description: z
        .string()
        .max(1000, { error: "Description cannot exceed 1000 characters." })
        .optional(),
});

export type CreateBanDto = z.infer<typeof createBanSchema>;

export const BAN_DURATIONS = [
    { label: "1 Day", value: 1 },
    { label: "1 Week", value: 7 },
    { label: "1 Month", value: 30 },
    { label: "Permanent (Lifetime)", value: MAX_INT_DAYS },
];
