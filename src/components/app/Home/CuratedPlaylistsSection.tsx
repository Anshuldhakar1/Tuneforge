import CuratedPlaylistCard, { type CuratedPlaylist } from "./CuratedPlaylistCard"

interface CuratedPlaylistsSectionProps {
    curatedPlaylists: CuratedPlaylist[]
    handleCuratedClick: (playlist: CuratedPlaylist) => void
}

const CuratedPlaylistsSection = ({
    curatedPlaylists,
    handleCuratedClick,
}: CuratedPlaylistsSectionProps) => (
    <div className="mt-12 bg-white/80 rounded-lg p-8">
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Some Inspiration?</h3>
            <p className="text-gray-600">Browse these curated playlist ideas to spark your creativity</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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