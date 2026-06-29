"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    AlertTriangle,
    Lock,
    Infinity as InfinityIcon,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import {
    createBanSchema,
    CreateBanDto,
    MAX_INT_DAYS,
} from "@/lib/validators/ban.schema";
import { banDriverAsync } from "@/lib/actions/Ban.Actions";

interface BanUserModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    driverId: string;
    userName?: string;
}

export function BanUserModal({
    isOpen,
    onOpenChange,
    driverId,
    userName = 'User',
}: BanUserModalProps) {
    const queryClient = useQueryClient();

    // 1. Setup React Hook Form
    const form = useForm<CreateBanDto>({
        resolver: zodResolver(createBanSchema),
        defaultValues: {
            description: "",
        },
    });

    const notesLength = form.watch("description")?.length || 0;

    // 2. Setup React Query Mutation
    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreateBanDto) => banDriverAsync(driverId, data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(`${userName} has been banned successfully.` , {duration: 3000 , position: 'top-right'});

                queryClient.invalidateQueries({ queryKey: ["driver-reports"] });
                queryClient.invalidateQueries({ queryKey: ["reports-list"] });

                form.reset();
                onOpenChange(false);
            } else {
                toast.error(response.message , {duration: 3000 , position: 'top-right'});
                if (response.errors?.length) {
                    response.errors.forEach((err) => toast.error(err));
                }
            }
        },
        onError: () => {
            toast.error('Operation failed' , {duration: 3000 , position: 'top-right'});
        },
    });

    const onSubmit = (data: CreateBanDto) => {
        mutate(data);
    };

    React.useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen, form]);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!isPending) onOpenChange(open);
            }}
        >
            <DialogContent className="max-w-md md:max-w-lg p-0 overflow-hidden border-destructive/20 shadow-lg shadow-destructive/10">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="p-6 pb-2">
                        <DialogHeader className="flex flex-row items-start gap-4 space-y-0 text-left">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 shrink-0">
                                <AlertTriangle className="w-6 h-6 text-destructive" />
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="text-xl font-semibold">
                                    Suspend User Account
                                </DialogTitle>
                                <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                                    This action will immediately revoke{" "}
                                    <span className="font-medium text-foreground">
                                        {userName}'s
                                    </span>{" "}
                                    access to the platform. Please specify the
                                    reason and duration.
                                </DialogDescription>
                            </div>
                        </DialogHeader>
                    </div>

                    <div className="p-6 pt-4 space-y-6">
                        {/* 1. Reason Selection */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="reason"
                                className="text-sm font-medium"
                            >
                                Reason for Suspension
                            </Label>
                            <Controller
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={isPending}
                                    >
                                        <SelectTrigger
                                            id="reason"
                                            className={`focus:ring-destructive ${form.formState.errors.type ? "border-destructive" : ""}`}
                                        >
                                            <SelectValue placeholder="Select a reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Spam">
                                                Spam or Unsolicited Promotions
                                            </SelectItem>
                                            <SelectItem value="Harassment">
                                                Harassment or Abusive Behavior
                                            </SelectItem>
                                            <SelectItem value="Fraud">
                                                Fraud or Scams
                                            </SelectItem>
                                            <SelectItem value="etc">
                                                Terms of Service Violation /
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {form.formState.errors.type && (
                                <p className="text-xs text-destructive font-medium">
                                    {form.formState.errors.type.message}
                                </p>
                            )}
                        </div>

                        {/* 2. Duration Selection */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Suspension Duration
                            </Label>
                            <Controller
                                control={form.control}
                                name="days"
                                render={({ field }) => (
                                    <RadioGroup
                                        value={field.value?.toString()}
                                        onValueChange={(val) =>
                                            field.onChange(Number(val))
                                        }
                                        disabled={isPending}
                                        className="grid grid-cols-2 gap-3"
                                    >
                                        {/* 1 Day */}
                                        <div>
                                            <RadioGroupItem
                                                value="1"
                                                id="duration-1d"
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor="duration-1d"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-destructive peer-data-[state=checked]:bg-destructive/5 cursor-pointer [&:has([data-state=checked])]:border-destructive"
                                            >
                                                <span className="text-sm font-medium">
                                                    24 Hours
                                                </span>
                                                <span className="text-xs text-muted-foreground mt-1">
                                                    1 Day
                                                </span>
                                            </Label>
                                        </div>

                                        {/* 1 Week */}
                                        <div>
                                            <RadioGroupItem
                                                value="7"
                                                id="duration-1w"
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor="duration-1w"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-destructive peer-data-[state=checked]:bg-destructive/5 cursor-pointer [&:has([data-state=checked])]:border-destructive"
                                            >
                                                <span className="text-sm font-medium">
                                                    1 Week
                                                </span>
                                                <span className="text-xs text-muted-foreground mt-1">
                                                    7 Days
                                                </span>
                                            </Label>
                                        </div>

                                        {/* 1 Month */}
                                        <div>
                                            <RadioGroupItem
                                                value="30"
                                                id="duration-1m"
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor="duration-1m"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-destructive peer-data-[state=checked]:bg-destructive/5 cursor-pointer [&:has([data-state=checked])]:border-destructive"
                                            >
                                                <span className="text-sm font-medium">
                                                    1 Month
                                                </span>
                                                <span className="text-xs text-muted-foreground mt-1">
                                                    30 Days
                                                </span>
                                            </Label>
                                        </div>

                                        {/* Permanent */}
                                        <div>
                                            <RadioGroupItem
                                                value={MAX_INT_DAYS.toString()}
                                                id="duration-perm"
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor="duration-perm"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-3 hover:bg-destructive/10 hover:border-destructive/50 peer-data-[state=checked]:border-destructive peer-data-[state=checked]:bg-destructive/10 cursor-pointer [&:has([data-state=checked])]:border-destructive group transition-colors"
                                            >
                                                <div className="flex items-center gap-1.5 text-destructive font-medium">
                                                    <InfinityIcon className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        Permanent
                                                    </span>
                                                </div>
                                                <span className="text-xs text-destructive/70 mt-1">
                                                    Lifetime Ban
                                                </span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                            {form.formState.errors.days && (
                                <p className="text-xs text-destructive font-medium">
                                    {form.formState.errors.days.message}
                                </p>
                            )}
                        </div>

                        {/* 3. Notes */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="notes"
                                className="text-sm font-medium"
                            >
                                Moderator Notes (Required/Optional)
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder="Provide context for this suspension..."
                                className="min-h-[100px] resize-none focus-visible:ring-destructive whitespace-pre-wrap wrap-break-word"
                                maxLength={1000}
                                disabled={isPending}
                                {...form.register("description")}
                            />
                            <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                                {form.formState.errors.description ? (
                                    <span className="text-destructive font-medium">
                                        {
                                            form.formState.errors.description
                                                .message
                                        }
                                    </span>
                                ) : (
                                    <span>
                                        This note is internal and will not be
                                        shown to the user.
                                    </span>
                                )}
                                <span>{notesLength}/1000</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 bg-muted/50 border-t border-border flex sm:justify-between items-center sm:space-x-0 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isPending}
                            className="w-full sm:w-auto shadow-sm shadow-destructive/20"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Lock className="w-4 h-4 mr-2" />
                            )}
                            {isPending ? "Suspending..." : "Confirm Suspension"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
