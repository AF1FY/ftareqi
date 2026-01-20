"use client";
import React, { useState, useEffect } from "react";
import { X, Camera } from "lucide-react";
import type { StaticImageData } from "next/image";
import NULL_PROFILE_PICTURE from '@/assets/generic_profile_picture.png'

interface ProfileImageWithLightboxProps {
    src: string | StaticImageData;
    alt: string;
    title?: string;
    subTitle?: string;
}

export const ProfileImageWithLightbox = ({
    src = NULL_PROFILE_PICTURE,
    alt,
    title,
    subTitle,
}: ProfileImageWithLightboxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const imageSrc = typeof src === 'string' ? src : src.src
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
                    {isLoading && (
                        <div className="absolute inset-0 bg-lavender-gray animate-pulse flex items-center justify-center z-10">
                            <Camera className="size-8 text-pale-sky opacity-50" />
                        </div>
                    )}
                    <img
                        src={imageSrc}
                        alt={alt}
                        onLoad={() => setIsLoading(false)}
                        className={`
                        object-cover w-full h-full 
                        transition-all duration-500 
                        group-hover:scale-110 
                        ${isLoading ? 'opacity-0 scale-100' : 'opacity-100'}
                    `}
                    />
                </div>

                <div className="text-center">
                    {title && <h3 className="font-bold text-lg text-foreground capitalize">{title}</h3>}
                    {subTitle && <p className="text-sm text-muted-foreground">{subTitle}</p>}
                </div>
            </div>

            {isOpen && !isLoading && (
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
                        <img
                            src={imageSrc}
                            alt={alt}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                        <p className="mt-4 text-white text-xl font-semibold bg-black/50 px-4 py-2 rounded-full">
                            {title}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};