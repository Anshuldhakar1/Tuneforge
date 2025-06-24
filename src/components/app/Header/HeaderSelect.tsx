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

    if (!user) return null;

    return (
        <div
            className={`relative flex items-center ${className}`}
            ref={ref}
        >
            <button
                className="grid grid-cols-[auto_1fr_auto] items-center px-2 py-1.5 rounded-full bg-white border border-neutral-200 hover:border-green-400 transition-colors shadow w-40 max-w-xs min-w-[10rem]"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={open}
                style={{ minWidth: "10rem" }}
            >
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-base shadow-inner select-none border border-green-200">
                    {getInitials(user.username)}
                </span>
                <span className="text-sm text-center font-semibold text-neutral-900 leading-tight truncate max-w-[6.5rem] ml-2">
                    {capitalize(user.username)}
                </span>
                <span>
                    <ChevronDown
                        size={18}
                        className={`transition-transform ${open ? "rotate-180" : ""} text-neutral-500`}
                    />
                </span>
            </button>
            {open && (
                <div
                    className="absolute left-0 top-full mt-0 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 py-2 animate-fade-in"
                    style={{ width: "10rem" }}
                >
                    <Link
                        to={`/playlists`}
                        className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors gap-2"
                        onClick={() => setOpen(false)}
                    >
                        <ListMusic size={18} className="text-green-500" />
                        My Playlists
                    </Link>
                    <button
                        className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors gap-2"
                        onClick={signout}
                    >
                        <LogOut size={18} className="text-red-400" />
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
};

export default HeaderSelect;