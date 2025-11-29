"use client"
import React, { createContext, useState } from "react";

interface IUserContext {
    phoneNumber: string;
    updatePhoneNumber: (phoneNumber:string) => void
}

export const userContext = createContext<IUserContext>({
    phoneNumber: '',
    updatePhoneNumber: () => {}
});

//* Component
const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [phoneNumber, setphoneNumber] = useState<string>('')

    function updatePhoneNumber(phoneNumber: string) {
        setphoneNumber(phoneNumber);
    }

    return (
        <userContext.Provider value={{
            phoneNumber,
            updatePhoneNumber
        }}>{ children }</userContext.Provider>
    )
}

export default UserContextProvider