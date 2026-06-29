"use client";
import React, { useState, useEffect } from "react";
import { X, Camera } from "lucide-react";
import type { StaticImageData } from "next/image";
import NULL_PROFILE_PICTURE from "@/assets/generic_profile_picture.png";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getFullNameLatters } from "@/lib/services/userProfileService";
import { isNull } from "util";

interface ProfileImageWithLightboxProps {
    userImage?: string;
    title?: string;
    subTitle?: string;
    userName: string;
}

export const ProfileImageWithLightbox = ({
    userImage,
    title,
    subTitle,
    userName,
}: ProfileImageWithLightboxProps) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <>
            <div className="flex flex-col items-center w-fit">
                <div
                    className="relative size-24 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-border"
                    onClick={() => setIsOpen(true)}
                    title="Click to expand"
                >
                    {userImage ? (
                        <Image
                            src={userImage}
                            alt={title ?? userName}
                            className="rounded-full object-cover size-24"
                            width={96}
                            height={96}
                        />
                    ) : (
                        <Avatar className="h-11 w-11 cursor-pointer">
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {getFullNameLatters(userName)}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </div>

                <div className="text-center">
                    {title && (
                        <h3 className="font-bold text-lg text-foreground capitalize">
                            {title}
                        </h3>
                    )}
                    {subTitle && (
                        <p className="text-sm text-muted-foreground">
                            {subTitle}
                        </p>
                    )}
                </div>
            </div>

            {isOpen && userImage && (
                <div
                    className="fixed inset-0 z-9999 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={32} />
                    </button>
                    <div
                        className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
                        onClick={stopPropagation}
                    >
                        <Image
                            src={userImage}
                            alt={title ?? userName}
                            className="object-cover"
                            width={500}
                            height={500}
                        />
                        <p className="mt-4 text-white text-xl font-semibold bg-black/50 px-4 py-2 rounded-full">
                            {userName}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
