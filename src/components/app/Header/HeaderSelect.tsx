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
                className={`group flex items-center gap-3 px-4 py-2.5 ${open ? 'rounded-t-xl border-b-0' : 'rounded-xl'} bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-[2px]  dark:border-gray-700/40 border-[#31c266]/50 hover:shadow-xl hover:bg-white/95 dark:hover:bg-gray-900/95 transition-all duration-300 shadow-lg w-[12.5rem] relative overflow-hidden`}
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={open}
                type="button"
            >
                <div className="relative flex items-center gap-3 flex-1">
                    <div className="relative">
                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#31c266]/20 via-emerald-400/30 to-[#31c266]/40 dark:from-[#31c266]/30 dark:via-emerald-500/40 dark:to-[#31c266]/50 flex items-center justify-center text-[#31c266] dark:text-emerald-400 font-bold text-sm shadow-xl border border-[#31c266]/20 dark:border-emerald-400/20 relative overflow-hidden">
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <span className="relative z-10">{getInitials(user.username)}</span>
                        </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-gray-900 dark:text-white leading-tight truncate">
                            {capitalize(user.username)}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                            Ready to tune?
                        </span>
                    </div>
                    
                    <ChevronDown
                        size={16}
                        className={`transition-all duration-300 ${open ? "rotate-180 text-[#31c266]" : "text-gray-400 dark:text-gray-500"} group-hover:text-[#31c266] flex-shrink-0`}
                    />
                </div>
            </button>
            {open && (
                <div 
                    className="absolute left-0 top-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-[2px] border-t-0 border-green-600/40 dark:border-gray-700/40 rounded-b-xl shadow-xl py-1 w-[12.5rem] z-[9999]"
                >
                    <Link
                        to="/playlists"
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#31c266]/10 dark:hover:bg-[#31c266]/20 hover:text-gray-900 dark:hover:text-white transition-all duration-200 gap-2 no-underline group"
                        onClick={handlePlaylistsClick}
                    >
                        <ListMusic size={14} className="text-[#31c266] transition-transform duration-200" />
                        <span className="font-medium">My Playlists</span>
                    </Link>
                    
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200/60 dark:via-gray-600/60 to-transparent my-1" />
                    
                    <button
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50/80 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 gap-2 border-0 bg-transparent text-left group"
                        onClick={handleSignOut}
                        type="button"
                    >
                        <LogOut size={14} className="text-red-500 transition-transform duration-200" />
                        <span className="font-medium">Sign out</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default HeaderSelect;