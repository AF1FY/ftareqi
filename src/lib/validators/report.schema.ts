import { z } from "zod";

export const ReportReasonEnum = z.enum(["Spam", "Harassment", "Fraud", "etc"], {
  error: (issue) => 
    issue.input === undefined 
      ? "Report type is required." 
      : "Invalid report type selected.",
});

export const createReportSchema = z.object({
  reportedUserId: z
    .string({ 
      error: (issue) => 
        issue.input === undefined 
          ? "Reported user id is required." 
          : "Invalid user ID format."
    })
    .min(1, { error: "Reported user id is required." }), 

  type: ReportReasonEnum,

  description: z
    .string()
    .max(1000, { error: "Description cannot exceed 1000 characters." }) 
    .optional(),
});

export type ReportRequestDTO = z.infer<typeof createReportSchema>;
export type ReportReason = z.infer<typeof ReportReasonEnum>;