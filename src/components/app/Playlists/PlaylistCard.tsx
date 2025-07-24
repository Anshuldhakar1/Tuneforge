import { Heart, Play, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Doc } from "convex/_generated/dataModel";

type GradientConfig = {
  name: string;
  bg: string;
  accent: string;
  primary: string;
  secondary: string;
  border: string;
};

type PlaylistCardProps = {
  playlist: Doc<"playlists">;
  liked: boolean;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  gradient: GradientConfig;
};

export function PlaylistCard({
  playlist,
  liked,
  onLike,
  // onDelete,
  gradient
}: PlaylistCardProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to get color values for inline styles
  const getColorStyle = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'orange-400': '#fb923c',
      'orange-500': '#f97316',
      'blue-400': '#60a5fa',
      'blue-500': '#3b82f6',
      'green-400': '#4ade80',
      'green-500': '#22c55e',
      'purple-400': '#c084fc',
      'purple-500': '#a855f7',
      'yellow-400': '#facc15',
      'yellow-500': '#eab308',
      'rose-400': '#fb7185',
      'pink-500': '#ec4899',
      'indigo-400': '#818cf8',
      'indigo-500': '#6366f1',
      'teal-400': '#2dd4bf',
      'teal-500': '#14b8a6',
      'red-400': '#f87171',
      'red-500': '#ef4444',
      'red-600': '#dc2626',
      'slate-500': '#64748b',
      'slate-600': '#475569',
      'slate-700': '#334155',
      'lime-500': '#84cc16',
      'pink-400': '#f472b6',
      'pink-600': '#db2777',
      'pink-700': '#be185d',
      'cyan-500': '#06b6d4',
      'blue-300': '#93c5fd',
      'blue-600': '#2563eb',
      'emerald-300': '#6ee7b7',
      'emerald-500': '#10b981',
      'fuchsia-500': '#d946ef',
      'amber-600': '#d97706',
      'purple-600': '#9333ea',
      'gray-500': '#6b7280',
      'slate-300': '#cbd5e1',
      'orange-600': '#ea580c',
      'teal-600': '#0d9488',
      'indigo-600': '#4f46e5',
      'violet-600': '#7c3aed',
      'zinc-600': '#52525b',
      'rose-600': '#e11d48',
    };
    return colorMap[colorName] || '#6b7280';
  };

  return (
    <div className="group relative w-full max-w-sm mx-auto" data-playlist-id={playlist._id}>
      {/* Main Card Container */}
      <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${gradient.border} dark:border-gray-700 transform hover:-translate-y-1`}>
        
        {/* Header Section with Gradient Background */}
        <div className={`relative h-[9rem] ${gradient.bg} flex items-end justify-between p-4 overflow-hidden`}>
          {/* Enhanced Decorative Elements */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm animate-pulse" />
          <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/30 rounded-full backdrop-blur-sm" />
          <div className="absolute top-6 left-6 w-8 h-8 bg-white/10 rounded-full backdrop-blur-sm" />
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/5 rounded-full backdrop-blur-sm" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/5 rounded-full backdrop-blur-sm" />
          
          {/* Additional decorative bubbles */}
          <div className="absolute top-1 left-1/3 w-4 h-4 bg-white/15 rounded-full backdrop-blur-sm" />
          <div className="absolute bottom-6 right-8 w-10 h-10 bg-white/8 rounded-full backdrop-blur-sm" />
          <div className="absolute top-8 right-1/4 w-3 h-3 bg-white/25 rounded-full backdrop-blur-sm" />
          <div className="absolute bottom-1 left-1/4 w-5 h-5 bg-white/12 rounded-full backdrop-blur-sm" />
          <div className="absolute top-3 left-3/4 w-2 h-2 bg-white/35 rounded-full backdrop-blur-sm" />
          <div className="absolute bottom-4 right-1/3 w-7 h-7 bg-white/6 rounded-full backdrop-blur-sm" />
          <div className="absolute top-1/4 left-1/5 w-3 h-3 bg-white/18 rounded-full backdrop-blur-sm" />
          <div className="absolute bottom-8 left-3/4 w-4 h-4 bg-white/14 rounded-full backdrop-blur-sm" />
          
          {/* Extra decorative bubbles for more visual interest */}
          <div className="absolute top-2 left-1/2 w-3 h-3 bg-white/22 rounded-full backdrop-blur-sm" />
          <div className="absolute bottom-3 right-1/2 w-2 h-2 bg-white/28 rounded-full backdrop-blur-sm" />
          <div className="absolute top-5 right-3/4 w-1.5 h-1.5 bg-white/40 rounded-full backdrop-blur-sm" />
          <div className="absolute bottom-7 left-1/6 w-6 h-6 bg-white/9 rounded-full backdrop-blur-sm" />
          <div className="absolute top-1/3 right-1/5 w-2.5 h-2.5 bg-white/20 rounded-full backdrop-blur-sm" />
          <div className="absolute bottom-5 left-2/3 w-3.5 h-3.5 bg-white/16 rounded-full backdrop-blur-sm" />
          <div className="absolute top-7 left-1/6 w-1 h-1 bg-white/45 rounded-full backdrop-blur-sm" />
          <div className="absolute bottom-2 right-2/3 w-4.5 h-4.5 bg-white/11 rounded-full backdrop-blur-sm" />
          <div className="absolute top-1/5 left-5/6 w-2 h-2 bg-white/32 rounded-full backdrop-blur-sm" />
          <div className="absolute bottom-1/3 right-1/6 w-1.5 h-1.5 bg-white/38 rounded-full backdrop-blur-sm" />
          <div className="absolute top-4/5 left-1/3 w-2.5 h-2.5 bg-white/19 rounded-full backdrop-blur-sm" />
          <div className="absolute top-0 right-1/2 w-5 h-5 bg-white/13 rounded-full backdrop-blur-sm" />
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
          
          {/* Floating particles */}
          <div className="absolute top-2 right-8 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="absolute top-8 right-12 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          <div className="absolute top-12 right-6 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
          
          {/* Action Buttons */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(playlist._id);
              }}
              className={`relative p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group/like ${
                liked 
                  ? 'bg-gradient-to-r from-red-500/90 to-pink-500/90 hover:from-red-600/90 hover:to-pink-600/90 border border-red-400/50' 
                  : 'bg-white/80 hover:bg-white/90 border border-white/30 hover:border-white/50'
              } hover:scale-110 active:scale-95`}
              aria-label={liked ? "Unlike playlist" : "Like playlist"}
            >
              {/* Decorative background elements */}
              {/* <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
              <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/40 rounded-full" /> */}
              
              {/* Animated ripple effect on click */}
              <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active/like:scale-150 group-active/like:opacity-0 transition-all duration-300" />
              
              <Heart
                size={18}
                fill={liked ? "#ffffff" : "none"}
                stroke={liked ? "#ffffff" : "#374151"}
                className="relative z-10 transition-all duration-300 group-active/like:scale-125 group-hover/like:drop-shadow-sm"
                strokeWidth={liked ? 0 : 2}
              />
              
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 opacity-0 group-hover/like:opacity-100 group-hover/like:translate-x-full transition-all duration-500" />
            </button>

            {/* Spotify Link (if available) */}
            {playlist.spotifyPlaylistUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(playlist.spotifyPlaylistUrl, '_blank', 'noopener,noreferrer');
                }}
                className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Open in Spotify"
                aria-label="Open playlist in Spotify"
              >
                <ExternalLink size={14} />
              </button>
            )}
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4 pt-2 space-y-3 relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-2 right-4 w-2 h-2 bg-gray-400 rounded-full" />
            <div className="absolute bottom-4 left-6 w-1 h-1 bg-gray-400 rounded-full" />
            <div className="absolute top-6 left-2 w-1 h-1 bg-gray-400 rounded-full" />
          </div>
          
          {/* Title */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate relative">
                {playlist.name}
                {/* Subtle underline accent */}
                <div className={`absolute -bottom-1 left-0 h-0.5 w-1/3 bg-${gradient.accent} opacity-30 group-hover:opacity-60 transition-opacity duration-300`} />
              </h3>
              {playlist.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                  {playlist.description}
                </p>
              )}
            </div>

            {/* Play Button */}
            <Link
              to={`/playlist/${playlist._id}`}
              aria-label="View playlist"
              className="p-3 rounded-full backdrop-blur-sm hover:scale-110 transition-all duration-200 shadow-lg hover:text-gray-900 z-10 hover:shadow-xl relative overflow-hidden border-2"
              style={{
                backgroundColor: `${getColorStyle(gradient.primary)}30`,
                borderColor: `${getColorStyle(gradient.primary)}CC`,
                color: getColorStyle(gradient.secondary),
              }}
            >
              <Play size={20} fill="currentColor" />
              
              {/* Decorative dots */}
              <div className="absolute top-1 right-3 w-1 h-1 rounded-full opacity-60" style={{ backgroundColor: getColorStyle(gradient.secondary) }} />
              <div className="absolute top-4 left-2 w-0.5 h-0.5 rounded-full opacity-40" style={{ backgroundColor: getColorStyle(gradient.secondary) }} />
              <div className="absolute bottom-1 left-2 w-0.5 h-0.5 rounded-full opacity-50" style={{ backgroundColor: getColorStyle(gradient.secondary) }} />
              <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full opacity-30" style={{ backgroundColor: getColorStyle(gradient.secondary) }} />
              
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full bg-${gradient.accent} opacity-50`} />
              Created {formatDate(playlist.createdAt)}
            </span>
            <div className="flex items-center gap-2">
              {playlist.spotifyPlaylistUrl && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 dark:text-green-400 font-medium">Spotify</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/5 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Animated Bottom Border Accent */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-${gradient.accent} opacity-60 group-hover:opacity-100 transition-all duration-300 transform origin-left scale-x-0 group-hover:scale-x-100`} />
        
        {/* Side accent line */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${gradient.accent} opacity-40 group-hover:opacity-80 transition-opacity duration-300`} />
      </div>
    </div>
  );
}