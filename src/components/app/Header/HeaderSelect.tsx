import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, ListMusic } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderSelectProps {
    className: string;
    user: {
        username: string;
        email: string;
        userId: string;
    } | null;
    signout: () => void;
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const getInitials = (username: string) => {
    return username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const HeaderSelect = ({ className, user, signout }: HeaderSelectProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Sign out clicked");
        setOpen(false);
        signout();
    };

    const handlePlaylistsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("Playlists link clicked");
        setOpen(false);
    };

    if (!user) return null;

    return (
        <div
            className={`relative flex items-center ${className}`}
            ref={ref}
            style={{ zIndex: 1000 }}
        >
            <button
                className="grid grid-cols-[auto_1fr_auto] items-center px-3 py-2 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 hover:border-[#31c266]/50 hover:shadow-lg transition-all duration-300 shadow-sm w-44 backdrop-blur-sm"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={open}
                type="button"
            >
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#31c266] to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white/20">
                    {getInitials(user.username)}
                </span>
                <span className="text-sm text-center font-semibold text-gray-900 dark:text-white leading-tight truncate max-w-[6.5rem] ml-3">
                    {capitalize(user.username)}
                </span>
                <span>
                    <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${open ? "rotate-180" : ""} text-gray-500 dark:text-gray-400 hover:text-[#31c266]`}
                    />
                </span>
            </button>
            {open && (
                <div 
                    className="absolute left-0 top-full mt-2 bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl backdrop-blur-xl py-2 animate-fade-in overflow-hidden" 
                    style={{ 
                        width: "11rem",
                        zIndex: 9999,
                        position: 'absolute',
                        pointerEvents: 'auto'
                    }}
                >
                    <Link
                        to="/playlists"
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#31c266]/10 dark:hover:bg-[#31c266]/20 transition-all duration-200 gap-3 no-underline block"
                        onClick={handlePlaylistsClick}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <ListMusic size={18} className="text-[#31c266]" />
                        <span className="font-medium">My Playlists</span>
                    </Link>
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent my-1" />
                    <button
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 gap-3 border-0 bg-transparent text-left"
                        onClick={handleSignOut}
                        type="button"
                        style={{ pointerEvents: 'auto' }}
                    >
                        <LogOut size={18} className="text-red-500" />
                        <span className="font-medium">Sign out</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default HeaderSelect;