import * as z from "zod";

const textReview = z.string("Review can't be empty").max(500, "Review text can't exceed 500 characters.");
const stars = z.number('Stars are required').min(1, "Stars can't be less than 1.").max(5, "Stars can't be more than 5.");


export const reviewSchemaAPI = z.object({
    rideBookingId: z.number('Ride booking id is required').min(1),
    textReview,
    stars
})

export const updateReviewSchemaAPI = z.object({
    textReview,
    stars
})

export const updateReviewBody = z.object({
    reviewId: z.number,
    textReview,
    stars
})

export type ReviewSchemaAPI = z.infer<typeof reviewSchemaAPI>;
export type UpdateReviewSchemaAPI = z.infer<typeof updateReviewSchemaAPI>;
export type UpdateReviewBodyType = z.infer<typeof updateReviewBody>;