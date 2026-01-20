import { getCarColorHex } from '@/lib/services/moderatorService';
import { cn } from '@/lib/utils';
interface CarColorBadgeProps {
    colorName: string;
    className?: string;
}
const CarColorBadge = ({ colorName, className }: CarColorBadgeProps) => {
    const hexColor = getCarColorHex(colorName);
    const isWhite = hexColor.toLowerCase() === '#ffffff' || colorName.toLowerCase() === 'white';

    return (
        <div 
            className={cn("flex items-center gap-2 w-fit", className)} 
            title={colorName}
        >
            <div 
                className={cn(
                    "w-6 h-6 rounded-full shadow-sm",
                    isWhite ? "border border-gray-300" : "border border-transparent"
                )}
                style={{ backgroundColor: hexColor }}
                aria-label={`Car color is ${colorName}`}
            />
            <span className="text-sm font-medium capitalize">
                {colorName}
            </span>
        </div>
    );
}

export default CarColorBadge