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
          {tracks.map((track, idx) => (
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
  );
}