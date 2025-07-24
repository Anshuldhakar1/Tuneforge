import { useState } from "react";
import { Music, Heart } from "lucide-react";
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

  // Filter playlists based on search query and favorites, then sort by newest first
  const playlists = allPlaylists
    .filter((playlist: { name: string; description: string; _id: string; }) => {
      const matchesSearch = searchQuery === "" || 
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (playlist.description && playlist.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFavorites = !showFavoritesOnly || likedPlaylists.includes(playlist._id);
      
      return matchesSearch && matchesFavorites;
    })
    .sort((a: Doc<"playlists">, b: Doc<"playlists">) => {
      // Sort by creation time, newest first
      return b._creationTime - a._creationTime;
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

      {/* Card-style Header Section */}
      <div className="relative mb-8 z-10">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center">
            {/* Left Side - Compact Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#31c266] rounded-full animate-pulse" />
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Your Playlists
                </h1>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-4 ml-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-[#31c266] rounded-full animate-pulse shadow-md" />
                  <Music size={14} className="text-[#31c266]" />
                  <span className="font-medium text-[#31c266]">{allPlaylists.length} total</span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-md" />
                  <span className="font-medium text-red-600 dark:text-red-400">{likedPlaylists.length} favorited</span> 
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-md" />
                  <span className="text-purple-600 dark:text-purple-400">Recent activity</span>
                </div>
              </div>
            </div>
            
            {/* Right Side - Controls */}
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <div className={`px-3 py-1.5 rounded-full border ${
                showFavoritesOnly 
                  ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700'
                  : searchQuery 
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700'
                    : 'bg-[#31c266]/10 dark:bg-[#31c266]/20 border-[#31c266]/20 dark:border-[#31c266]/30'
              }`}>
                <span className={`text-sm font-medium flex items-center gap-1 ${
                  showFavoritesOnly 
                    ? 'text-red-700 dark:text-red-300'
                    : searchQuery 
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-[#31c266]'
                }`}>
                  {showFavoritesOnly && <Heart size={12}/>}
                  {showFavoritesOnly 
                    ? `Favorites Only (${playlists.length})` 
                    : searchQuery 
                      ? `"${searchQuery.slice(0, 12)}${searchQuery.length > 12 ? '...' : ''}" (${playlists.length})`
                      : 'All Playlists'}
                </span>
              </div>
              
              {/* Clear Filters Button */}
              {(searchQuery || showFavoritesOnly) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowFavoritesOnly(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <span className="text-xs font-medium">Clear</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Search and Controls Bar */}
          <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              {/* Extended Search Bar */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search playlists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31c266]/30 focus:border-[#31c266] transition-all shadow-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Music size={16} className="text-gray-400" />
                </div>
              </div>
              
              {/* Favorites Toggle */}
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                  showFavoritesOnly
                    ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${showFavoritesOnly ? 'bg-red-400' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">
                  Favorites
                </span>
              </button>
            </div>
          </div>
        </div>
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