import Navbar from "@/components/Navbar";
import Logo from "@/components/svg/Logo";
import React from "react";

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <Navbar logo={<Logo className="size-7" />} />
            {children}
        </>
    );
};

export default layout;
