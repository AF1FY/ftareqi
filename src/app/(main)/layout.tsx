"use client"
import React, { useEffect, useState } from 'react'
import {
    Home,
    Users,
    Wallet,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from './dashboard/_components/Sidebar';
import SidebarItem from './dashboard/_components/SidebarItem';
import ModernCarIcon from '@/components/svg/ModernCarIcon';
import { getUserRoles } from '@/lib/services/adminService';
import { Role } from '@/types/User';
const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [expanded, setExpanded] = useState(true);
    const pathName: string = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModerator, setIsModerator] = useState(false);
    useEffect(() => {
        getUserRoles().then(res => {
            setIsAdmin(res.includes(Role.Admin));
            setIsModerator(res.includes(Role.Moderator));
        })
    }, [isAdmin])
    const toggleSidebar = () => {
        setExpanded((curr) => !curr);
    };
    return (
        <main className='flex max-h-screen bg-porcelain overflow-y-hidden'>
            <Sidebar expanded={expanded} toggleSidebar={toggleSidebar}>
                {/* <SidebarItem href='/dashboard' icon={<Home size={20} />} text="Dashboard" active={pathName.endsWith('dashboard')} /> */}
                <SidebarItem href='/home' icon={<Home size={20} />} text="Home" active={pathName.endsWith('/home')} />
                <SidebarItem href='/dashboard/users' icon={<Users size={20} />} text="Users" active={pathName.endsWith('/users')} hidden={!isAdmin} />
                <SidebarItem href='/dashboard/drivers' icon={<ModernCarIcon size={22} />} text="Driver profiles" active={pathName.endsWith('/drivers')} hidden={!isAdmin && !isModerator} />
                <SidebarItem href='/wallet' icon={<Wallet size ={20} />} text = 'Wallet' active = {pathName.endsWith('/wallet')} />
            </Sidebar>
            <div className='flex-1 bg-white-athens-gray overflow-y-auto ps-18 md:ps-0'>
                <Navbar />
                {children}
            </div>
        </main>
    )
}

export default layout