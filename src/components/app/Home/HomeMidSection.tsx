import PlaylistForm from "./PlaylistForm"
import MusicDNA from "./MusicDNA"

interface HomeMidSectionProps {
    description: string
    setDescription: (desc: string) => void
    playlistName: string
    setPlaylistName: (name: string) => void
    isGenerating: boolean
    handleGenerate: () => void
    focusedInput: string | null
    setFocusedInput: (input: string | null) => void
    isSpotifyConnected: boolean
}

const HomeMidSection = ({
    description,
    setDescription,
    playlistName,
    setPlaylistName,
    isGenerating,
    handleGenerate,
    setFocusedInput,
    isSpotifyConnected,
}: HomeMidSectionProps) => (
    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-[#31c266]/15 dark:border-gray-700 ">
        {/* Simplified decorative background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-[#31c266]/2 via-transparent to-emerald-500/3" />
            
            {/* Reduced floating elements */}
            <div className="absolute top-8 right-16 w-12 h-12 bg-[#31c266]/5 rounded-full animate-pulse" />
            <div className="absolute bottom-12 left-16 w-8 h-8 bg-emerald-400/8 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
            
            {/* Simplified wave patterns */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 400" fill="none">
                <defs>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#31c266" stopOpacity="0.08" />
                        <stop offset="50%" stopColor="#31c266" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="#31c266" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d="M0 200 Q 250 150 500 200 T 1000 200"
                    stroke="url(#waveGrad)"
                    strokeWidth="1"
                    fill="none"
                    className="animate-pulse"
                />
            </svg>
        </div>

        <div className="relative p-6">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                {/* Left Column - MusicDNA (2/7 width) */}
                <div className="lg:col-span-2 relative my-auto">
                    <div className="sticky top-8">
                        <MusicDNA isSpotifyConnected={isSpotifyConnected} />
                    </div>
                </div>

                {/* Right Column - PlaylistForm (5/7 width) */}
                <div className="lg:col-span-5 relative">
                    <PlaylistForm
                        description={description}
                        setDescription={setDescription}
                        playlistName={playlistName}
                        setPlaylistName={setPlaylistName}
                        isGenerating={isGenerating}
                        handleGenerate={handleGenerate}
                        setFocusedInput={setFocusedInput}
                    />
                </div>
            </div>
        </div>

        {/* Simplified border accents */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#31c266]/40 to-transparent rounded-b-2xl" />
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#31c266]/30 to-transparent rounded-l-2xl" />
        
        {/* Minimal corner accents */}
        <div className="absolute top-3 left-3 w-2 h-2 bg-[#31c266]/20 rounded-full animate-pulse" />
        <div className="absolute bottom-3 right-3 w-2 h-2 bg-emerald-400/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
)

export default HomeMidSection