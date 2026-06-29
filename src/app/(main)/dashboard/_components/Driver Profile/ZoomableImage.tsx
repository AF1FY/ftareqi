"use client";
import { useState, useEffect, useCallback } from "react";
import { X, ZoomIn, ImageIcon } from "lucide-react";

import Image, { StaticImageData } from "next/image";
interface ZoomableImageProps {
    imageSrc: string | StaticImageData | null | undefined;
    alt: string;
    className?: string;
}

export const ZoomableImage = ({
    imageSrc,
    alt,
    className = "w-full aspect-video rounded-md",
}: ZoomableImageProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const normalizedSrc =
        typeof imageSrc === "string" ? imageSrc.trim() : imageSrc;
    const hasValidImage = Boolean(normalizedSrc);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, handleKeyDown]);

    const handleImageLoad = () => {
        setIsLoading(false);
        // Ensure skeleton shows for at least 300ms to prevent flash
        setTimeout(() => {
            setShowSkeleton(false);
        }, 300);
    };

    return (
        <>
            {/* 1. الصورة المصغرة (Thumbnail) */}
            <div
                className={`relative w-full aspect-video bg-lavender-gray rounded-md overflow-hidden cursor-pointer group ${className}`}
                onClick={() => setIsOpen(true)}
            >
                {showSkeleton && (
                    <div className="absolute inset-0 bg-lavender-gray animate-pulse flex items-center justify-center z-10">
                        <ImageIcon className="size-8 text-pale-sky opacity-50" />
                    </div>
                )}
                {hasValidImage ? (
                    <Image
                        src={normalizedSrc as string | StaticImageData}
                        alt={alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onLoad={handleImageLoad}
                        className={`
                            object-cover 
                            transition-all duration-500 
                            group-hover:scale-110 
                            ${isLoading ? "opacity-0 scale-100" : "opacity-100"}
                        `}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-lavender-gray text-pale-sky">
                        <ImageIcon className="size-8 opacity-50" />
                    </div>
                )}

                {!isLoading && hasValidImage && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center z-20">
                        <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 drop-shadow-md" />
                    </div>
                )}
            </div>

            {/* 2. الـ Lightbox (Modal) */}
            {isOpen && hasValidImage && (
                <div
                    className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-50"
                    >
                        <X size={24} />
                    </button>

                    <div
                        className="relative w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <Image
                            src={normalizedSrc as string | StaticImageData}
                            alt={alt}
                            fill
                            quality={100} // عشان تظهر بأعلى جودة لما نفتحها
                            priority // عشان تتحمل فوراً لأن المستخدم فاتحها مخصوص
                            sizes="100vw" // لأنها مالية الشاشة كلها
                            className="object-contain" // أهم كلاس: بيخلي الصورة تظهر كاملة جوه الشاشة من غير قص
                        />
                    </div>
                </div>
            )}
        </>
    );
};
