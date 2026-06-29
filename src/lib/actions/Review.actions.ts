'use server'
import { deleteByIDAsync, getDataAsync, getPaginatedDataAsync, postDataAsync, updateDataAsync } from "./Base.actions";
import { ReviewSchemaAPI, UpdateReviewBodyType, UpdateReviewSchemaAPI } from "../validators/review.schema";
import { IReview } from "@/types/Review";

const BASE_API = 'api/reviews';

//* User adds a review
export const addReviewAsync = async (body: ReviewSchemaAPI) =>
    postDataAsync<undefined, ReviewSchemaAPI>(BASE_API, body, 'Failed to make review.');

//^ Updates Review
export const updateReviewAsync = async (data: UpdateReviewBodyType) => 
    updateDataAsync<undefined, UpdateReviewSchemaAPI>(`${BASE_API}/${data.reviewId}`, { textReview: data.textReview, stars: data.stars });

//! Delete review
export const deleteReviewAsync = async (reviewId: number) =>
    deleteByIDAsync<undefined>(`${BASE_API}`, reviewId, 'Failed to delete review.');

//? Get review by id
export const getReviewByBookingIdAsync = async (reviewId: number) =>
    getDataAsync<IReview, undefined>(`${BASE_API}/ride-booking/${reviewId}`);

//? Get all trip's reviews for a driver
export const getAllTripReviewsAsync = async (rideId: number) =>
    getDataAsync<IReview[], undefined>(`${BASE_API}/ride/${rideId}/all`);