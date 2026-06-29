import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import React from "react";

const DriverProfileModalSkeleton = () => {
  return (
    <div className="flex flex-col items-center mt-2 w-full animate-pulse">
      {/* صورة السائق الوهمية */}
      <Skeleton className="h-24 w-24 rounded-full border-4 border-background shadow-sm -mt-12 mb-3" />

      {/* الاسم وتاريخ الانضمام الوهمي */}
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-32 mb-6" />

      {/* الإحصائيات الوهمية */}
      <div className="flex w-full items-center justify-center gap-6 mt-6">
        <div className="flex flex-col items-center gap-2 flex-1">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>

        <Separator orientation="vertical" className="h-10" />

        <div className="flex flex-col items-center gap-2 flex-1">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      <Separator className="my-6 w-full" />

      {/* تفاصيل المركبة الوهمية */}
      <div className="w-full flex flex-col gap-3">
        <Skeleton className="h-3 w-24 mb-1" />
        <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-xl border border-border/50">
          <Skeleton className="h-16 w-24 rounded-lg" />
          <div className="flex flex-col gap-2 flex-1 justify-center">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfileModalSkeleton;
