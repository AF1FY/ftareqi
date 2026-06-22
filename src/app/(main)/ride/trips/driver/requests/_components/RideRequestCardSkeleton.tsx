import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function RideRequestCardSkeleton() {
  return (
    <Card className="flex h-full flex-col border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        <div className="relative">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1">
              <Skeleton className="h-3 w-3 rounded-full" />
              <div className="my-1 h-6 w-px bg-border" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-6.5">
              <Skeleton className="h-4 w-full max-w-60" />
              <Skeleton className="h-4 w-full max-w-[210px]" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-10" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-10" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex gap-4 border-t bg-muted/20 pt-4">
        <Skeleton className="h-10 w-1/2 rounded-md" />
        <Skeleton className="h-10 w-1/2 rounded-md" />
      </CardFooter>
    </Card>
  );
}
