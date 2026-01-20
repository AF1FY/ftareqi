import Link from 'next/link';

function SidebarItem({ href, icon, text, active, alert, expanded }: { href: string, icon?: any, text?: any, active?: any, alert?: any, expanded?: any }) {
    return (
        <Link href={href}>
            <li
                className={`
        relative flex items-center p-3 my-2
        font-medium rounded-lg cursor-pointer
        transition-colors duration-200 group
        ${active
                        ? "text-dodger-blue"
                        : "hover:bg-dodger-blue/10"
                    }
    `}
            >
                {/* Icon */}
                <div className='flex items-center justify-center min-w-6'>
                    {icon}
                </div>

                {/* Text (Transitions width and opacity) */}
                <span
                    className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap ml-3 ${expanded ? "w-40 opacity-100" : "w-0 opacity-0"
                        }`}
                >
                    {text}
                </span>

                {/* Alert Dot (Optional) */}
                {alert && (
                    <div
                        className={`absolute right-2 size-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"
                            }`}
                    />
                )}

                {/* Tooltip for collapsed state (Optional UX enhancement) */}
                {!expanded && (
                    <div
                        className={`
        absolute left-full rounded-md px-2 py-1 ml-6
        bg-indigo-100 text-indigo-800 text-sm
        invisible opacity-20 -translate-x-3 transition-all
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        z-50 whitespace-nowrap shadow-md
    `}
                    >
                        {text}
                    </div>
                )}

            </li>
        </Link>
    );
}

export default SidebarItem