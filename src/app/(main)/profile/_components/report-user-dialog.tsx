import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
    Flag,
    ShieldCheck,
    Check,
    Ban,
    MessageSquareWarning,
    CreditCard,
    CircleEllipsis,
    Star,
    Loader2,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    createReportSchema,
    ReportReason,
    ReportRequestDTO,
} from "@/lib/validators/report.schema";
import { addReportAsync } from "@/lib/actions/Report.actions";
import { getFullNameLatters } from "@/lib/services/userProfileService";

const MAX_DESCRIPTION = 1000;

const REASONS: ReportReason[] = ["Spam", "Harassment", "Fraud", "etc"];

const REASON_ICONS: Record<ReportReason, typeof Ban> = {
    Spam: Ban,
    Harassment: MessageSquareWarning,
    Fraud: CreditCard,
    etc: CircleEllipsis,
};

interface ReportUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reportedUserId: string;
    reportedUserName?: string;
    reportedUserImage?: string;
    reportedUserRating?: number;
}

export function ReportUserDialog({
    open,
    onOpenChange,
    reportedUserId,
    reportedUserName = "This driver",
    reportedUserImage,
    reportedUserRating,
}: ReportUserDialogProps) {
    const form = useForm<ReportRequestDTO>({
        resolver: zodResolver(createReportSchema),
        defaultValues: {
            reportedUserId: reportedUserId,
            description: "",
        },
    });

    const descriptionLength = form.watch("description")?.length || 0;

    // 3. Setup React Query Mutation
    const { mutate, isPending } = useMutation({
        mutationFn: (data: ReportRequestDTO) => addReportAsync(data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message, {
                    position: "top-right",
                    duration: 3000,
                });
                form.reset();
                onOpenChange(false);
            } else {
                toast.error(response.message ?? response.errors[0], {
                    position: "top-right",
                    duration: 3000,
                });
            }
        },
        onError: () => {
            toast.error("Something happened please try again later.");
        },
    });

    // 4. Form Submit Handler
    const onSubmit = (data: ReportRequestDTO) => {
        mutate(data);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isPending) onOpenChange(isOpen);
            }}
        >
            <DialogContent className="max-w-md gap-0 p-0 overflow-hidden">
                <DialogHeader className="items-center space-y-0 p-6 pb-4 text-center">
                    <Avatar className="size-20 border-4 border-background shadow-sm">
                        <AvatarImage
                            src={reportedUserImage}
                            alt={reportedUserName}
                        />
                        <AvatarFallback>
                            {getFullNameLatters(reportedUserName)}
                        </AvatarFallback>
                    </Avatar>
                    <DialogTitle className="text-lg">
                        {reportedUserName}
                    </DialogTitle>
                    {reportedUserRating != null && (
                        <div className="flex items-center gap-1 px-3 text-sm">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            {reportedUserRating ? (
                                <>
                                    <span className="font-medium">
                                        {reportedUserRating.toFixed(1)}
                                    </span>
                                    <span className="text-muted-foreground">
                                        Rating
                                    </span>
                                </>
                            ) : (
                                <span className="text-sm"> New </span>
                            )}
                        </div>
                    )}
                    <DialogDescription className="sr-only">
                        Report {reportedUserName} to our Trust &amp; Safety
                        team.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-5 px-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Reason
                            </Label>

                            <Controller
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <div
                                        role="radiogroup"
                                        aria-label="Report reason"
                                        className="grid grid-cols-2 gap-2"
                                    >
                                        {REASONS.map((reason) => {
                                            const Icon = REASON_ICONS[reason];
                                            const selected =
                                                field.value === reason;
                                            return (
                                                <button
                                                    key={reason}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={selected}
                                                    onClick={() =>
                                                        field.onChange(reason)
                                                    }
                                                    className={cn(
                                                        "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                        selected
                                                            ? "border-destructive bg-destructive/10 text-destructive font-medium"
                                                            : "border-input bg-background text-foreground hover:bg-accent",
                                                    )}
                                                >
                                                    <Icon className="size-4 shrink-0" />
                                                    <span className="flex-1 text-left">
                                                        {reason}
                                                    </span>
                                                    {selected && (
                                                        <Check className="size-4 shrink-0" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            />
                            {form.formState.errors.type && (
                                <p className="text-xs text-destructive font-medium">
                                    {form.formState.errors.type.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 min-w-0">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="report-description"
                                    className="text-sm font-medium"
                                >
                                    Description{" "}
                                    <span className="text-muted-foreground">
                                        (optional)
                                    </span>
                                </Label>
                            </div>

                            <Textarea
                                id="report-description"
                                placeholder="Provide additional context for your report..."
                                className="min-h-28 resize-none w-full wrap-break-word whitespace-pre-wrap"
                                {...form.register("description")}
                            />

                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                {form.formState.errors.description ? (
                                    <p className="text-destructive font-medium">
                                        {
                                            form.formState.errors.description
                                                .message
                                        }
                                    </p>
                                ) : (
                                    <span />
                                )}
                                <p>
                                    Max {MAX_DESCRIPTION} characters ·{" "}
                                    {descriptionLength}/{MAX_DESCRIPTION}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 rounded-lg bg-muted p-3 text-muted-foreground">
                            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                            <p className="text-xs">
                                Your identity is kept private. We will review
                                this user's activity and take action if our
                                guidelines are violated.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 p-6 pt-5 sm:gap-2">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            variant="default"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Flag className="size-4" />
                            )}
                            {isPending ? "Submitting..." : "Submit Report"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
