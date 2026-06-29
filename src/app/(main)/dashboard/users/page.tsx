"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import { getUsersAsync } from "@/lib/actions/Admin.actions";
import { formatDriverStatus } from "@/lib/services/moderatorService";
import { getFullDateFormatted } from "@/lib/services/walletService";
import { StatusStyles } from "@/types/Moderator";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

interface PageProps {
    searchParams: Promise<{
        PhoneNumber?: string;
        Page?: string;
        SortBy?: "CreatedAt";
        SortDescending?: string;
    }>;
}

export default function Page(props: PageProps) {
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [sortDescending, setSortDescending] = useState(false);
    const [sortBy] = useState("CreatedAt");

    useEffect(() => {
        const queryPhoneNumber = searchParams.get("PhoneNumber") ?? "";
        const queryPage = Number(searchParams.get("Page") ?? "1");

        setPhoneNumber(queryPhoneNumber);
        setPage(Number.isNaN(queryPage) ? 1 : queryPage);
    }, [searchParams]);

    const { data: res } = useQuery({
        queryKey: ["users", page, phoneNumber, sortBy, sortDescending],
        queryFn: async () => {
            return await getUsersAsync({
                PhoneNumber: phoneNumber,
                Page: page,
                SortBy: sortBy as "CreatedAt",
                SortDescending: sortDescending,
            });
        },
    });

    const totalPages = res?.data?.totalPages || 1;
    const toggleSortOrder = sortDescending ? "false" : "true";

    const users = useMemo(() => res?.data?.items ?? [], [res]);

    return (
        <div className="relative flex md:full-scn w-full bg-background-light dark:bg-background-dark font-display">
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />

            <div className="flex-1 p-6 lg:p-10">
                <div className="max-w-5xl mx-auto">
                    {/*//? Header & Search Section */}
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                                User Management
                            </h1>
                            <p className="text-pale-sky ps-1">
                                View and manage all users on the platform.
                            </p>
                        </div>
                        <div className="w-full sm:w-auto">
                            {/* Reusable Search Component */}
                            <SearchInput
                                value={phoneNumber}
                                onSearch={(value) => setPhoneNumber(value)}
                            />
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="w-full container">
                        <div className="overflow-hidden rounded-xl border border-athens-gray bg-background">
                            <table className="min-w-full">
                                <thead className="text-foreground text-md bg-athens-gray">
                                    <tr>
                                        <th className="w-[220px] px-6 py-4 text-left uppercase tracking-wider">
                                            Full Name
                                        </th>
                                        <th className="w-[180px] px-6 py-4 text-left uppercase tracking-wider">
                                            Phone Number
                                        </th>
                                        <th className="w-[200px] px-6 py-4 text-left uppercase tracking-wider group">
                                            {/* Interactive Sort Header */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSortDescending(
                                                        (prev) => !prev,
                                                    )
                                                }
                                                className="flex items-center gap-1 cursor-pointer group"
                                            >
                                                <span>Created At</span>
                                                <i
                                                    className={`fa-solid group-hover:text-foreground transition-colors duration-300 ${sortDescending ? "fa-sort-down mb-2" : "fa-sort-up mt-2"}`}
                                                />
                                            </button>
                                        </th>
                                        <th className="w-[170px] px-6 py-4 text-left uppercase tracking-wider">
                                            Driver Status
                                        </th>
                                        <th className="w-[100px] relative px-6 py-3">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-athens-gray text-txt-secondary">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-8 text-center"
                                            >
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-white-athens-gray transition-colors cursor-pointer"
                                            >
                                                <td className="w-[220px] px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {user.fullName}
                                                </td>
                                                <td className="w-[180px] px-6 py-4 whitespace-nowrap text-sm">
                                                    {user.phoneNumber}
                                                </td>
                                                <td className="w-[200px] px-6 py-4 whitespace-nowrap text-sm">
                                                    {getFullDateFormatted(
                                                        user.createdAt,
                                                    )}
                                                </td>
                                                <td className="w-[170px] px-6 py-4 whitespace-nowrap">
                                                    {/* Dynamic Status Badge */}
                                                    <span
                                                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${StatusStyles[user.driverStatus ?? "none"]}`}
                                                    >
                                                        {formatDriverStatus(
                                                            user.driverStatus,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="w-[100px] px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        className="hover:text-dodger-blue transition-colors duration-200"
                                                        href={`/dashboard/users/${user.id}`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Section */}
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
                        <p className="text-sm text-pale-sky ps-1">
                            Showing{" "}
                            <span className="text-foreground font-medium">
                                {(page - 1) * 10 + 1}
                            </span>{" "}
                            to{" "}
                            <span className="text-foreground font-medium">
                                {Math.min(
                                    page * 10,
                                    res?.data?.totalCount ?? 0,
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="text-foreground font-medium">
                                {res?.data?.totalCount ?? 0}
                            </span>{" "}
                            results
                        </p>

                        {totalPages > 1 && (
                            <Pagination className="mx-0 w-full sm:w-auto justify-end">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={(event) => {
                                                event.preventDefault();
                                                setPage(Math.max(1, page - 1));
                                            }}
                                            className={
                                                page === 1
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>

                                    <PaginationItem>
                                        <span className="text-sm font-medium mx-2 sm:mx-4">
                                            Page {page} of {totalPages}
                                        </span>
                                    </PaginationItem>

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={(event) => {
                                                event.preventDefault();
                                                setPage(
                                                    Math.min(
                                                        totalPages,
                                                        page + 1,
                                                    ),
                                                );
                                            }}
                                            className={
                                                page >= totalPages
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
