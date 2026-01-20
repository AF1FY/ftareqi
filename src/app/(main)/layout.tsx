"use client"
import React, { useState } from 'react'
import {
    Home,
    Users,
    CarFront,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from './dashboard/_components/Sidebar';
import SidebarItem from './dashboard/_components/SidebarItem';
const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [expanded, setExpanded] = useState(true);
    const path: string = usePathname();
    // Toggle function triggered by clicking the project logo
    const toggleSidebar = () => {
        setExpanded((curr) => !curr);
    };
    return (
        <main className='flex max-h-screen bg-porcelain overflow-y-hidden'>
            <Sidebar expanded={expanded} toggleSidebar={toggleSidebar}>
                {/* <SidebarItem href='/dashboard' icon={<Home size={20} />} text="Dashboard" active={path.endsWith('dashboard')} /> */}
                <SidebarItem href='/' icon={<Home size={20} />} text="Home" active={path.endsWith('/')} />
                <SidebarItem href='/dashboard/users' icon={<Users size={20} />} text="Users" active={path.endsWith('/users')} />
                <SidebarItem href='/dashboard/drivers' icon={<CarFront size={20} />} text="Driver profiles" active={path.endsWith('/drivers')} />
            </Sidebar>
            <div className='flex-1 bg-white-athens-gray overflow-y-auto ps-18 md:ps-0'>
                <Navbar/>
                {children}
            </div>
        </main>
    )
}

export default layout