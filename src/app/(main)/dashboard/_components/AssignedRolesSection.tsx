"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // أو حسب مكتبة التوست المستخدمة
import { Role } from "@/types/User";
import { removeRoleAsync } from "@/lib/actions/Admin.actions";
import { Spinner } from "@/components/ui/spinner";

// استيراد مكونات Shadcn Alert Dialog
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AssignedRolesProps {
    userId: string;
    assignedRoles: Role[];
}

export default function AssignedRolesSection({ userId, assignedRoles }: AssignedRolesProps) {
    const router = useRouter();
    const [loadingRole, setLoadingRole] = useState<string | null>(null);

    const handleRemoveRole = async (role: Role) => {
        setLoadingRole(role); // تفعيل اللودينج للرول المحدد فقط

        try {
            const res = await removeRoleAsync(userId, role);

            if (res.success) {
                toast.success(res.message, { position: 'top-right' });
                router.refresh(); // تحديث الصفحة لجلب البيانات الجديدة من السيرفر
            } else {
                toast.error(res.message, { position: 'top-right' });
            }
        } catch (error) {
            toast.error("An unexpected error occurred", { position: 'top-right' });
        } finally {
            setLoadingRole(null);
        }
    };

    return (
        <div className="bg-background rounded-xl p-6 border border-athens-gray mb-8">
            <h2 className=" text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">
                Assigned Roles
            </h2>
            <div className="flex flex-wrap gap-3">
                {assignedRoles.length > 0 ? (
                    assignedRoles.map((role, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 rounded-full bg-dodger-blue/10 text-dodger-blue px-3 py-1 text-sm font-medium"
                        >
                            <span>{role}</span>

                            {/* استخدام Alert Dialog عند الضغط على زر الحذف */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        disabled={loadingRole === role}
                                        className="text-primary/60 dark:text-blue-300/70 hover:text-primary dark:hover:text-blue-300 transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        {loadingRole === role ? (
                                            <Spinner className="w-3 h-3" />
                                        ) : (
                                            <i className="fa-solid fa-xmark mt-1"/>
                                        )}
                                    </button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action will remove the <strong>{role}</strong> role from this user.
                                            They will lose any permissions associated with this role immediately.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        {/* عند الضغط على Continue يتم استدعاء دالة الحذف */}
                                        <AlertDialogAction
                                            onClick={() => handleRemoveRole(role)}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No roles assigned to this user.</p>
                )}
            </div>
        </div>
    );
}