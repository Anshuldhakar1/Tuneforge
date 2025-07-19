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
      <div className="">
        {tracks.map((track, idx) => (
          <div
            key={track.id}
            className="relative overflow-hidden rounded-sm bg-white dark:bg-gray-900 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#31c266]/5 via-[#31c266]/2 to-[#31c266]/5"></div>
            
            {/* Content */}
            <div className="relative flex items-center px-6 py-4">
              {/* Left Section: Number + Cover + Track Info */}
              <div className="flex items-center gap-6 flex-1 min-w-0">
                {/* Track Number */}
                <div className="flex-shrink-0 w-8 text-center">
                  <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                    {idx + 1}
                  </span>
                </div>

                {/* Cover Image */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#eafaf2] to-emerald-100 dark:from-[#223c2e] dark:to-green-900/30 flex items-center justify-center">
                    {track.coverUrl ? (
                      <img
                        src={track.coverUrl}
                        alt={`${track.title} cover`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Music size={24} className="text-[#31c266] opacity-60" />
                    )}
                  </div>
                </div>

                {/* Track Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate mb-1">
                    {track.title}
                  </h3>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <span className="font-medium truncate">{track.artist}</span>
                    <span className="text-gray-400">•</span>
                    <span className="truncate">{track.album}</span>
                  </div>
                </div>
              </div>

              {/* Right Section: Genre + Stats + Duration */}
              <div className="flex items-center gap-8 flex-shrink-0">
                {/* Genre Badge */}
                <div className="hidden lg:block">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {track.genre.slice(0, 2).map((singleGenre, genreIdx) => (
                      <span
                        key={genreIdx}
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getGenreColor(singleGenre)}`}
                      >
                        {singleGenre}
                      </span>
                    ))}
                    {track.genre.length > 2 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        +{track.genre.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Popularity Score */}
                {track.popularity !== undefined && (
                  <div className="hidden md:flex items-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 px-4 py-2 rounded-full">
                    <TrendingUp size={16} className="text-[#31c266]" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {track.popularity}
                    </span>
                  </div>
                )}

                {/* Duration */}
                <div className="flex items-center gap-2 bg-[#31c266]/10 dark:bg-[#31c266]/20 px-4 py-2 rounded-full">
                  <Clock size={16} className="text-[#31c266]" />
                  <span className="text-sm font-bold text-[#31c266] dark:text-emerald-400">
                    {track.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Section */}
            <div className="lg:hidden px-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {track.genre.slice(0, 2).map((singleGenre, genreIdx) => (
                    <span
                      key={genreIdx}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getGenreColor(singleGenre)}`}
                    >
                      {singleGenre}
                    </span>
                  ))}
                  {track.genre.length > 2 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      +{track.genre.length - 2}
                    </span>
                  )}
                </div>
                
                {track.popularity !== undefined && (
                  <div className="flex items-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 px-3 py-1.5 rounded-full md:hidden">
                    <TrendingUp size={14} className="text-[#31c266]" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      {track.popularity}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#31c266] to-emerald-500"></div>
            <div className="absolute bottom-0 right-0 w-20 h-0.5 bg-gradient-to-l from-[#31c266]/30 to-transparent"></div>
          </div>
        ))}
      </div>
    </div>
  );
}