import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewSchemaAPI, UpdateReviewBodyType, UpdateReviewSchemaAPI } from "@/lib/validators/review.schema";
import {
    addReviewAsync,
    updateReviewAsync,
    deleteReviewAsync,
    getReviewByBookingIdAsync,
} from "@/lib/actions/Review.actions";
import { toast } from "sonner";
import { IReview } from "@/types/Review";

export const useRideReview = (rideBookingId: number, isOpen: boolean) => {
    const queryClient = useQueryClient();
    const queryKey = ["rideReview", rideBookingId];

    // 1. Fetch existing review (Only if Modal is open)
    const { data, isLoading: isFetchingReview } = useQuery({
        queryKey,
        queryFn: () => getReviewByBookingIdAsync(rideBookingId),
        enabled: isOpen && !!rideBookingId,
        staleTime: 1000 * 60 * 5,
    });

    const reviewResponse: IReview | undefined = data?.data;

    // 2. Create Review Mutation
    const createMutation = useMutation({
        mutationFn: (data: ReviewSchemaAPI) => addReviewAsync(data),
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res.message, {
                    position: "top-right",
                    duration: 3000,
                });
                queryClient.invalidateQueries({ queryKey });
            } else {
                toast.error(res.message || res.errors[0], {
                    position: "top-right",
                    duration: 3000,
                });
            }
        },
    });

    // 3. Update Review Mutation
    const updateMutation = useMutation({
        mutationFn: (data: UpdateReviewBodyType) => updateReviewAsync(data),
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res.message, {
                    position: "top-right",
                    duration: 3000,
                });
                queryClient.invalidateQueries({ queryKey });
            } else {
                toast.error(res.message || res.errors[0], {
                    position: "top-right",
                    duration: 3000,
                });
            }
        },
    });

    // 4. Delete Review Mutation
    const deleteMutation = useMutation({
        mutationFn: (reviewId: number) => deleteReviewAsync(reviewId),
        onSuccess: (res) => {
            if (res.success) {
                toast.success('Review has been deleted', {
                    position: "top-right",
                    duration: 3000,
                });
                // Reset query data so it switches back to "create" mode
                queryClient.setQueryData(queryKey, null);
                queryClient.invalidateQueries({ queryKey });
            } else {
                toast.error(res.message || res.errors[0], {
                    position: "top-right",
                    duration: 3000,
                });
            }
        },
    });

    return {
        reviewResponse,
        isFetchingReview,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        createReview: createMutation.mutate,
        updateReview: updateMutation.mutate,
        deleteReview: deleteMutation.mutate,
    };
};
