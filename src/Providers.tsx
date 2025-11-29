"use client";
import React from "react";
import UserContextProvider from "./context/userContext";
import { SessionProvider } from "next-auth/react";


const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <UserContextProvider>
                {children}
            </UserContextProvider>
        </SessionProvider>
    );
};

export default Providers;
