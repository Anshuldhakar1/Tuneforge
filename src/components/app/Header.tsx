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
        <header className="relative sm:mx-2 mx-4 ml-6 mt-4 py-0 sm:py-4 rounded-2xl" style={{ zIndex: 100 }}>
            {/* Minimal decorative background elements */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-[#31c266]/2 via-transparent to-[#31c266]/2" />
            </div>

            <div className="relative z-10 flex justify-between items-center">
                <div className="hidden sm:flex items-center bg-white/80 ">
                    <Link to="/" className="flex items-center" aria-label="TuneForger Home">
                        <AppLogo className="w-12 h-8 text-[#31c266] drop-shadow-sm scale-[2.5]" />
                        <div className="ml-3 hidden md:block">
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-[#31c266] to-gray-700 dark:from-white dark:via-[#31c266] dark:to-gray-300 bg-clip-text text-transparent">
                                TuneForger
                            </span>
                            <div className="w-8 h-0.5 bg-gradient-to-r from-[#31c266] to-transparent rounded-full mt-0.5" />
                        </div>
                    </Link>
                </div>
                
                <div className="flex justify-between w-full sm:w-fit gap-4 items-center ">
                    <SpotifyConnect
                        isSpotifyConnected={isSpotifyConnected}
                        setSpotifyConnected={setSpotifyConnected}
                        className="text-gray-700 dark:text-gray-300"
                    />

                    <div className="flex items-center gap-4 scale-[0.8] sm:scale-100" style={{ position: 'relative' }}>
                        <HeaderSelect
                            user={user}
                            signout={signout}
                            className="text-gray-700 dark:text-gray-300"
                        />
                    </div>
                </div>
            </div>

        </header>
    );
};

export default Header;