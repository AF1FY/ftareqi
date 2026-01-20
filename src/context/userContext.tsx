"use client"
import React, { createContext, useState } from "react";

interface IUserContext {
    phoneNumber: string;
    role: number;
    userName: string;
    updatePhoneNumber: (phoneNumber:string) => void;
    updateRole: (role:number) => void;
    updateUserName: (userName: string) => void;
}

export const userContext = createContext<IUserContext>({
    phoneNumber: '',
    role: 1,
    userName: '',
    updatePhoneNumber: () => {},
    updateRole: () => {},
    updateUserName: () => {},
});

//* Component
const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [phoneNumber, setphoneNumber] = useState<string>('')
    const [role, setRole] = useState(1)
    const [userName,setUserName] = useState('');
    function updatePhoneNumber(phoneNumber: string) {
        setphoneNumber(phoneNumber);
    }
    function updateRole(role: number) {
        setRole(role);
    }
    function updateUserName(userName:string) {
        setUserName(userName);
    }
    return (
        <userContext.Provider value={{
            phoneNumber,
            role,
            userName,
            updatePhoneNumber,
            updateRole,
            updateUserName
        }}>{ children }</userContext.Provider>
    )
}

export default UserContextProvider