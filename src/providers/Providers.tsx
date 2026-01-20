"use client";
import React, { useState } from "react";
import UserContextProvider from "../context/userContext";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const Providers = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // اختياري: عشان تتجنب إعادة الجلب كل ما تطلع من الويندو وترجع
                refetchOnWindowFocus: false,
            },
        },
    }));
    return (
        <SessionProvider>
            <UserContextProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </UserContextProvider>
        </SessionProvider>
    );
};

export default Providers;
