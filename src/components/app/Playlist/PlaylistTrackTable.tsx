import { Clock, Trash2, Music } from "lucide-react";
import clsx from "clsx";

type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
};

type PlaylistTrackTableProps = {
  tracks: Track[];
  genreColors: Record<string, string>;
};

export function PlaylistTrackTable({ tracks, genreColors }: PlaylistTrackTableProps) {
  return (
    <div className="mt-8 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl border border-[#31c266]/20 dark:border-gray-700 overflow-hidden backdrop-blur-xl">
      <table className="min-w-full text-left">
        <thead>
          <tr className="bg-gradient-to-r from-[#eafaf2]/80 to-emerald-50/60 dark:from-[#1e2e25]/80 dark:to-green-900/20">
            <th className="py-4 px-4 font-bold text-[#31c266] text-sm">#</th>
            <th className="py-4 px-4 font-bold text-[#31c266] text-sm">
              Track Details
            </th>
            <th className="py-4 px-4 font-bold text-[#31c266] text-sm">
              Album
            </th>
            <th className="py-4 px-4 font-bold text-[#31c266] text-sm">
              Genre
            </th>
            <th className="py-4 px-4 font-bold text-[#31c266] text-sm">
              <Clock size={12} className="inline" />
            </th>
            <th className="py-4 px-4 font-bold text-[#31c266] text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, idx) => (
            <tr
              key={track.id}
              className={clsx(
                "border-t border-gray-100/50 dark:border-gray-800/50 hover:bg-[#31c266]/5 dark:hover:bg-[#31c266]/10 transition-all duration-200",
                idx % 2 === 0 ? "bg-white/60 dark:bg-gray-900/60" : "bg-gray-50/40 dark:bg-gray-800/40"
              )}
            >
              <td className="py-3 px-4 text-gray-500 text-base font-medium">{idx + 1}</td>
              <td className="py-3 px-4 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#eafaf2] to-emerald-100 dark:from-[#223c2e] dark:to-green-900/30 shadow-sm">
                  <Music size={16} className="text-[#31c266]" />
                </span>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-base">
                    {track.title}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{track.artist}</div>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-base font-medium">
                {track.album}
              </td>
              <td className="py-3 px-4">
                <span
                  className={clsx(
                    "px-3 py-1.5 rounded-full text-xs font-bold shadow-sm",
                    genreColors[track.genre] || "bg-gray-100 text-gray-700"
                  )}
                >
                  {track.genre}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-base font-medium">
                {track.duration}
              </td>
              <td className="py-3 px-4 flex gap-2">
                <button
                  className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 group shadow-sm"
                  aria-label="Delete track"
                >
                  <Trash2
                    size={16}
                    className="text-gray-500 group-hover:text-red-600 transition-all duration-200"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}