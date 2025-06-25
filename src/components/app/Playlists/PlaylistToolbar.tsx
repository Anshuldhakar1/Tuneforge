type PlaylistsToolbarProps = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (v: boolean) => void;
};

export function PlaylistsToolbar({
  searchQuery,
  setSearchQuery,
  showFavoritesOnly,
  setShowFavoritesOnly
}: PlaylistsToolbarProps) {
  return (
    <div className="flex gap-1.5 mb-6 items-center">
      <input
        className="flex-1 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31c266] transition text-sm"
        placeholder="Search playlists..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
    </div>
  );
}