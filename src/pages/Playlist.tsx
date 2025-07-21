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

// Simple, consistent color assignment based on genre hash
const getGenreColor = (genre: string): string => {
    const colors = [
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
        "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
        "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
        "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300",
        "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
        "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
    ];

    // Create a simple hash from genre string to ensure consistency
    let hash = 0;
    for (let i = 0; i < genre.length; i++) {
        hash = ((hash << 5) - hash + genre.charCodeAt(i)) & 0xffffffff;
    }
    
    // Use absolute value to ensure positive index
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
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
        genre: Array.isArray(track.genre) ? track.genre : [track.genre || "Unknown"],
        duration: track.durationMs ? `${Math.floor(track.durationMs / 60000)}:${Math.floor((track.durationMs % 60000) / 1000).toString().padStart(2, '0')}` : "0:00",
        durationMs: track.durationMs || 0,
        coverUrl: track.coverUrl,
        popularity: track.popularity,
        releaseDate: track.releaseDate,
    })) || [];

    console.log(formattedTracks);

    const firstFourTrackCovers = formattedTracks.slice(0, 4).map(track => ({
        coverUrl: track.coverUrl || "",
    }));

    // Calculate total duration from all tracks
    const totalDurationMs = formattedTracks.reduce((total, track) => total + track.durationMs, 0);
    const totalHours = Math.floor(totalDurationMs / 3600000);
    const totalMinutes = Math.floor((totalDurationMs % 3600000) / 60000);
    const totalSeconds = Math.floor((totalDurationMs % 60000) / 1000);
    
    const formatTotalDuration = () => {
        if (totalHours > 0) {
            return `${totalHours}h ${totalMinutes}m`;
        } else if (totalMinutes > 0) {
            return `${totalMinutes}m ${totalSeconds}s`;
        } else {
            return `${totalSeconds}s`;
        }
    };

    const playlistData = playlist ? {
        id: playlist._id,
        name: playlist.name,
        description: desc,
        generatedFrom: "AI Generated Playlist", // Default since field doesn't exist in schema
        createdAt: new Date(playlist.createdAt || Date.now()).toLocaleDateString(),
        duration: `${formattedTracks.length} tracks`, // Calculate from tracks
        tracks: formattedTracks.map(track => ({
            id: track.id,
            title: track.title,
            artist: track.artist,
            album: track.album,
            duration: track.duration
        }))
    } : null;

    return (
        <main className="w-[90vw] mx-auto  p-6 pt-0 relative z-0 font-sans flex flex-col min-h-[540px]"
            style={{
                fontFamily: `'Inter', 'Segoe UI', Arial, sans-serif`,
            }}
        >
            {/* Header Section */}
            <div className="flex flex-col gap-8 pt-2 bg-transparent relative z-10">
                <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-10 shadow-xl border border-[#31c266]/20 dark:border-gray-700 backdrop-blur-xl relative overflow-hidden">
                    <PlaylistInfo
                        name={playlist.name}
                        desc={desc}
                        editing={editing}
                        descDraft={descDraft}
                        setEditing={setEditing}
                        setDescDraft={setDescDraft}
                        setDesc={setDesc}
                        createdAt={playlist.createdAt}
                        duration={formatTotalDuration()}
                        tracksCount={formattedTracks.length}
                        moods={playlist.moods}
                        firstFourTrackCovers={firstFourTrackCovers}
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
                <PlaylistTrackTable tracks={formattedTracks} getGenreColor={getGenreColor} />
            </div>
        </main>
    );
};

export default Playlist;