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
                    ? "text-pale-sky/40 pointer-events-none"
                    : "dark:text-pale-sky text-black hover:bg-athens-gray"
                    }`}
                href={createPageURL(currentPage - 1)}
                aria-disabled={currentPage <= 1}
            >
                <i className='fa-solid fa-angle-left' />
            </Link>

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
                <Link
                    key={page}
                    href={createPageURL(page)}
                    className={`text-sm font-medium flex size-7 mx-1 rounded-full items-center justify-center transition-colors ${page === currentPage
                        ? "text-white bg-black dark:bg-lavender-gray"
                        : "dark:text-white text-black hover:bg-athens-gray"
                        }`}
                >
                    {page}
                </Link>
            ))}

            {totalPages > 3 && (
                <span className="text-sm font-normal flex size-9 items-center justify-center text-pale-sky">...</span>
            )}

            <Link
                className={`flex size-9 items-center justify-center rounded-lg transition-colors ${currentPage >= totalPages
                    ? "text-pale-sky/40 pointer-events-none"
                    : "dark:text-pale-sky text-black hover:bg-athens-gray"
                    }`}
                href={createPageURL(currentPage + 1)}
                aria-disabled={currentPage >= totalPages}
            >
                <i className='fa-solid fa-angle-right' />
            </Link>
        </nav>
    );
}