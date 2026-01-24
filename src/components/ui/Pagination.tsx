// Pagination.tsx
"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
    totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const currentPage = Number(searchParams.get("Page")) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("Page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center">
            <Link
                className={`flex size-9 items-center justify-center rounded-lg transition-colors ${currentPage <= 1
                        ? "text-slate-300 pointer-events-none"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                href={createPageURL(currentPage - 1)}
                aria-disabled={currentPage <= 1}
            >
                <span className="sr-only">Previous</span>
                <span className="material-symbols-outlined text-xl">chevron_left</span>
            </Link>

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
                <Link
                    key={page}
                    href={createPageURL(page)}
                    className={`text-sm font-medium flex size-9 items-center justify-center rounded-lg transition-colors ${page === currentPage
                            ? "text-white bg-primary"
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                >
                    {page}
                </Link>
            ))}

            {totalPages > 3 && (
                <span className="text-sm font-normal flex size-9 items-center justify-center text-slate-500 dark:text-slate-400">...</span>
            )}

            <Link
                className={`flex size-9 items-center justify-center rounded-lg transition-colors ${currentPage >= totalPages
                        ? "text-slate-300 pointer-events-none"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                href={createPageURL(currentPage + 1)}
                aria-disabled={currentPage >= totalPages}
            >
                <span className="sr-only">Next</span>
                <span className="material-symbols-outlined text-xl">chevron_right</span>
            </Link>
        </nav>
    );
}