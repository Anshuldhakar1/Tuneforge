import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";
import HeaderSelect from "./HeaderSelect";
import SpotifyConnect from "./SpotifyConnect";

interface HeaderProps {
    isSpotifyConnected: boolean;
    setSpotifyConnected: (connected: boolean) => void;
};

const Header = ({ isSpotifyConnected, setSpotifyConnected }: HeaderProps) => {
    return (
        <header className=" text-white p-4 flex justify-between items-center m-2">
            <div className="bg-white flex items-center">
                <Link to="/" className="flex items-center scale-[1.2] hover:opacity-80 transition-opacity">
                    <AppLogo className="w-8 h-8 text-white fill-white ml-0.5" />
                    <span className="ml-2 text-lg text-black relative top-[-2px] font-semibold">TuneForger</span>
                </Link>
            </div>
            <div>
                <SpotifyConnect isSpotifyConnected={isSpotifyConnected} setSpotifyConnected={setSpotifyConnected} className="text-black" />
            </div>

            <div>
                <HeaderSelect className="text-black"/>
            </div>
        </header>
    );
};

export default Header;