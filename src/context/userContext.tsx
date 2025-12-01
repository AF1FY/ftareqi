"use client"
import React, { createContext, useState } from "react";

interface IUserContext {
    phoneNumber: string,
    updatePhoneNumber: (phoneNumber:string) => void,
    role: number,
    updateRole: (role:number) => void
}

export const userContext = createContext<IUserContext>({
    phoneNumber: '',
    updatePhoneNumber: () => {},
    role: 1,
    updateRole: () => {},
});

//* Component
const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [phoneNumber, setphoneNumber] = useState<string>('')
    const [role, setRole] = useState(1)
    function updatePhoneNumber(phoneNumber: string) {
        setphoneNumber(phoneNumber);
    }
    function updateRole(role: number) {
        setRole(role);
    }
    return (
        <userContext.Provider value={{
            phoneNumber,
            updatePhoneNumber,
            role,
            updateRole
        }}>{ children }</userContext.Provider>
    )
}

export default UserContextProvider