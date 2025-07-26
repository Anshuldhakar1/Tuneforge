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
        className={`${playlist.bg} ${playlist.hover} relative p-6 rounded-2xl 
        transition-all duration-300 text-left group border-2 border-gradient-to-r
         from-[#31c266]/20 to-[#1db954]/20 
          transform hover:scale-105
          overflow-hidden backdrop-blur-sm`}
        style={{
            background: `linear-gradient(135deg, ${playlist.bg} 0%, rgba(49, 194, 102, 0.05) 100%)`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}
    >
        {/* Floating bubbles */}
        <div className="absolute top-2 right-4 w-2 h-2 bg-[#31c266]/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="absolute top-8 right-8 w-1 h-1 bg-[#1db954]/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-[#31c266]/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        
        {/* Gradient border overlay */}
        <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-[#31c266]/30 via-[#1db954]/20 to-[#31c266]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-full h-full rounded-2xl bg-white/80 dark:bg-gray-800/80" />
        </div>
        
        <div className="relative z-10 flex items-start gap-4">
            <div
                className={`${playlist.color} p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 border border-white/50`}
                style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
            >
                {playlist.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                    <span className={`${playlist.color} text-xs font-bold uppercase tracking-wider bg-[#31c266]/10 px-2 py-1 rounded-full`}>
                        {playlist.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#31c266] opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:scale-110" />
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-semibold group-hover:text-[#31c266] transition-colors duration-300">{playlist.title}</p>
            </div>
        </div>
    </button>
)

export default CuratedPlaylistCard