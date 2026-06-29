import React from "react";
import { Star, MessageSquareOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAllTripReviewsAsync } from "@/lib/actions/Review.actions";
import { getDateFormatted, getFullDateFormatted } from "@/lib/services/walletService";

export type ReviewsModalState = "loading" | "populated" | "empty";

//? Custom hook
function useRideAllReviews(rideId: number, isOpen: boolean) {
  return useQuery({
    queryKey: ["rideReviews", rideId],
    queryFn: () => getAllTripReviewsAsync(rideId),
    enabled: isOpen && !!rideId, 
    staleTime: 1000 * 60 * 5, 
  });
}

interface RideReviewsListModalProps {
  rideId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RideReviewsListModal({
  rideId,
  isOpen,
  onOpenChange,
}: RideReviewsListModalProps) {

  // استدعاء الـ Hook
  const { data: response, isLoading } = useRideAllReviews(rideId, isOpen);

  // تحديد الحالة بناءً على الـ Response
  // لو نجح وفي داتا -> populated
  // لو الـ success false ورسالة معينة أو مفيش داتا -> empty
  let state: "loading" | "populated" | "empty" = "loading";
  
  if (isLoading) {
    state = "loading";
  } else if (
    response?.success === false && 
    response?.message === "No reviews found for this ride"
  ) {
    state = "empty";
  } else if (response?.success && response.data && response.data.length > 0) {
    state = "populated";
  } else if (response) {
    // Fallback لو راجع فاضي بس نجح
    state = "empty";
  }

  const reviews = response?.data || [];

  // دالة مساعدة لعمل الـ Initials (أول حرفين من الاسم)
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`size-4 ${
              rating >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 stroke-1"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[80vh] flex flex-col gap-0 p-0 overflow-hidden">
        
        {/* Sticky Header */}
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle>Trip Reviews</DialogTitle>
            <DialogDescription>
              See what passengers had to say about this trip.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Separator />

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1 p-6 pt-0">
          <div className="py-4">
            
            {state === "loading" && (
              <div className="flex flex-col gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-full shrink-0" />
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-24 rounded-sm" />
                          <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Skeleton key={star} className="size-4 rounded-sm" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <Skeleton className="h-3 w-16 mt-1 rounded-sm" />
                    </div>
                    <div className="flex flex-col gap-2 pl-[52px]">
                      <Skeleton className="h-3 w-full rounded-sm" />
                      <Skeleton className="h-3 w-4/5 rounded-sm" />
                    </div>
                    {i !== 3 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            )}

            {state === "populated" && (
              <div className="flex flex-col gap-6">
                {reviews.map((review, index) => (
                  <div key={review.id} className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      {/* <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-slate-100 text-slate-700 font-medium text-sm">
                            {getInitials(review.riderName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{review.riderName}</p>
                          </div>
                          </div> */}
                      <span>
                          {renderStars(review.stars)}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {getFullDateFormatted(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 ps-0.5">
                      {review.textReview}
                    </p>
                    {index !== reviews.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {state === "empty" && (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <MessageSquareOff className="size-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-slate-900">No reviews yet</h3>
                <p className="text-sm text-gray-500 max-w-[250px]">
                  Passengers haven't left any feedback for this trip.
                </p>
              </div>
            )}

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}