"use client";
import React, { useState } from "react";
import UserContextProvider from "../context/userContext";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FCMListener from "@/components/FCMListener";


const Providers = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    }));
    return (
        <SessionProvider>
            <UserContextProvider>
                <QueryClientProvider client={queryClient}>
                    <FCMListener />
                    {children}
                </QueryClientProvider>
            </UserContextProvider>
        </SessionProvider>
    );
};

export default Providers;
