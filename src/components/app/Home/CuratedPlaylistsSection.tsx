import CuratedPlaylistCard, { type CuratedPlaylist } from "./CuratedPlaylistCard"

interface CuratedPlaylistsSectionProps {
    curatedPlaylists: CuratedPlaylist[]
    handleCuratedClick: (playlist: CuratedPlaylist) => void
}

const CuratedPlaylistsSection = ({
    curatedPlaylists,
    handleCuratedClick,
}: CuratedPlaylistsSectionProps) => (
    <div className="bg-white dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="text-center mb-8 relative">
            <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#31c266] rounded-full animate-pulse" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Need Some Inspiration?</h3>
                <div className="w-2 h-2 bg-[#31c266] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#31c266] to-[#31c266]/60 rounded-full mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400 text-base">Browse these curated playlist ideas to spark your creativity</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curatedPlaylists.map((playlist, index) => (
                <CuratedPlaylistCard
                    key={index}
                    playlist={playlist}
                    onClick={() => handleCuratedClick(playlist)}
                />
            ))}
        </div>
    </div>
)

export default CuratedPlaylistsSection