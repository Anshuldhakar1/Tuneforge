import { Clock, Music, TrendingUp } from "lucide-react";

type PlaylistTrackTableProps = {
  tracks: Array<{
    id: string;
    title: string;
    artist: string;
    album: string;
    genre: string[];
    duration: string;
    coverUrl?: string;
    popularity?: number;
    releaseDate?: string;
  }>;
  getGenreColor: (genre: string) => string;
};

export function PlaylistTrackTable({ tracks, getGenreColor }: PlaylistTrackTableProps) {
  return (
    <div className="mt-8">
      {/* Tracks Grid */}
      <div className="space-y-1">
        {tracks.map((track, idx) => (
          <div
            key={track.id}
            className="relative overflow-hidden rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm border border-gray-200/40 dark:border-gray-700/40"
          >
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#31c266]/2 via-transparent to-[#31c266]/2"></div>
            
            {/* Content */}
            <div className="relative flex items-center px-6 py-3">
              {/* Left Section: Number + Cover + Track Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Track Number */}
                <div className="flex-shrink-0 w-8 text-center">
                  <span className="text-lg font-medium text-gray-400 dark:text-gray-500">
                    {idx + 1}
                  </span>
                </div>

                {/* Cover Image */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm bg-gradient-to-br from-[#eafaf2] to-emerald-100 dark:from-[#223c2e] dark:to-green-900/30 flex items-center justify-center">
                    {track.coverUrl ? (
                      <img
                        src={track.coverUrl}
                        alt={`${track.title} cover`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Music size={20} className="text-[#31c266] opacity-60" />
                    )}
                  </div>
                </div>

                {/* Track Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate mb-1">
                    {track.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium truncate">{track.artist}</span>
                    <span className="text-gray-400">•</span>
                    <span className="truncate">{track.album}</span>
                  </div>
                </div>
              </div>

              {/* Right Section: Genre + Stats + Duration */}
              <div className="flex items-center gap-4 flex-shrink-0 self-center">
                {/* Fixed Width Genre Display */}
                  <div className="h-8 flex items-center">
                    <div className="flex items-center gap-1.5 min-w-max">
                      {track.genre.map((genre, genreIdx) => (
                        <span
                          key={genreIdx}
                          className={`px-2 py-1 rounded-md text-xs font-medium shadow-sm whitespace-nowrap flex-shrink-0 ${getGenreColor(genre)}`}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                </div>

                {/* Compact Popularity Score */}
                {track.popularity !== undefined && (
                  <div className="hidden md:flex items-center justify-center">
                    <div className="relative w-10 h-10">
                      <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 40 40">
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 16}`}
                          strokeDashoffset={`${2 * Math.PI * 16 * (1 - track.popularity / 100)}`}
                          className="text-[#31c266]"
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {track.popularity}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compact Duration */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#31c266]/10 to-emerald-500/10 dark:from-[#31c266]/20 dark:to-emerald-500/20 px-3 py-2 rounded-xl shadow-md">
                  <Clock size={18} className="text-[#31c266]" />
                  <span className="text-xs font-bold text-[#31c266] dark:text-emerald-400">
                    {track.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Section */}
            <div className="lg:hidden px-6 pb-3">
              <div className="flex items-center justify-between">
                <div className="max-w-[60%] overflow-hidden">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                    {track.genre.map((genre, genreIdx) => (
                      <span
                        key={genreIdx}
                        className={`px-2 py-1 rounded-md text-xs font-medium shadow-sm whitespace-nowrap flex-shrink-0 ${getGenreColor(genre)}`}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                
                {track.popularity !== undefined && (
                  <div className="flex items-center gap-2 bg-gray-100/60 dark:bg-gray-800/60 px-2 py-1 rounded-md md:hidden flex-shrink-0">
                    <TrendingUp size={12} className="text-[#31c266]" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {track.popularity}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Minimal Left Border */}
            <div className="absolute top-0 left-0 w-0.5 h-full bg-[#31c266]/40"></div>
          </div>
        ))}
      </div>
    </div>
  );
}