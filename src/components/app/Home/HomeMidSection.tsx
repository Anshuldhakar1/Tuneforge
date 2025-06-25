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
    <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-[#31c266]/20 dark:border-gray-700 ">
        {/* Enhanced decorative background */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-[#31c266]/3 via-transparent to-emerald-500/5" />
            
            {/* Floating decorative elements */}
            <div className="absolute top-8 right-16 w-20 h-20 bg-[#31c266]/5 rounded-full animate-pulse" />
            <div className="absolute bottom-12 left-16 w-12 h-12 bg-emerald-400/10 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-20 left-20 w-6 h-6 bg-[#31c266]/15 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 right-20 w-8 h-8 bg-emerald-300/8 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
            
            
            {/* Animated wave patterns */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 400" fill="none">
                <defs>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#31c266" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#31c266" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#31c266" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d="M0 200 Q 250 150 500 200 T 1000 200"
                    stroke="url(#waveGrad)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                />
                <path
                    d="M0 250 Q 250 200 500 250 T 1000 250"
                    stroke="url(#waveGrad)"
                    strokeWidth="1.5"
                    fill="none"
                    className="animate-pulse"
                    style={{ animationDelay: '0.5s' }}
                />
            </svg>
        </div>

        <div className="relative p-8">
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

        {/* Enhanced multi-layered border accents */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#31c266]/50 to-transparent rounded-b-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#31c266]/80 via-emerald-500/60 to-[#31c266]/80 rounded-b-3xl" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#31c266]/40 via-emerald-400/30 to-transparent rounded-l-3xl" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#31c266]/20 to-transparent rounded-t-3xl" />
        
        {/* Corner accent elements */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-[#31c266]/30 rounded-full animate-pulse" />
        <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#31c266]/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-4 right-4 w-3 h-3 bg-emerald-300/35 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
    </div>
)

export default HomeMidSection