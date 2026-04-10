import Logo from '@/components/Logo';
import Navbar from '@/components/Navbar';
import React from 'react'

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <Navbar logo={<Logo />} />
            {children}
        </>
    )
}

export default layout