import React from 'react';

interface DetailItemProps {
    label: string;
    value: React.ReactNode;
    className?: string;
}
export const DetailItem = ({ label, value, className = "" }: DetailItemProps) => {
    return (
        <div className={`flex flex-col gap-y-1 ${className}`}>
            <h3 className="font-semibold text-foreground">{label}</h3>
            <strong className="text-pale-sky ps-1 text-sm font-medium">
                {value}
            </strong>
        </div>
    );
};