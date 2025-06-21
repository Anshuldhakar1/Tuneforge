import { Heart, Grid, List } from "lucide-react";
import clsx from "clsx";

type PlaylistsToolbarProps = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (v: boolean) => void;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
};

export function PlaylistsToolbar({
  searchQuery,
  setSearchQuery,
  showFavoritesOnly,
  setShowFavoritesOnly,
  viewMode,
  setViewMode,
}: PlaylistsToolbarProps) {
  return (
    <div className="flex gap-1.5 mb-6 items-center">
      <input
        className="flex-1 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31c266] transition text-sm"
        placeholder="Search playlists..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <button
        aria-label="Show favorites only"
        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        className={clsx(
          "p-1.5 rounded-full transition",
          showFavoritesOnly
            ? "bg-[#31c266] text-white"
            : "bg-white/70 dark:bg-gray-900/70"
        )}
      >
        <Heart
          size={18}
          color={showFavoritesOnly ? "#fff" : "#ef4444"}
          fill={showFavoritesOnly ? "#ef4444" : "none"}
          className="transition"
        />
      </button>
      <button
        aria-label="Grid view"
        onClick={() => setViewMode("grid")}
        className={clsx(
          "p-1.5 rounded-full transition",
          viewMode === "grid"
            ? "bg-[#31c266] text-white"
            : "bg-white/70 dark:bg-gray-900/70"
        )}
      >
        <Grid size={18} color={viewMode === "grid" ? "#fff" : "#31c266"} />
      </button>
      <button
        aria-label="List view"
        onClick={() => setViewMode("list")}
        className={clsx(
          "p-1.5 rounded-full transition",
          viewMode === "list"
            ? "bg-[#31c266] text-white"
            : "bg-white/70 dark:bg-gray-900/70"
        )}
      >
        <List size={18} color={viewMode === "list" ? "#fff" : "#31c266"} />
      </button>
    </div>
  );
}