import { useState } from "react";
import { Music } from "lucide-react";
import { PlaylistsToolbar } from "../components/app/Playlists/PlaylistToolbar";
import { PlaylistCard } from "../components/app/Playlists/PlaylistCard";
import { PlaylistDeleteModal } from "../components/app/Playlists/PlaylistDeleteModal";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "convex/_generated/dataModel";

type User = {
  username: string;
  userId: Id<"users">;
  email: string;
};

type PlaylistsProps = {
  user: User;
};

const gradients = [
  {
    name: "sunset",
    bg: "bg-gradient-to-br from-orange-300 via-red-400 to-pink-500",
    accent: "bg-orange-500",
    border: "border-orange-200"
  },
  {
    name: "ocean",
    bg: "bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500",
    accent: "bg-blue-500",
    border: "border-blue-200"
  },
  {
    name: "forest",
    bg: "bg-gradient-to-br from-emerald-300 via-green-400 to-teal-500",
    accent: "bg-green-500",
    border: "border-green-200"
  },
  {
    name: "lavender",
    bg: "bg-gradient-to-br from-violet-300 via-purple-400 to-fuchsia-500",
    accent: "bg-purple-500",
    border: "border-purple-200"
  },
  {
    name: "golden",
    bg: "bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400",
    accent: "bg-yellow-500",
    border: "border-yellow-200"
  },
  {
    name: "rose",
    bg: "bg-gradient-to-br from-pink-300 via-rose-400 to-red-400",
    accent: "bg-pink-500",
    border: "border-pink-200"
  },
  {
    name: "cosmic",
    bg: "bg-gradient-to-br from-indigo-400 via-purple-500 to-violet-600",
    accent: "bg-indigo-500",
    border: "border-indigo-200"
  },
  {
    name: "mint",
    bg: "bg-gradient-to-br from-teal-300 via-cyan-400 to-blue-400",
    accent: "bg-teal-500",
    border: "border-teal-200"
  }
];

const getPlaylistColor = (playlistId: string) => {
  // Create a simple hash from the playlist ID to ensure consistent color assignment
  let hash = 0;
  for (let i = 0; i < playlistId.length; i++) {
    const char = playlistId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return gradients[Math.abs(hash) % gradients.length];
};

function Playlists({ user }: PlaylistsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPlaylists, setLikedPlaylists] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [deleteModal, setDeleteModal] = useState<null | string>(null);

  // Fetch playlists using Convex query
  const fetchedPlaylists = useQuery(api.playlistActions.getAllPlaylists, { userId: user.userId });
  const allPlaylists = fetchedPlaylists || [];

  // Filter playlists based on search query and favorites
  const playlists = allPlaylists.filter((playlist: { name: string; description: string; _id: string; }) => {
    const matchesSearch = searchQuery === "" || 
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (playlist.description && playlist.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFavorites = !showFavoritesOnly || likedPlaylists.includes(playlist._id);
    
    return matchesSearch && matchesFavorites;
  });

  const toggleLike = (playlistId: string) => {
    setLikedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  return (
    <main
      className="
        w-[90vw] mx-auto my-12 p-6 
        rounded-3xl shadow-2xl
        border border-[#31c266]/30 dark:border-gray-700
        bg-white/95 dark:bg-gray-900/95
        backdrop-blur-2xl
        relative z-0
        font-sans
        flex flex-col
        min-h-[540px]
        transform hover:-translate-y-0.5 transition-all duration-300
      "
      style={{
        fontFamily: `'Inter', 'Segoe UI', Arial, sans-serif`,
        boxShadow:
          "0 20px 40px 0 rgba(49,194,102,0.12), 0 8px 16px 0 rgba(30,44,60,0.08), 0 2px 8px 0 rgba(0,0,0,0.04)",
      }}
    >
      {/* Enhanced background with animated elements */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#31c266]/5 via-transparent to-[#31c266]/10 animate-pulse" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-8 right-12 w-4 h-4 bg-[#31c266]/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-20 right-20 w-2 h-2 bg-[#31c266]/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-16 left-12 w-3 h-3 bg-[#31c266]/20 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-32 left-20 w-1 h-1 bg-[#31c266]/40 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-gray-400 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-80"
        style={{ zIndex: -1 }}
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#31c266" stopOpacity="0.15" />
            <stop offset="0.5" stopColor="#31c266" stopOpacity="0.08" />
            <stop offset="1" stopColor="#31c266" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#31c266" stopOpacity="0.12" />
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
          fill="url(#waveGradient2)"
          opacity="0.5"
        />
      </svg>

      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 bg-[#31c266] rounded-full animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Your Playlists
          </h1>
        </div>
        <div className="w-16 h-1.5 bg-gradient-to-r from-[#31c266] to-[#31c266]/60 rounded-full mt-2 mb-3 shadow-sm" />
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium leading-relaxed">
          Discover and manage your curated music collections
        </p>
        {/* Subtle accent line */}
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#31c266]/50 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 mb-6">
        <PlaylistsToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
        />
      </div>

      <div className="flex gap-6 flex-wrap relative z-10">
        {playlists.length > 0 && playlists.map((playlist: Doc<"playlists">) => (
          <PlaylistCard
            key={playlist._id}
            liked={likedPlaylists.includes(playlist._id)}
            onLike={toggleLike}
            onDelete={setDeleteModal}
            playlist={playlist}
            gradient={getPlaylistColor(playlist._id)}
          />
        ))}
      </div>

      {playlists.length === 0 && (
        <div className="text-center py-12 animate-fadein-slideup relative z-10">
          <div className="relative inline-block mb-4">
            <Music
              size={48}
              color="#31c266"
              className="mx-auto opacity-70 drop-shadow-sm"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#31c266]/30 rounded-full animate-ping" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
            No playlists found
          </h3>
          <p className="mb-6 text-gray-500 text-base leading-relaxed max-w-md mx-auto">
            {searchQuery
              ? "Try adjusting your search terms to find what you're looking for"
              : showFavoritesOnly
                ? "No favorite playlists found. Start liking some playlists!"
                : "Create your first playlist to get started on your musical journey"}
          </p>
          {/* Decorative elements around empty state */}
          <div className="absolute -z-10 inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-[#31c266]/5 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Enhanced border accents */}
      <div className="absolute inset-0 rounded-3xl border border-[#31c266]/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#31c266]/30 to-transparent rounded-b-3xl" />

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