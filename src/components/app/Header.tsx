import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";
import HeaderSelect from "./Header/HeaderSelect";
import SpotifyConnect from "./Header/SpotifyConnect";

interface HeaderProps {
    isSpotifyConnected: boolean;
    setSpotifyConnected: (connected: boolean) => void;
    user: {
        username: string;
        email: string;
        userId: string;
    } | null;
    signout: () => void;
};

const Header = ({ isSpotifyConnected, setSpotifyConnected, user, signout }: HeaderProps) => {
    return (
        <header className="relative mx-2 mt-4 px-8 py-4 rounded-2xl" style={{ zIndex: 100 }}>
            {/* Minimal decorative background elements */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-[#31c266]/2 via-transparent to-[#31c266]/2" />
            </div>

            <div className="relative z-10 flex justify-between items-center">
                <div className="flex items-center bg-white/80">
                    <Link to="/" className="flex items-center">
                        <AppLogo className="w-10 h-10 text-[#31c266] drop-shadow-sm" />
                        <div className="ml-3">
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-[#31c266] to-gray-700 dark:from-white dark:via-[#31c266] dark:to-gray-300 bg-clip-text text-transparent">
                                TuneForger
                            </span>
                            <div className="w-8 h-0.5 bg-gradient-to-r from-[#31c266] to-transparent rounded-full mt-0.5" />
                        </div>
                    </Link>
                </div>
                
                <SpotifyConnect
                    isSpotifyConnected={isSpotifyConnected}
                    setSpotifyConnected={setSpotifyConnected}
                    className="text-gray-700 dark:text-gray-300"
                />

                <div className="flex items-center gap-4" style={{ position: 'relative' }}>
                    
                    <HeaderSelect 
                        user={user} 
                        signout={signout} 
                        className="text-gray-700 dark:text-gray-300"
                    />
                </div>
            </div>

        </header>
    );
};

export default Header;