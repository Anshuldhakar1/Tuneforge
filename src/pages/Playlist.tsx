import { Link, useParams } from "react-router-dom";
import {
    XCircle,
} from "lucide-react";
import React from "react";
import { PlaylistInfo } from "../components/app/Playlist/PlaylistInfo";
import { PlaylistActions } from "../components/app/Playlist/PlaylistActions";
import { PlaylistTrackTable } from "../components/app/Playlist/PlaylistTrackTable";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface PlaylistProps {
    user: {
        username: string;
        email: string;
        userId: string;
    };
    isSpotifyConnected: boolean;
}

const genreColors: Record<string, string> = {
    "Lo-Fi Hip Hop": "bg-purple-100 text-purple-700",
    Ambient: "bg-indigo-100 text-indigo-700",
    "Hip Hop": "bg-orange-100 text-orange-700",
    Electronic: "bg-blue-100 text-blue-700",
    Rock: "bg-red-100 text-red-700",
    Pop: "bg-pink-100 text-pink-700",
    Jazz: "bg-yellow-100 text-yellow-700",
    Classical: "bg-gray-100 text-gray-700",
    "R&B": "bg-purple-100 text-purple-700",
    Country: "bg-green-100 text-green-700",
};

const Playlist: React.FC<PlaylistProps> = ({ user, isSpotifyConnected }) => {
    const { playlistId } = useParams<{ playlistId: string }>();
    
    // Fetch playlist data from backend - let backend handle validation
    const playlist = useQuery(
        api.playlistActions.getPlaylist, 
        playlistId ? { playlistId: playlistId } : "skip"
    );
    
    // Fetch playlist tracks from backend - let backend handle validation
    const tracks = useQuery(
        api.playlistActions.getPlaylistTracksFromId,
        playlistId ? { playlistId: playlistId } : "skip"
    );

    // Spotify export functionality
    const createPlaylistMutation = useAction(api.spotifyCreate.createPlaylist);
    const [isExportingToSpotify, setIsExportingToSpotify] = React.useState(false);

    // Like state (for demo)
    const [liked, setLiked] = React.useState(false);

    // Editable description state
    const [editing, setEditing] = React.useState(false);
    const [desc, setDesc] = React.useState(playlist?.description || "");
    const [descDraft, setDescDraft] = React.useState(desc);

    React.useEffect(() => {
        if (playlist) {
            setDesc(playlist.description || "");
            setDescDraft(playlist.description || "");
        }
    }, [playlist]);

    const handleExportToSpotify = async () => {
        if (!playlist || !user) {
            return;
        }
        
        try {
            setIsExportingToSpotify(true);
            const sessionToken = localStorage.getItem("session_token");
            if (!sessionToken) {
                toast("You must be logged in to export to Spotify.");
                return;
            }
            await createPlaylistMutation({
                token: sessionToken, 
                playlistId: playlist._id,
            });
            
            alert("Playlist exported to Spotify successfully!");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast(`Failed to export playlist to Spotify: ${errorMessage}`);
        } finally {
            setIsExportingToSpotify(false);
        }
    };

    // Loading state
    if (playlist === undefined || tracks === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#31c266] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading playlist...</p>
                </div>
            </div>
        );
    }

    // Handle playlist not found or error
    if (playlist === null || tracks === null) {
        return (
            <div className="max-w-2xl mx-auto mt-24 p-10 rounded-3xl shadow-2xl border-2 border-[#31c266]/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl flex flex-col items-center text-center">
                <XCircle size={64} className="text-[#ef4444] mb-4" />
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Playlist Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    The playlist you are looking for does not exist or has been removed.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-2 rounded-full bg-[#31c266] text-white font-medium hover:bg-[#259a4d] transition"
                >
                    Go back to Home
                </Link>
            </div>
        );
    }

    // Format tracks for component compatibility
    const formattedTracks = tracks?.map(track => ({
        id: track._id,
        title: track.title,
        artist: track.artist,
        album: track.album || "Unknown Album",
        genre: Array.isArray(track.genre) ? track.genre[0] || "Unknown" : track.genre || "Unknown",
        duration: track.durationMs ? `${Math.floor(track.durationMs / 60000)}:${Math.floor((track.durationMs % 60000) / 1000).toString().padStart(2, '0')}` : "0:00",
    })) || [];

    const playlistData = playlist ? {
        id: playlist._id,
        name: playlist.name,
        description: desc,
        generatedFrom: "AI Generated Playlist", // Default since field doesn't exist in schema
        createdAt: new Date(playlist.createdAt || Date.now()).toLocaleDateString(),
        duration: `${formattedTracks.length} tracks`, // Calculate from tracks
        tracks: formattedTracks
    } : null;

    return (
        <main className="w-[90vw] mx-auto my-12 p-6 pt-0 relative z-0 font-sans flex flex-col min-h-[540px]"
            style={{
                fontFamily: `'Inter', 'Segoe UI', Arial, sans-serif`,
            }}
        >
            {/* Header Section */}
            <div className="flex flex-col gap-8 p-4 pt-8 bg-transparent relative z-10 mb-8">
                <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 shadow-xl border border-[#31c266]/20 dark:border-gray-700 backdrop-blur-xl">
                    <PlaylistInfo
                        name={playlist.name}
                        generatedFrom="AI Generated Playlist" // Default since field doesn't exist
                        desc={desc}
                        editing={editing}
                        descDraft={descDraft}
                        setEditing={setEditing}
                        setDescDraft={setDescDraft}
                        setDesc={setDesc}
                        createdAt={playlist.createdAt}
                        duration={`${formattedTracks.length} tracks`}
                        tracksCount={formattedTracks.length}
                    />
                    <PlaylistActions 
                        liked={liked} 
                        setLiked={setLiked}
                        isSpotifyConnected={isSpotifyConnected} // Temporarily set to true for testing
                        playlistData={playlistData!}
                        onExportToSpotify={handleExportToSpotify}
                        isExportingToSpotify={isExportingToSpotify}
                        spotifyPlaylistUrl={playlist.spotifyPlaylistUrl || ""}
                    />
                </div>
            </div>
            
            <div className="relative z-10">
                <PlaylistTrackTable tracks={formattedTracks} genreColors={genreColors} />
            </div>
        </main>
    );
};

export default Playlist;