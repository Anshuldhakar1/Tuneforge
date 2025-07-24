import { Heart, Share2, Download } from "lucide-react";
import clsx from "clsx";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useEffect } from "react";

type PlaylistActionsProps = {
  liked: boolean;
  setLiked: (fn: (l: boolean) => boolean) => void;
  isSpotifyConnected: boolean;
  playlistData: {
    id: string;
    name: string;
    description: string;
    generatedFrom: string;
    createdAt: string;
    duration: string;
    tracks: Array<{
      id: string;
      title: string;
      artist: string;
      album: string;
      duration: string;
    }>;
  };
  onExportToSpotify: () => Promise<void>;
  isExportingToSpotify: boolean;
  spotifyPlaylistUrl?: string;
};

export function PlaylistActions({ 
  liked, 
  setLiked, 
  isSpotifyConnected, 
  playlistData, 
  onExportToSpotify, 
  isExportingToSpotify,
  spotifyPlaylistUrl
}: PlaylistActionsProps) {
  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(playlistData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${playlistData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleLikeBackend = useMutation(api.playlistLikes.togglePlaylistLike);

  const handleSpotifyAction = () => {
    if (spotifyPlaylistUrl) {
      // Open existing Spotify playlist
      window.open(spotifyPlaylistUrl, '_blank');
    } else {
      // Export to Spotify
      onExportToSpotify();
    }
  };

  const sessionToken = localStorage.getItem("session_token");
  const userId = sessionToken ?
    useQuery(api.auth.getUserBySessionToken, { token: sessionToken }) : null;

  if (!userId) {
    console.error("No user ID found");
  }

  const isLiked = useQuery(api.playlistLikes.isPlaylistLiked, {
    userId: userId as Id<"users">,
    playlistId: playlistData.id as Id<"playlists">
  })

  useEffect(() => {
    if (isLiked !== undefined) {
      setLiked(() => isLiked);
    }
  }, [isLiked]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mt-6 absolute top-0 right-[2rem] z-20">
        <button
          className={clsx(
            "w-12 h-12 rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-all duration-300 shadow-lg",
            liked
              ? "bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-700 ring-2 ring-red-400/30"
              : "bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 hover:bg-[#eafaf2] dark:hover:bg-[#223c2e]"
          )}
          onClick={ async () => {
            setLiked((l) => !l);
            await toggleLikeBackend({ userId: userId as Id<"users">, playlistId: playlistData.id as Id<"playlists"> });
          }}
          aria-label="Like playlist"
        >
          <Heart
            size={20}
            fill={liked ? "#ef4444" : "none"}
            color={liked ? "#ef4444" : "#31c266"}
            className="transition-all duration-200"
          />
        </button>

        <button
          className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 hover:bg-[#eafaf2] dark:hover:bg-[#223c2e] transition-all duration-300 shadow-lg backdrop-blur-sm"
          aria-label="Share playlist"
        >
          <Share2 size={18} className="text-[#31c266]" />
        </button>

        <button
          className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 hover:bg-[#eafaf2] dark:hover:bg-[#223c2e] transition-all duration-300 shadow-lg backdrop-blur-sm"
          onClick={handleDownloadJSON}
          aria-label="Download playlist as JSON"
        >
          <Download size={18} className="text-[#31c266]" />
        </button>
      </div>
      {isSpotifyConnected && (
        <div className="group absolute right-[2rem] bottom-[2rem] z-20">
          <button
            className={clsx(
              "flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 text-sm font-bold backdrop-blur-sm border-2",
              isExportingToSpotify
                ? "bg-white/70 dark:bg-gray-800/70 border-[#1db954]/50 cursor-not-allowed text-[#1db954] shadow-lg"
                : spotifyPlaylistUrl
                ? "bg-gradient-to-r from-[#1db954] to-[#1ed760] border-[#1db954] text-white shadow-xl hover:shadow-2xl hover:from-[#1ed760] hover:to-[#22e165] hover:border-[#1ed760]"
                : "bg-white/80 dark:bg-gray-800/80 border-[#1db954] text-[#1db954] shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-[#1db954] hover:to-[#1ed760] hover:text-white hover:border-[#1ed760]"
            )}
            onClick={handleSpotifyAction}
            disabled={isExportingToSpotify}
            aria-label={spotifyPlaylistUrl ? "Open in Spotify" : "Export to Spotify"}
          >
            {isExportingToSpotify ? (
              <>
                <div className="w-5 h-5 border-3 border-[#1db954] border-t-transparent rounded-full animate-spin" />
                <span className="text-[#1db954] font-semibold">Syncing...</span>
              </>
            ) : (
              <>
                {/* Modern Spotify Icon */}
                <div className="relative flex items-center justify-center">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="flex-shrink-0 filter drop-shadow-sm"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  {/* Subtle pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
                </div>
                <span className="font-bold tracking-wide">
                  {spotifyPlaylistUrl ? "OPEN ON SPOTIFY" : "SAVE TO SPOTIFY"}
                </span>
                {/* Status indicator dot */}
                <div className={clsx(
                  "w-2 h-2 rounded-full",
                  spotifyPlaylistUrl ? "bg-white animate-pulse" : "bg-[#1db954] opacity-60"
                )}></div>
              </>
            )}
          </button>
        </div>
      )}
    </div>
    
  );
}