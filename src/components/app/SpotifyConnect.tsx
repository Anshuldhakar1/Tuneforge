import React from "react";
import SpotifyLogo from "./SpotifyLogo";
import { toast } from "sonner";

interface SpotifyConnectProps {
    className: string;
    isSpotifyConnected: boolean;
    setSpotifyConnected: (connected: boolean) => void;
}

const SpotifyConnect = ({ className, isSpotifyConnected, setSpotifyConnected }: SpotifyConnectProps) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const clickHandler = () => {
        setSpotifyConnected(!isSpotifyConnected);

        toast.success(isSpotifyConnected ? "Disconnected from Spotify" : "Connected to Spotify");
    };

    const bgColor = isHovered
        ? (isSpotifyConnected ? "bg-red-50" : "bg-green-50")
        : (isSpotifyConnected ? "bg-green-50" : "bg-red-50");

    const borderColor = isHovered
        ? (isSpotifyConnected ? "border-red-500" : "border-green-500")
        : (isSpotifyConnected ? "border-green-500" : "border-red-500");


    return (
        <button
            className={` ${className} flex items-center justify-center border-2 
            ${borderColor} transition-all duration-300 ease-in-out
            ${bgColor}
            rounded-full p-2`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => { clickHandler();} }
        >
            <div className="w-7 h-7 flex items-center justify-center">
                <SpotifyLogo className="w-7 h-7 text-black" />
            </div>
            <div className="transition-all duration-300 ease-in-out flex items-center">
                <span
                    className={`
                        text-sm transition-all duration-100 ease-in-out
                        ${isHovered ? "opacity-100 max-w-[120px] mx-2 pb-1" : "opacity-0 max-w-0 mx-0"}
                        ${!isSpotifyConnected ? "text-green-500" : "text-red-500"}
                        inline-block overflow-hidden font-[515]
                    `}
                    style={{ transitionProperty: "max-width, opacity, margin" }}
                >
                    {isSpotifyConnected ? "Disconnect" : "Connect"}
                </span>
            </div>
        </button>
    );
};

export default SpotifyConnect;
