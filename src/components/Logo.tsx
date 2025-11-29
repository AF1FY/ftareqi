"use client";
import * as React from "react";
import Image from "next/image";
import logo_white from '@/assets/logo-1-white.png';
import logo_black from '@/assets/logo-1-black.png';
import { useTheme } from "next-themes";

const Logo = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div style={{ width: 150, height: 50 }} />;
    }
    const logo = resolvedTheme === "dark" ? logo_white : logo_black

    return (
        <Image
            src={logo}
            alt="ftareqi logo"
            priority
            className="w-full"
        />
    );
};

export default Logo;