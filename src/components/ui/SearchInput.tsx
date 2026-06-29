// "use client";

// import { useSearchParams, usePathname, useRouter } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";

// export default function SearchInput() {
//     const searchParams = useSearchParams();
//     const pathname = usePathname();
//     const { push } = useRouter();

//     const handleSearch = useDebouncedCallback((term: string) => {
//         const params = new URLSearchParams(searchParams);
//         params.set("Page", "1");
//         if (term) {
//             params.set("PhoneNumber", term);
//         } else {
//             params.delete("PhoneNumber");
//         }
//         push(`${pathname}?${params.toString()}`);
//     }, 300);

//     return (
//         <label className="flex flex-col h-12 w-full sm:w-72">
//             <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
//                 <div className="text-slate-400 dark:text-slate-500 flex bg-white dark:bg-slate-800/50 items-center justify-center pl-4 rounded-l-lg border border-slate-300 dark:border-slate-700 border-r-0">
//                     <span className="material-symbols-outlined">search</span>
//                 </div>
//                 <input
//                     className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 h-full placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
//                     placeholder="Search by Phone Number..."
//                     defaultValue={searchParams.get("PhoneNumber")?.toString()}
//                     onChange={(e) => handleSearch(e.target.value)}
//                 />
//             </div>
//         </label>
//     );
// }
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchInputProps {
    value?: string;
    onSearch?: (value: string) => void;
}

export default function SearchInput({
    value = "",
    onSearch,
}: SearchInputProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("Page", "1");

        if (term) {
            params.set("PhoneNumber", term);
        } else {
            params.delete("PhoneNumber");
        }

        onSearch?.(term);
        router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="group relative w-full sm:w-72">
            <div
                className="
        relative flex items-center w-full h-12 rounded-lg 
        bg-athens-gray
        border border-lavender-gray
        transition-all duration-300 ease-out
        group-focus-within:ring-2 group-focus-within:ring-pale-sky
        "
            >
                <div
                    className="
        absolute left-3 flex items-center justify-center text-pale-sky pointer-events-none
        transition-all duration-300 ease-in-out
        group-focus-within:-translate-x-4 group-focus-within:opacity-0
        "
                >
                    <span className="material-symbols-outlined">search</span>
                </div>

                <input
                    className="
            w-full h-full bg-transparent
            text-txt-secondary
            placeholder:text-txt-secondary
            text-sm font-normal leading-normal
            rounded-lg
            focus:outline-none
            transition-all duration-300 ease-out
            pl-10 group-focus-within:pl-4
        "
                    placeholder="Search by Phone Number..."
                    value={inputValue}
                    onChange={(e) => {
                        const nextValue = e.target.value;
                        setInputValue(nextValue);
                        handleSearch(nextValue);
                    }}
                />
            </div>
        </div>
    );
}
