import { Heart, Play, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Doc } from "convex/_generated/dataModel";

type GradientConfig = {
  name: string;
  bg: string;
  accent: string;
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
  onDelete,
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

  return (
    <div className="group relative w-full max-w-sm mx-auto">
      {/* Main Card Container */}
      <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${gradient.border} dark:border-gray-700 transform hover:-translate-y-1`}>
        
        {/* Header Section with Gradient Background */}
        <div className={`relative h-32 ${gradient.bg} flex items-end justify-between p-4 overflow-hidden`}>
          {/* Enhanced Decorative Elements */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm animate-pulse" />
          <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/30 rounded-full backdrop-blur-sm" />
          <div className="absolute top-6 left-6 w-8 h-8 bg-white/10 rounded-full backdrop-blur-sm" />
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/5 rounded-full backdrop-blur-sm" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/5 rounded-full backdrop-blur-sm" />
          
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
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label={liked ? "Unlike playlist" : "Like playlist"}
            >
              <Heart
                size={16}
                fill={liked ? "#ef4444" : "none"}
                stroke={liked ? "#ef4444" : "#666"}
                className="transition-colors duration-200"
              />
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
        <div className="p-4 space-y-3 relative">
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
                <div className={`absolute -bottom-1 left-0 h-0.5 w-1/3 ${gradient.accent} opacity-30 group-hover:opacity-60 transition-opacity duration-300`} />
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
              className={`p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg text-gray-700 hover:text-gray-900 z-10 border-2 ${gradient.accent.replace('bg-', 'border-')} hover:shadow-xl relative overflow-hidden`}
            >
              <Play size={20} fill="currentColor" />
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${gradient.accent} opacity-50`} />
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
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${gradient.accent} opacity-60 group-hover:opacity-100 transition-all duration-300 transform origin-left scale-x-0 group-hover:scale-x-100`} />
        
        {/* Side accent line */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${gradient.accent} opacity-40 group-hover:opacity-80 transition-opacity duration-300`} />
      </div>
    </div>
  );
}