import { SearchX } from "lucide-react";

interface EmptyRequestsProps {
  title?: string;
  description?: string;
}

export function EmptyRequests({
  title = "No requests found",
  description = "You don't have any requests in this category right now.",
}: EmptyRequestsProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <SearchX
        className="mb-6 h-16 w-16 text-muted-foreground/50"
        strokeWidth={1.5}
      />
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
