import Link from 'next/link';

function SidebarItem({ href, icon, text, active, alert, expanded , hidden = false }: { href: string, icon?: any, text?: any, active?: boolean, alert?: any, expanded?: any , hidden?: boolean }) {
    return (
        <Link href={href} hidden={hidden}>
            <li
                className={`
        relative flex items-center p-3 my-2
        font-medium rounded-lg cursor-pointer
        transition-colors duration-200 group
        ${active
                        ? "text-foreground bg-athens-gray"
                        : "hover:bg-dodger-blue/10 text-txt-secondary/90"
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
            </li>
        </Link>
    );
}

export default SidebarItem