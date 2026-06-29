import React, { StrictMode, useEffect, useState } from "react";
import { Star, Trash, Loader2, Type } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    reviewSchemaAPI,
    ReviewSchemaAPI,
    UpdateReviewBodyType,
    UpdateReviewSchemaAPI,
} from "@/lib/validators/review.schema";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useRideReview } from "../_hooks/useReviewHook";

interface RideReviewModalProps {
    rideBookingId: number;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

type ModalStateType = "loading" | "edit" | "create";

export function RideReviewModal({
    rideBookingId,
    isOpen,
    onOpenChange,
}: RideReviewModalProps) {
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [modalState, setModalState] = useState<ModalStateType>("loading");

    //? Calls custom hook
    const {
        reviewResponse,
        isFetchingReview,
        isCreating,
        isUpdating,
        isDeleting,
        createReview,
        updateReview,
        deleteReview,
    } = useRideReview(rideBookingId, isOpen);

    useEffect(() => {
        if (isFetchingReview) {
            setModalState("loading");
        } else if (reviewResponse) {
            setModalState("edit");
        } else {
            setModalState("create");
        }
    }, [isFetchingReview, reviewResponse]);

    //? React Hook Form
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ReviewSchemaAPI>({
        resolver: zodResolver(reviewSchemaAPI),
        defaultValues: {
            rideBookingId: rideBookingId,
            stars: 1,
            textReview: "",
        },
    });

    useEffect(() => {
        if (reviewResponse && !isFetchingReview) {
            reset({
                rideBookingId: rideBookingId,
                stars: reviewResponse.stars,
                textReview: reviewResponse.textReview,
            });
        } else if (!reviewResponse && !isFetchingReview) {
            reset({
                rideBookingId: rideBookingId,
                stars: 0,
                textReview: "",
            });
        }
    }, [reviewResponse, isFetchingReview, rideBookingId, reset]);

    const onSubmit = (data: UpdateReviewSchemaAPI | ReviewSchemaAPI) => {
        if (modalState === "edit") {
            updateReview(
                {
                    reviewId: reviewResponse?.id,
                    ...data,
                } as UpdateReviewBodyType,
                { onSuccess: () => onOpenChange(false) },
            );
        } else {
            createReview(data as ReviewSchemaAPI, {
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    const handleDelete = () => {
        if (reviewResponse?.id) {
            deleteReview(reviewResponse.id, {
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    const isPending = isCreating || isUpdating || isDeleting;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md gap-4 p-6" dir="ltr">
                <DialogHeader>
                    <DialogTitle>
                        {modalState === "loading" && "Ride Review"}
                        {modalState === "create" && "Rate Your Ride"}
                        {modalState === "edit" && "Your Review"}
                    </DialogTitle>
                    {modalState !== "loading" && (
                        <DialogDescription>
                            {modalState === "create" &&
                                "How was your trip? Please leave a rating and review."}
                            {modalState === "edit" &&
                                "You can update your rating and feedback, or remove it entirely."}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 py-2"
                >
                    {modalState === "loading" ? (
                        <>
                            {/* Skeletons for Loading State */}
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton
                                        key={i}
                                        className="size-8 rounded-full"
                                    />
                                ))}
                            </div>
                            <Skeleton className="h-24 w-full rounded-md" />
                            <Skeleton className="h-10 w-full rounded-md mt-4" />
                        </>
                    ) : (
                        <>
                            {/* Star Rating Controller */}
                            <div className="flex flex-col gap-1">
                                <Controller
                                    name="stars"
                                    control={control}
                                    render={({ field }) => (
                                        <div
                                            className="flex items-center gap-2"
                                            onMouseLeave={() =>
                                                setHoverRating(0)
                                            }
                                        >
                                            {[1, 2, 3, 4, 5].map((star) => {
                                                const isFilled =
                                                    (hoverRating ||
                                                        field.value) >= star;
                                                return (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm transition-colors disabled:opacity-50"
                                                        disabled={isPending}
                                                        onClick={() =>
                                                            field.onChange(star)
                                                        }
                                                        onMouseEnter={() =>
                                                            setHoverRating(star)
                                                        }
                                                    >
                                                        <Star
                                                            className={`size-8 transition-all ${
                                                                isFilled
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-muted-foreground"
                                                            }`}
                                                        />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                />
                                {errors.stars && (
                                    <span className="text-xs text-destructive">
                                        {errors.stars.message}
                                    </span>
                                )}
                            </div>

                            {/* Text Review Input */}
                            <div className="flex flex-col gap-1">
                                <Textarea
                                    placeholder="Tell us about your experience..."
                                    className="resize-none h-24"
                                    disabled={isPending}
                                    {...register("textReview")}
                                />
                                {errors.textReview && (
                                    <span className="text-xs text-destructive">
                                        {errors.textReview.message}
                                    </span>
                                )}
                                {modalState === "edit" &&
                                    reviewResponse?.updatedAt && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Last updated:{" "}
                                            {new Date(
                                                reviewResponse.updatedAt,
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                            </div>
                        </>
                    )}

                    {/* Footer Actions */}
                    {modalState !== "loading" && (
                        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2 mt-4">
                            {modalState === "create" ? (
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isPending}
                                >
                                    {isCreating && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Submit Review
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isPending}
                                        onClick={handleDelete}
                                        className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive hover:text-white"
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash className="size-4 mr-2" />
                                        )}
                                        Delete
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="w-full sm:w-auto"
                                        disabled={isPending}
                                    >
                                        {isUpdating && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Update Review
                                    </Button>
                                </>
                            )}
                        </DialogFooter>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
