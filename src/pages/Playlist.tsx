import { useParams } from "react-router-dom";
import {
    Heart,
    Share2,
    Download,
    Edit2,
    Calendar,
    Clock,
    Trash2,
    Headphones,
    Music,
    XCircle,
    Check,
    X,
} from "lucide-react";
import clsx from "clsx";
import React from "react";

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
                {/* Playlist Cover */}
                <div className="flex-shrink-0 flex items-center">
                    <div
                        className="
              w-full md:w-[260px] min-w-[120px] max-w-[320px]
              aspect-square
              h-full
              rounded-2xl
              bg-gradient-to-br from-[#31c266] to-[#1e8c4c]
              flex items-center justify-center
              shadow-lg
              "
                        style={{
                            height: "100%",
                            minHeight: "160px",
                        }}
                    >
                        <Headphones size={64} className="text-white opacity-90" />
                    </div>
                </div>
                {/* Playlist Info */}
                <div className="flex-1 flex flex-col justify-center bg-white rounded-xl p-6 min-h-[260px] shadow border border-[#eafaf2] dark:bg-gray-900 dark:border-[#223c2e]">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2 leading-tight">
                        {playlist.name}
                    </h1>
                    <div className="mb-2">
                        <span className="text-gray-500 text-base font-medium">
                            Generated from:
                        </span>
                        <span className="italic text-gray-600 dark:text-gray-300 ml-2">
                            "{playlist.generatedFrom}"
                        </span>
                    </div>
                    <div className="mb-2 flex items-start gap-2">
                        <span className="text-gray-700 dark:text-gray-200 font-medium mt-1">
                            Description:
                        </span>
                        {!editing ? (
                            <button
                                className="p-1 rounded hover:bg-[#eafaf2] dark:hover:bg-[#223c2e] transition"
                                onClick={() => setEditing(true)}
                                aria-label="Edit description"
                            >
                                <Edit2 size={16} className="text-[#31c266]" />
                            </button>
                        ) : null}
                    </div>
                    {!editing ? (
                        <p className="text-gray-700 dark:text-gray-300 text-base mb-4">
                            {desc}
                        </p>
                    ) : (
                        <div className="mb-4">
                            <textarea
                                className="w-full min-h-[80px] p-2 rounded border border-[#31c266]/30 focus:ring-2 focus:ring-[#31c266] bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition"
                                value={descDraft}
                                onChange={(e) => setDescDraft(e.target.value)}
                                autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#31c266] text-white font-medium hover:bg-[#259a4d] transition"
                                    onClick={() => {
                                        setDesc(descDraft);
                                        setEditing(false);
                                    }}
                                >
                                    <Check size={16} /> Save
                                </button>
                                <button
                                    className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                    onClick={() => {
                                        setDescDraft(desc);
                                        setEditing(false);
                                    }}
                                >
                                    <X size={16} /> Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-4">
                        <span className="flex items-center gap-1">
                            <Calendar size={12} /> Created{" "}
                            {new Date(playlist.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={12} /> {playlist.duration}
                        </span>
                        <span>{playlist.tracks.length} tracks</span>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            className={clsx(
                                "w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 hover:bg-[#eafaf2] dark:hover:bg-[#223c2e] transition",
                                liked && "ring-2 ring-[#ef4444]/40 border-none"
                            )}
                            onClick={() => setLiked((l) => !l)}
                            aria-label="Like playlist"
                        >
                            <Heart
                                size={18}
                                fill={liked ? "#ef4444" : "none"}
                                color={liked ? "#ef4444" : "#31c266"}
                                className="transition"
                            />
                        </button>
                        <button
                            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 hover:bg-[#eafaf2] dark:hover:bg-[#223c2e] transition"
                            aria-label="Share playlist"
                        >
                            <Share2 size={16} className="text-[#31c266]" />
                        </button>
                        <button
                            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 hover:bg-[#eafaf2] dark:hover:bg-[#223c2e] transition"
                            aria-label="Download playlist"
                        >
                            <Download size={16} className="text-[#31c266]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Track Table */}
            <div className="mt-8 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow border border-gray-300 dark:border-gray-800 overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="bg-[#eafaf2] dark:bg-[#1e2e25]">
                            <th className="py-4 px-4 font-semibold text-[#31c266] text-sm">#</th>
                            <th className="py-4 px-4 font-semibold text-[#31c266] text-sm">
                                Track Details
                            </th>
                            <th className="py-4 px-4 font-semibold text-[#31c266] text-sm">
                                Album
                            </th>
                            <th className="py-4 px-4 font-semibold text-[#31c266] text-sm">
                                Genre
                            </th>
                            <th className="py-4 px-4 font-semibold text-[#31c266] text-sm">
                                <Clock size={12} className="inline" />
                            </th>
                            <th className="py-4 px-4 font-semibold text-[#31c266] text-sm">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {playlist.tracks.map((track, idx) => (
                            <tr
                                key={track.id}
                                className={clsx(
                                    "border-t border-gray-100 dark:border-gray-800",
                                    idx % 2 === 0 ? "bg-white/80 dark:bg-gray-900/80" : ""
                                )}
                            >
                                <td className="py-3 px-4 text-gray-500 text-base">{idx + 1}</td>
                                <td className="py-3 px-4 flex items-center gap-3">
                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#eafaf2] dark:bg-[#223c2e]">
                                        <Music size={16} className="text-[#31c266]" />
                                    </span>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white text-base">
                                            {track.title}
                                        </div>
                                        <div className="text-xs text-gray-500">{track.artist}</div>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-base">
                                    {track.album}
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={clsx(
                                            "px-3 py-1 rounded-full text-xs font-medium",
                                            genreColors[track.genre] || "bg-gray-100 text-gray-700"
                                        )}
                                    >
                                        {track.genre}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-base">
                                    {track.duration}
                                </td>
                                <td className="py-3 px-4 flex gap-2">
                                    <button
                                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition group"
                                        aria-label="Delete track"
                                    >
                                        <Trash2
                                            size={16}
                                            className="text-gray-500 group-hover:text-red-600 transition"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
};

export default Playlist;