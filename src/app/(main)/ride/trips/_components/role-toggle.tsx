import ModernCarIcon from "@/components/svg/ModernCarIcon";
import { cn } from "@/lib/utils";
import { Car, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function RoleToggle() {
  const path: string = usePathname();

  return (
    <div
      className="inline-flex h-fit items-center rounded-full bg-background p-1 shadow-sm"
    >
      <Link
        href={'/ride/trips/rider'}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 transition-all sm:px-6",
          path.includes('rider')
            ? "bg-dodger-blue-dark text-white shadow"
            : "text-pale-sky hover:text-foreground",
        )}
      >
        {/* <User className="h-4 w-4" /> */}
        <i className="fa-solid fa-person-walking-luggage"></i>
        <span>Riding</span>
      </Link>
      <Link
        href={'/ride/trips/driver'}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 transition-all sm:px-6",
          path.includes('driver')
            ? "bg-dodger-blue-dark text-white shadow"
            : "text-pale-sky hover:text-foreground",
        )}
      >
        <ModernCarIcon className="size-6" isActive = { path.includes('driver') } />
        {/* <i className="fa-solid fa-car"></i> */}
        <span>Driving</span>
      </Link>
    </div>
  );
}
