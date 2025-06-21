import { ArrowRight } from "lucide-react"
import type { JSX } from "react"

export interface CuratedPlaylist {
    icon: JSX.Element
    category: string
    title: string
    color: string
    bg: string
    hover: string
}

interface CuratedPlaylistCardProps {
    playlist: CuratedPlaylist
    onClick: () => void
}

const CuratedPlaylistCard = ({ playlist, onClick }: CuratedPlaylistCardProps) => (
    <button
        onClick={onClick}
        className={`${playlist.bg} ${playlist.hover} p-6 rounded-xl transition-all duration-200 text-left group border border-transparent hover:border-gray-200 hover:shadow-lg transform hover:scale-105`}
    >
        <div className="flex items-start gap-4">
            <div
                className={`${playlist.color} p-3 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform duration-200`}
            >
                {playlist.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {playlist.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{playlist.title}</p>
            </div>
        </div>
    </button>
)

export default CuratedPlaylistCard