// app/forbidden/page.tsx
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center space-y-6">
            <div className="bg-destructive/10 p-6 rounded-full">
                <ShieldAlert className="w-20 h-20 text-destructive" />
            </div>

            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">You are not allowed to enter.</h1>
                <p className="text-muted-foreground text-lg">
                    Sorry, you do not have sufficient permissions to access this page.
                </p>
            </div>

            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/">Return to Home</Link>
                </Button>
            </div>
        </div>
    );
}