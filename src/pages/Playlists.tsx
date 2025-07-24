import { useState, useEffect } from "react";
import { Music, Heart } from "lucide-react";
import { PlaylistCard } from "../components/app/Playlists/PlaylistCard";
import { PlaylistDeleteModal } from "../components/app/Playlists/PlaylistDeleteModal";
import { useMutation, useQuery } from "convex/react";
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
    accent: "orange-500",
    primary: "orange-400",
    secondary: "pink-500",
    border: "border-orange-200"
  },
  {
    name: "ocean",
    bg: "bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500",
    accent: "blue-500",
    primary: "blue-400",
    secondary: "indigo-500",
    border: "border-blue-200"
  },
  {
    name: "forest",
    bg: "bg-gradient-to-br from-emerald-300 via-green-400 to-teal-500",
    accent: "green-500",
    primary: "green-400",
    secondary: "teal-500",
    border: "border-green-200"
  },
  {
    name: "lavender",
    bg: "bg-gradient-to-br from-violet-300 via-purple-400 to-fuchsia-500",
    accent: "purple-500",
    primary: "purple-400",
    secondary: "fuchsia-500",
    border: "border-purple-200"
  },
  {
    name: "golden",
    bg: "bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400",
    accent: "yellow-500",
    primary: "yellow-400",
    secondary: "orange-400",
    border: "border-yellow-200"
  },
  {
    name: "rose",
    bg: "bg-gradient-to-br from-pink-300 via-rose-400 to-red-400",
    accent: "pink-500",
    primary: "rose-400",
    secondary: "red-400",
    border: "border-pink-200"
  },
  {
    name: "cosmic",
    bg: "bg-gradient-to-br from-indigo-400 via-purple-500 to-violet-600",
    accent: "indigo-500",
    primary: "indigo-400",
    secondary: "violet-600",
    border: "border-indigo-200"
  },
  {
    name: "mint",
    bg: "bg-gradient-to-br from-teal-300 via-cyan-400 to-blue-400",
    accent: "teal-500",
    primary: "teal-400",
    secondary: "blue-400",
    border: "border-teal-200"
  },
  {
    name: "autumn",
    bg: "bg-gradient-to-br from-red-300 via-orange-400 to-yellow-500",
    accent: "red-500",
    primary: "orange-400",
    secondary: "yellow-500",
    border: "border-red-200"
  },
  {
    name: "midnight",
    bg: "bg-gradient-to-br from-slate-400 via-gray-500 to-zinc-600",
    accent: "slate-600",
    primary: "slate-500",
    secondary: "zinc-600",
    border: "border-slate-300"
  },
  {
    name: "tropical",
    bg: "bg-gradient-to-br from-lime-300 via-green-400 to-emerald-500",
    accent: "lime-500",
    primary: "green-400",
    secondary: "emerald-500",
    border: "border-lime-200"
  },
  {
    name: "coral",
    bg: "bg-gradient-to-br from-pink-300 via-orange-400 to-red-400",
    accent: "pink-400",
    primary: "orange-400",
    secondary: "red-400",
    border: "border-pink-200"
  },
  {
    name: "arctic",
    bg: "bg-gradient-to-br from-cyan-200 via-blue-300 to-indigo-400",
    accent: "cyan-500",
    primary: "blue-300",
    secondary: "indigo-400",
    border: "border-cyan-200"
  },
  {
    name: "berry",
    bg: "bg-gradient-to-br from-purple-300 via-pink-400 to-red-500",
    accent: "purple-600",
    primary: "pink-400",
    secondary: "red-500",
    border: "border-purple-200"
  },
  {
    name: "emerald",
    bg: "bg-gradient-to-br from-green-200 via-emerald-300 to-teal-400",
    accent: "emerald-500",
    primary: "emerald-300",
    secondary: "teal-400",
    border: "border-emerald-200"
  },
  {
    name: "neon",
    bg: "bg-gradient-to-br from-violet-400 via-fuchsia-500 to-pink-600",
    accent: "fuchsia-500",
    primary: "fuchsia-500",
    secondary: "pink-600",
    border: "border-fuchsia-200"
  },
  {
    name: "copper",
    bg: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-600",
    accent: "amber-600",
    primary: "orange-500",
    secondary: "red-600",
    border: "border-amber-300"
  },
  {
    name: "sapphire",
    bg: "bg-gradient-to-br from-blue-300 via-indigo-400 to-purple-500",
    accent: "blue-600",
    primary: "indigo-400",
    secondary: "purple-500",
    border: "border-blue-200"
  },
  {
    name: "pearl",
    bg: "bg-gradient-to-br from-gray-200 via-slate-300 to-zinc-400",
    accent: "gray-500",
    primary: "slate-300",
    secondary: "zinc-400",
    border: "border-gray-300"
  },
  {
    name: "fire",
    bg: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600",
    accent: "orange-600",
    primary: "orange-500",
    secondary: "red-600",
    border: "border-orange-200"
  },
  {
    name: "galaxy",
    bg: "bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700",
    accent: "indigo-600",
    primary: "purple-600",
    secondary: "pink-700",
    border: "border-indigo-300"
  },
  {
    name: "jade",
    bg: "bg-gradient-to-br from-green-300 via-teal-400 to-cyan-500",
    accent: "teal-600",
    primary: "teal-400",
    secondary: "cyan-500",
    border: "border-teal-200"
  },
  {
    name: "storm",
    bg: "bg-gradient-to-br from-gray-400 via-slate-500 to-blue-600",
    accent: "slate-700",
    primary: "slate-500",
    secondary: "blue-600",
    border: "border-slate-300"
  },
  {
    name: "cherry",
    bg: "bg-gradient-to-br from-red-400 via-pink-500 to-rose-600",
    accent: "red-600",
    primary: "pink-500",
    secondary: "rose-600",
    border: "border-red-300"
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
  const [showSpotifyOnly, setShowSpotifyOnly] = useState(false);
  const [deleteModal, setDeleteModal] = useState<null | string>(null);

  // Fetch playlists using Convex query
  const fetchedPlaylists = useQuery(api.playlistActions.getAllPlaylists, { userId: user.userId });
  const allPlaylists = fetchedPlaylists || [];

  const userLikedPlaylists = useQuery(api.playlistLikes.getUserLiked, { userId: user.userId });

  useEffect(() => {
    if (userLikedPlaylists) {
      // console.log("User liked playlists:", userLikedPlaylists);
      const likedPlaylistIds = userLikedPlaylists.map(like => like.playlistId);
      setLikedPlaylists(likedPlaylistIds);
    }
  }, [userLikedPlaylists]);

  const playlists = allPlaylists
    .filter((playlist: { name: string; description: string; _id: string; spotifyPlaylistUrl?: string; }) => {
      const matchesSearch = searchQuery === "" || 
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (playlist.description && playlist.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFavorites = !showFavoritesOnly || likedPlaylists.includes(playlist._id);
      const matchesSpotify = !showSpotifyOnly || playlist.spotifyPlaylistUrl;
      
      return matchesSearch && matchesFavorites && matchesSpotify;
    })
    .sort((a: Doc<"playlists">, b: Doc<"playlists">) => {
      return b._creationTime - a._creationTime;
    });

  


  const toggleLikeBackend = useMutation(api.playlistLikes.togglePlaylistLike);

  const toggleLike = async (playlistId: string) => {
    setLikedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
    await toggleLikeBackend({ userId: user.userId, playlistId: playlistId as Id<"playlists"> });
  };

  return (
    <main
      className="
        w-[90vw] mx-auto my-12 p-6 mt-3
        rounded-3xl shadow-2xl
        border border-[#31c266]/30 dark:border-gray-700
        bg-white/95 dark:bg-gray-900/95
        backdrop-blur-2xl
        relative z-0
        font-sans
        flex flex-col
        min-h-[540px]
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
              {/* Status Badges - Multiple can be active */}
              <div className="flex items-center gap-2">
                {/* Search Badge */}
                {searchQuery && (
                  <div className="px-3 py-1.5 rounded-full border bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      "{searchQuery.slice(0, 12)}{searchQuery.length > 12 ? '...' : ''}"
                    </span>
                  </div>
                )}
                
                {/* Favorites Badge */}
                {showFavoritesOnly && (
                  <div className="px-3 py-1.5 rounded-full border bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700">
                    <span className="text-sm font-medium flex items-center gap-1 text-red-700 dark:text-red-300">
                      
                      Favorites Only
                    </span>
                  </div>
                )}
                
                {/* Spotify Badge */}
                {showSpotifyOnly && (
                  <div className="px-3 py-1.5 rounded-full border bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Spotify Only
                    </span>
                  </div>
                )}
                
                {/* All Playlists Badge (when no filters active) */}
                {!searchQuery && !showFavoritesOnly && !showSpotifyOnly && (
                  <div className="px-3 py-1.5 rounded-full border bg-[#31c266]/10 dark:bg-[#31c266]/20 border-[#31c266]/20 dark:border-[#31c266]/30">
                    <span className="text-sm font-medium text-[#31c266]">
                      All Playlists ({playlists.length})
                    </span>
                  </div>
                )}
                
                {/* Results Count Badge (when filters are active) */}
                {(searchQuery || showFavoritesOnly || showSpotifyOnly) && (
                  <div className="px-3 py-1.5 rounded-full border bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {playlists.length} results
                    </span>
                  </div>
                )}
              </div>
              
              {/* Clear Filters Button */}
              {(searchQuery || showFavoritesOnly || showSpotifyOnly) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowFavoritesOnly(false);
                    setShowSpotifyOnly(false);
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

              {/* Spotify Toggle */}
              <button
                onClick={() => setShowSpotifyOnly(!showSpotifyOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                  showSpotifyOnly
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${showSpotifyOnly ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">
                  Spotify
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 gap-y-6 relative z-10">
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