import { LayoutDashboard } from 'lucide-react';
import React from 'react'

function Sidebar({ children, expanded, toggleSidebar }:{ children:any, expanded:any, toggleSidebar:any }) {
    return (
        <aside className={`h-screen border-r fixed md:static border-athens-gray bg-background z-20 transition-all duration-300 ease-in-out flex flex-col ${expanded ? 'w-64' : 'w-18' } `}>
            {/* Header: Project Icon & Name */}
            <div className="h-16 bg-background flex items-center justify-between px-3 border-b border-athens-gray">
                <div
                    onClick={toggleSidebar}
                    className="flex items-center cursor-pointer p-2 rounded-lg transition-colors w-full overflow-hidden"
                    title={expanded ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {/*//*  Project logo */}
                    <div className="min-w-8 min-h-8 bg-foreground text-background flex items-center justify-center rounded-lg shadow-md">
                        <LayoutDashboard size={20} />
                    </div>

                    {/*//* Project Name */}
                    <div
                        className={`ml-3 font-bold text-lg whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? "w-40 opacity-100" : "w-0 opacity-0"
                            }`}
                    >
                        Dashboard
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <ul className="flex-1 flex-col p-3 overflow-y-auto overflow-x-hidden">
                {React.Children.map(children, child => {
                    if (typeof child.type === 'string') {
                        return child;
                    }
                    return React.cloneElement(child, { expanded });
                })}
            </ul>

            {/* User Profile (Optional Footer) */}
            <div className="p-3 flex items-center">
                <img
                    src="https://ui-avatars.com/api/?name=John+Doe&background=c7d2fe&color=3730a3"
                    alt=""
                    className="w-10 h-10 rounded-lg"
                />
                <div
                    className={`flex flex-col ml-3 overflow-hidden transition-all duration-300 ${expanded ? "w-40 opacity-100" : "w-0 opacity-0"
                        }`}
                >
                    <span className="font-semibold text-sm text-gray-700 whitespace-nowrap">Admin</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">admin@project.com</span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar