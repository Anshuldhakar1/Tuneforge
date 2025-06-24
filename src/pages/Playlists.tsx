import { useState, useMemo } from "react";
import { Music } from "lucide-react";
import { PlaylistsToolbar } from "../components/app/Playlists/PlaylistToolbar";
import { PlaylistCard } from "../components/app/Playlists/PlaylistCard";
import { PlaylistDeleteModal } from "../components/app/Playlists/PlaylistDeleteModal";

const staticPlaylists = [
  {
    _id: "1",
    name: "Chill Vibes",
    description: "Perfect for relaxing and unwinding",
    createdAt: Date.now() - 86400000,
    spotifyUrl: "https://open.spotify.com/playlist/1",
    color: "from-[#31c266] to-[#1e8c4c]",
  },
  {
    _id: "2",
    name: "Workout Energy",
    description: "High-energy tracks to fuel your fitness",
    createdAt: Date.now() - 172800000,
    spotifyUrl: "https://open.spotify.com/playlist/2",
    color: "from-[#ef4444] to-[#b91c1c]",
  },
  {
    _id: "3",
    name: "Focus Flow",
    description: "Instrumental beats for deep concentration",
    createdAt: Date.now() - 259200000,
    spotifyUrl: "https://open.spotify.com/playlist/3",
    color: "from-[#3b82f6] to-[#1e40af]",
  },
];

type User = {
  username: string;
  userId: string;
  email: string;
};

type PlaylistsProps = {
  user: User;
};

function Playlists({ user }: PlaylistsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPlaylists, setLikedPlaylists] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [deleteModal, setDeleteModal] = useState<null | string>(null);
  const [playlists] = useState(staticPlaylists); // Can be replaced with actual data fetching

  const toggleLike = (playlistId: string) => {
    setLikedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const filteredPlaylists = useMemo(() => {
    if (!playlists || playlists.length === 0) {
      return [];
    }

    return playlists.filter((playlist) => {
      const matchesSearch =
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (playlist.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesFavorites = showFavoritesOnly
        ? likedPlaylists.includes(playlist._id)
        : true;
      return matchesSearch && matchesFavorites;
    });
  }, [playlists, searchQuery, showFavoritesOnly, likedPlaylists]);

  return (
    <main
      className="
        w-[90vw] mx-auto my-12 p-5
        rounded-2xl shadow-xl
        border border-[#31c266]/20
        bg-white/90 dark:bg-gray-900/90
        backdrop-blur-xl
        relative z-10
        font-sans
        flex flex-col
        min-h-[540px]
      "
      style={{
        fontFamily: `'Inter', 'Segoe UI', Arial, sans-serif`,
        boxShadow:
          "0 8px 32px 0 rgba(49,194,102,0.10), 0 1.5px 6px 0 rgba(30,44,60,0.06)",
      }}
    >
      {user && <span>{user.username}</span>}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        style={{ zIndex: 0 }}
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#31c266" stopOpacity="0.18" />
            <stop offset="1" stopColor="#31c266" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 700 Q 360 600 720 700 T 1440 700 V900 H0 Z"
          fill="url(#waveGradient)"
        />
        <path
          d="M0 600 Q 360 500 720 600 T 1440 600 V900 H0 Z"
          fill="url(#waveGradient)"
          opacity="0.7"
        />
        <path
          d="M0 500 Q 360 400 720 500 T 1440 500 V900 H0 Z"
          fill="url(#waveGradient)"
          opacity="0.5"
        />
      </svg>
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
          Your Playlists
        </h1>
        <div className="w-12 h-1 bg-[#31c266] rounded-full mt-1 mb-1" />
        <p className="text-gray-600 dark:text-gray-300 text-base font-normal">
          Discover and manage your curated music collections
        </p>
      </div>
      <PlaylistsToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <div
        className={
          viewMode === "grid"
            ? "flex gap-4"
            : "flex flex-col gap-3"
        }
      >
        {filteredPlaylists.length > 0 && filteredPlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist._id}
            playlist={playlist}
            liked={likedPlaylists.includes(playlist._id)}
            onLike={toggleLike}
            onDelete={setDeleteModal}
          />
        ))}
      </div>
      {filteredPlaylists.length === 0 && (
        <div className="text-center py-10 animate-fadein-slideup">
          <Music
            size={40}
            color="#31c266"
            className="mx-auto mb-2 opacity-60"
          />
          <h3 className="text-lg font-medium mb-1 text-gray-800 dark:text-white">
            No playlists found
          </h3>
          <p className="mb-4 text-gray-500 text-sm">
            {searchQuery
              ? "Try adjusting your search terms"
              : showFavoritesOnly
                ? "No favorite playlists found"
                : "Create your first playlist to get started"}
          </p>
        </div>
      )}
      <PlaylistDeleteModal
        open={!!deleteModal}
        onCancel={() => setDeleteModal(null)}
        onDelete={() => {
          console.log("Delete playlist id:", deleteModal);
          setDeleteModal(null);
        }}
      />
      <style>{`
        @keyframes fadein-slideup {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadein-slideup {
          animation: fadein-slideup 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </main>
  );
}

export default Playlists;