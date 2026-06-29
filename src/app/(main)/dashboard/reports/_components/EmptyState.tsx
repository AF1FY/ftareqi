import { SearchX } from 'lucide-react';
export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-md border-dashed border-border">
      <div className="h-20 w-20 bg-pale-sky/20 rounded-full flex items-center justify-center mb-6">
        <SearchX className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No reports found</h3>
      <p className="text-txt-secondary max-w-sm">
        There are no reports matching your current filters. Try adjusting the status or reason filters to see more results.
      </p>
    </div>
  );
};