import { useParams } from "react-router-dom";
import {
    XCircle,
} from "lucide-react";
import React from "react";
import { PlaylistHeader } from "../components/app/PlaylistHeader";
import { PlaylistInfo } from "../components/app/PlaylistInfo";
import { PlaylistActions } from "../components/app/PlaylistActions";
import { PlaylistTrackTable } from "../components/app/PlaylistTrackTable";

// Mock data for demonstration
const playlists = [
    {
        id: "1",
        name: "Code & Chill: Lo-fi & Ambient Vibes",
        generatedFrom:
            "Lo-fi hip hop and ambient soundscapes perfect for deep coding sessions and creative work",
        description:
            "A carefully curated collection of lo-fi hip hop and ambient tracks designed to enhance focus and creativity during coding sessions. Perfect background music for deep work.",
        createdAt: "2025-06-13",
        duration: "36 min total",
        tracks: [
            {
                id: "1",
                title: "Midnight Coding Session",
                artist: "LoFi Collective",
                album: "Digital Dreams",
                genre: "Lo-Fi Hip Hop",
                duration: "3:42",
            },
            {
                id: "2",
                title: "Ambient Workspace",
                artist: "Chillhop Essentials",
                album: "Focus Flow",
                genre: "Ambient",
                duration: "4:15",
            },
            {
                id: "3",
                title: "Rainy Day Vibes",
                artist: "Study Music Project",
                album: "Concentration",
                genre: "Lo-Fi Hip Hop",
                duration: "5:23",
            },
        ],
    },
];

interface PlaylistProps {
    user: {
        username: string;
        email: string;
        userId: string;
    };
}

const genreColors: Record<string, string> = {
    "Lo-Fi Hip Hop": "bg-purple-100 text-purple-700",
    Ambient: "bg-indigo-100 text-indigo-700",
};

const Playlist: React.FC<PlaylistProps> = ({ user }) => {
    const { playlistId } = useParams<{ playlistId: string }>();
    const playlist = playlists.find((p) => p.id === playlistId);

    // Like state (for demo)
    const [liked, setLiked] = React.useState(false);

    // Editable description state
    const [editing, setEditing] = React.useState(false);
    const [desc, setDesc] = React.useState(playlist?.description || "");
    const [descDraft, setDescDraft] = React.useState(desc);

    React.useEffect(() => {
        setDesc(playlist?.description || "");
        setDescDraft(playlist?.description || "");
    }, [playlist]);

    // Not found page
    if (!playlist) {
        return (
            <div className="max-w-2xl mx-auto mt-24 p-10 rounded-3xl shadow-2xl border-2 border-[#31c266]/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl flex flex-col items-center text-center">
                <XCircle size={64} className="text-[#ef4444] mb-4" />

                {user && <span>{user.username}</span>}
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Playlist Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    The playlist you are looking for does not exist or has been removed.
                </p>
                <a
                    href="/"
                    className="inline-block px-6 py-2 rounded-full bg-[#31c266] text-white font-medium hover:bg-[#259a4d] transition"
                >
                    Go back to Home
                </a>
            </div>
        );
    }

    return (
        <main
            className="
        w-full p-4
        rounded-3xl shadow-2xl
        relative z-10
        font-sans
      "
        >
            {/* Header Section */}
            <div
                className="
          flex flex-col md:flex-row gap-8 p-4 pt-8
          items-stretch
          bg-transparent
        "
            >
                <PlaylistHeader />
                <div className="flex-1 flex flex-col justify-center bg-white rounded-xl p-6 min-h-[260px] shadow border border-[#eafaf2] dark:bg-gray-900 dark:border-[#223c2e]">
                    <PlaylistInfo
                        name={playlist.name}
                        generatedFrom={playlist.generatedFrom}
                        desc={desc}
                        editing={editing}
                        descDraft={descDraft}
                        setEditing={setEditing}
                        setDescDraft={setDescDraft}
                        setDesc={setDesc}
                        createdAt={playlist.createdAt}
                        duration={playlist.duration}
                        tracksCount={playlist.tracks.length}
                    />
                    <PlaylistActions liked={liked} setLiked={setLiked} />
                </div>
            </div>
            <PlaylistTrackTable tracks={playlist.tracks} genreColors={genreColors} />
        </main>
    );
};

export default Playlist;