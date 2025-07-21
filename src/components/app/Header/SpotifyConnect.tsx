import React from "react";
import SpotifyLogo from "./SpotifyLogo";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface SpotifyConnectProps {
  className: string;
  isSpotifyConnected: boolean;
  setSpotifyConnected: (connected: boolean) => void;
}

const SpotifyConnect = ({ className, isSpotifyConnected, setSpotifyConnected }: SpotifyConnectProps) => {
  const token = localStorage.getItem("session_token");
  
  // Only call the query if we have a token
  const getSpotifyAuthUrl = useQuery(
    api.spotifyAuth.getSpotifyAuthUrl, 
    token ? { token } : "skip"
  );

  // Check actual Spotify connection status
  const spotifyConnectionStatus = useQuery(
    api.spotifyAuth.isSpotifyConnected,
    token ? { token } : "skip"
  );

  const disconnectSpotify = useMutation(api.spotifyAuth.disconnectSpotify);

  const [isHovered, setIsHovered] = React.useState(false);

  // Update the connection status when it changes
  React.useEffect(() => {
    if (spotifyConnectionStatus !== undefined) {
      setSpotifyConnected(spotifyConnectionStatus);
    }
  }, [spotifyConnectionStatus, setSpotifyConnected]);

  const openSpotifyPopup = async () => {
    if (!token || !getSpotifyAuthUrl) {
      toast.error("Authentication required");
      return;
    }
    
    const popup = window.open(
      getSpotifyAuthUrl,
      "SpotifyAuth",
      "width=500,height=700"
    );
    
    if (!popup) {
      toast.error("Popup blocked. Please allow popups for this site.");
      return;
    }

    const handler = async (event: MessageEvent) => {
      if (event.data?.type === "spotify-success") {
        setSpotifyConnected(true);
        toast.success("Connected to Spotify");
        window.removeEventListener("message", handler);
        popup.close();
      }
      if (event.data?.type === "spotify-error") {
        toast.error("Spotify connection failed: " + event.data.error);
        window.removeEventListener("message", handler);
        popup.close();
      }
    };
    
    window.addEventListener("message", handler);
    
    // Clean up if popup is closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        window.removeEventListener("message", handler);
        clearInterval(checkClosed);
      }
    }, 1000);
  };

  const clickHandler = async () => {
    if (!token) {
      toast.error("Please log in first");
      return;
    }
    
    if (isSpotifyConnected) {
      try {
        await disconnectSpotify({ token });
        setSpotifyConnected(false);
        toast.success("Disconnected from Spotify");
      } catch (error) {
        toast.error("Failed to disconnect from Spotify");
      }
    } else {
      openSpotifyPopup();
    }
  };

  // Don't render if no token
  if (!token) {
    return null;
  }

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
          onClick={clickHandler}
      >
          <div className="w-7 h-7 flex items-center justify-center">
              <SpotifyLogo className="w-7 h-7 text-black" />
          </div>
          <div className="transition-all duration-300 ease-in-out flex items-center">
              <span
                  className={`
                      text-sm transition-all duration-100 ease-in-out
                      opacity-100 max-w-[120px] mx-2 pb-1"
                      ${isSpotifyConnected ? (isHovered ? "text-red-500" : "text-green-500") : (!isHovered ? "text-red-500" : "text-green-500") }
                      inline-block overflow-hidden font-[515]
                  `}
                  style={{ transitionProperty: "max-width, opacity, margin" }}
              >
                  {!isSpotifyConnected ? (isHovered ? "Connect" : "Disconnected") :(isHovered ? "Disconnect" : "Connected")}
              </span>
          </div>
      </button>
  );
};

export default SpotifyConnect;
