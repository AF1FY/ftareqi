'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPendingDriversAsync } from '@/lib/actions/Moderator.actions';
import { useRouter } from 'next/navigation';

export default function DriversRequestsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [descending, setDescending] = useState(true);
  const router = useRouter();

  // 1. إضافة refetch لاستخدامه في زر "Try Again"
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['pendingDrivers', page, pageSize, descending],
    queryFn: async () => {
      try {
        const response = await getPendingDriversAsync({ page, pageSize, descending });
        if (!response.success) {
          throw new Error(response.errors?.join(', ') || response.message || 'Unknown Error');
        }
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    keepPreviousData: true,
  });

  const toggleSort = () => {
    setDescending(!descending);
    setPage(1);
  };

  const getPageNumbers = () => {
    const totalPages = data?.totalPages || 1;
    const pageNumbers = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (page <= 4) {
        pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (page >= totalPages - 3) {
        pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="container">
        {/*//* Header */}
        <div className="flex flex-col md:flex-row gap-y-2 md:gap-y-0 items-start justify-between md:items-center-safe mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pending Driver Requests</h1>
            <p className='text-pale-sky ms-1'>View and manage all driver profiles in the system.</p>
          </div>
          {/*//! Hiding counter if there is error */}
          {!isLoading && !isError && (
            <span className="bg-dodger-blue text-white text-xs font-semibold px-2 py-1 rounded">
              Total requests: {data?.totalCount || 0}
            </span>
          )}
        </div>

        {/*//* Content Area (Error or Table) */}
        <div className="shadow-sm rounded-lg border border-athens-gray overflow-hidde mb-6 bg-background">

          {/*//! 1. Error State Message */}
          {isError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-red-50 p-4 rounded-full mb-3">
                <i className="fa-solid fa-triangle-exclamation text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">Failed to load data</h3>
              <p className="text-pale-sky text-sm mb-5 max-w-sm">
                {error instanceof Error ? error.message : "Something went wrong while fetching the requests."}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-white border border-athens-gray text-pale-sky hover:text-dodger-blue hover:border-dodger-blue rounded-md transition-all text-sm font-medium"
              >
                <i className="fa-solid fa-rotate-right mr-2"></i>
                Try Again
              </button>
            </div>
          ) : (
            /*//* 2. Table Area */
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-athens-gray">
                <thead className="bg-athens-gray/10">
                  <tr className='uppercase tracking-wider'>
                    <th className="px-6 py-3 text-left w-1/3">Full Name</th>
                    <th className="px-6 py-3 text-left w-1/3">Phone Number</th>
                    <th
                      className="px-6 py-3 text-left cursor-pointer group select-none w-1/3"
                      onClick={!isLoading ? toggleSort : undefined}
                    >
                      <div className="flex items-center">
                        Request Date
                        {!isLoading && (
                          <span className="ms-1 flex text-pale-sky group-hover:text-dodger-blue">
                            <i className={`fa-solid fa-angle-${descending ? 'down' : 'up'}`}></i>
                            <span className='text-dodger-blue w-11 ms-1 capitalize text-xs opacity-0 group-hover:opacity-100 transition-all duration-200'>
                              {descending ? 'Newest' : 'Oldest'}
                            </span>
                          </span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-athens-gray">
                  {isLoading ? (
                    //* Skeleton on loading
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={`skeleton-${index}`} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 bg-athens-gray rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-athens-gray/40 rounded w-1/2"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-athens-gray rounded w-1/2"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-athens-gray rounded w-2/3"></div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    //* Actual Data
                    data?.items?.map((driver) => (
                      <tr
                        key={driver.driverProfileId}
                        className="hover:bg-athens-gray/30 transition-colors text-sm text-pale-sky cursor-pointer whitespace-nowrap"
                        onClick={() => { router.push(`/dashboard/drivers/${driver.driverProfileId}`) }}
                      >
                        <td className="px-6 py-4 font-medium text-foreground">{driver.fullName}</td>
                        <td className="px-6 py-4 font-mono">{driver.phoneNumber}</td>
                        <td className="px-6 py-4">
                          {new Date(driver.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                        </td>
                      </tr>
                    ))
                  )}
                  {/*//~ Empty State */}
                  {!isLoading && data?.items?.length === 0 && (
                    <tr>
                      <td colSpan={3} className="flex-col px-6 py-12 text-center text-pale-sky rounded-b-full">
                        <i className="block mb-4 text-4xl fa-regular fa-folder-open"></i>
                        <div>No pending requests found.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/*//* Pagination */}
        {!isLoading && !isError && data?.items?.length! > 0 && (
          <div className="flex justify-center-safe md:justify-end-safe items-center gap-2 select-none">
            {/* Previous Button */}
            <button
              onClick={() => setPage(old => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="size-8 flex bg-white-athens-gray not-disabled:hover:cursor-pointer items-center justify-center rounded-full not-disabled:hover:bg-athens-gray transition-all duration-200 disabled:opacity-50"
            >
              <i className="fa-solid fa-angle-left"></i>
            </button>
            <div className="flex items-center gap-1.5 px-2 py-1">
              {getPageNumbers().map((pageNum, index) => {
                if (pageNum === '...') {
                  return <span key={`dots-${index}`} className="px-2 text-pale-sky">...</span>;
                }
                const isCurrent = page === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(Number(pageNum))}
                    className={`
                      size-7 flex items-center justify-center rounded-full text-sm font-medium transition-all
                      ${isCurrent
                        ? 'bg-dodger-blue text-white shadow-md transform scale-105'
                        : 'hover:bg-athens-gray cursor-pointer text-pale-sky'
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            {/* Next Button */}
            <button
              onClick={() => {
                if (data && page < data.totalPages) setPage(old => old + 1);
              }}
              disabled={data ? page >= data.totalPages : true}
              className="size-8 flex bg-white-athens-gray not-disabled:hover:cursor-pointer items-center justify-center rounded-full not-disabled:hover:bg-athens-gray transition-all duration-200 disabled:opacity-50"
            >
              <i className="fa-solid fa-angle-right"></i>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}