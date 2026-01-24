// import Pagination from "@/components/ui/Pagination";
// import SearchInput from "@/components/ui/SearchInput"; // The component we made above
// import { getUsersAsync } from "@/lib/actions/Admin.actions";
// import { StatusStyles } from "@/types/Moderator";
// import { IUsersParams } from "@/types/User";
// import Link from "next/link";

// export default async function UserManagementPage(searchParams: IUsersParams) {
//     // 1. Extract and normalize search parameters
//     const phoneNumber = searchParams?.PhoneNumber ?? "";
//     const page = Number(searchParams?.Page) ?? 1;
//     const sortBy = searchParams?.SortBy || "CreatedAt";
//     const sortDescending = searchParams?.SortDescending === true;

//     // 2. Fetch data from the backend
//     const res = await getUsersAsync({
//         PhoneNumber: phoneNumber,
//         Page: page,
//         SortBy: sortBy,
//         SortDescending: sortDescending,
//     });

//     return (
//         <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
//             {/* Ensure you import the font and icons in your layout.tsx or here if allowed */}
//             <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

//             <main className="flex-1 p-6 lg:p-10">
//                 <div className="max-w-5xl mx-auto">
//                     {/* Header & Search Section */}
//                     <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
//                         <div className="flex flex-col gap-1">
//                             <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
//                                 User Management
//                             </h1>
//                             <p className="text-slate-500 dark:text-slate-400">View and manage all users on the platform.</p>
//                         </div>
//                         <div className="w-full sm:w-auto">
//                             {/* Reusable Search Component */}
//                             <SearchInput />
//                         </div>
//                     </div>

//                     {/* Table Section */}
//                     <div className="w-full @container">
//                         <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
//                             <table className="min-w-full">
//                                 <thead className="bg-slate-50 dark:bg-slate-800/50">
//                                     <tr>
//                                         <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                                             Full Name
//                                         </th>
//                                         <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                                             Phone Number
//                                         </th>
//                                         <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider group">
//                                             {/* Interactive Sort Header */}
//                                             <Link
//                                                 href={`?PhoneNumber=${phoneNumber}&Page=${page}&SortBy=CreatedAt&SortDescending=${!sortDescending}`}
//                                                 className="flex items-center gap-1 cursor-pointer"
//                                             >
//                                                 <span>Created At</span>
//                                                 <span className={`material-symbols-outlined text-base transition-opacity ${sortBy === 'CreatedAt' ? 'opacity-100 text-primary' : 'opacity-40 group-hover:opacity-100'}`}>
//                                                     {sortDescending ? 'arrow_downward' : 'unfold_more'}
//                                                 </span>
//                                             </Link>
//                                         </th>
//                                         <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                                             Driver Status
//                                         </th>
//                                         <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
//                                     {res.data?.items.length === 0 ? (
//                                         <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users found.</td></tr>
//                                     ) : (
//                                         res.data?.items.map((user) => (
//                                             <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
//                                                     {user.fullName}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
//                                                     {user.phoneNumber}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
//                                                     {user.createdAt}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     {/* Dynamic Status Badge */}
//                                                     <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${StatusStyles[user.driverStatus ?? 'null']}`}>
//                                                         {user.driverStatus}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                     <Link className="text-primary hover:text-primary/80" href="#">Edit</Link>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>

//                     {/* Pagination Section */}
//                     <div className="flex items-center justify-between mt-6">
//                         <p className="text-sm text-slate-500 dark:text-slate-400">
//                             Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, res.data?.totalCount ?? 0)}</span> of <span className="font-medium">{res.data?.totalCount ?? 0}</span> results
//                         </p>

//                         {/* Reusable Pagination Component */}
//                         <Pagination totalPages={res.data?.totalPages ?? 0} />
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }