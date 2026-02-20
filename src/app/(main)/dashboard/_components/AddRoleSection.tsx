"use client";
import { Spinner } from '@/components/ui/spinner';
import { addRoleAsync } from '@/lib/actions/Admin.actions';
import { Role } from '@/types/User'
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { toast } from 'sonner';

const AddRoleSection = ({ userID, availableRoles }: { userID: string, availableRoles: Role[] }) => {
    const [selectedRole, setSelectedRole] = useState<Role>(availableRoles[0]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    async function addRole(id: string, role: Role) {
        setIsLoading(true);
        const res = await addRoleAsync(id, role);
        if (res.success)
            toast.success(res.message, { position: 'top-right' });
        else
            toast.error(res.message, { position: 'top-right' });
        setIsLoading(false);
        router.refresh();
        console.log('------- Res : ',res);
    }
    const hasFullAccess = availableRoles.length === 0;
    return (
        <div className="bg-background rounded-xl p-6 border border-athens-gray">
            <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">
                Add a New Role
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-pale-sky mb-1.5" htmlFor="role-select">
                        Select a role to add
                    </label>
                    <div className="relative">
                        <select
                            className="w-full appearance-none rounded-lg border border-athens-gray bg-porcelain px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                            id="role-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as Role)}
                            disabled={hasFullAccess}
                        >
                            {hasFullAccess && (<option>You Have Full Access</option>) }
                            {availableRoles.map(r => (<option key={r} value={r}>{r}</option>))}
                        </select>
                        <i className="fa-solid fa-angle-down absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                    </div>
                </div>
                <button
                    className={`group bg-dodger-blue text-white transition-all md:w-31 ${hasFullAccess ? 'cursor-not-allowed' : 'cursor-pointer'}  flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm`}
                    onClick={() => { addRole(userID, selectedRole) }}
                    disabled = {hasFullAccess}
                >
                    {isLoading ? <Spinner className='size-5' /> : (
                        <>
                            <i className={`fa-solid fa-user-plus transition-all duration-300 ease-in-out ${!hasFullAccess && 'group-hover:-translate-x-2 group-hover:opacity-0'}`}></i>
                            <span className={`transition-all duration-300 ease-in-out ${!hasFullAccess && 'group-hover:-translate-x-3'}`}>Add Role</span>
                        </>)}
                </button>
            </div>
        </div>)
}

export default AddRoleSection