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
}: HomeMidSectionProps) => (
    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-[#31c266]/15 dark:border-gray-700">
        {/* Enhanced decorative background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-[#31c266]/10 via-transparent to-emerald-500/8" />
            
            {/* Enhanced floating elements */}
            <div className="absolute top-8 right-16 w-16 h-16 bg-[#31c266]/10 rounded-full animate-pulse" />
            <div className="absolute top-[30%] right-[10%] w-24 h-24 bg-[#31c266]/5 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
            <div className="absolute bottom-12 left-16 w-10 h-10 bg-emerald-400/15 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-[20%] left-[40%] w-6 h-6 bg-emerald-300/10 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }} />
            
            {/* Enhanced wave patterns */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 400" fill="none">
                <defs>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#31c266" stopOpacity="0.15" />
                        <stop offset="50%" stopColor="#31c266" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#31c266" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
                        <stop offset="50%" stopColor="#10b981" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
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
                    d="M0 250 Q 200 200 400 250 T 800 250 T 1000 250"
                    stroke="url(#waveGrad2)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                    style={{ animationDelay: '0.5s' }}
                />
            </svg>

            {/* Music notes decorations */}
            <svg className="absolute top-[5%] left-[5%] w-8 h-8 opacity-20 animate-pulse" viewBox="0 0 24 24">
                <path fill="#31c266" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <svg className="absolute bottom-[10%] right-[8%] w-6 h-6 opacity-15 animate-pulse" viewBox="0 0 24 24" style={{ animationDelay: '1s' }}>
                <path fill="#10b981" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
        </div>

        <div className="relative p-6">
            {/* Section Title */}
            <div className="text-center relative">
                
                {/* Decorative music icon */}
                <div className="absolute -top-1 -left-1 opacity-20">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm10-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-1.5-8l-9-4.5V15h2V8.66L17.5 12h.5c.55 0 1-.45 1-1s-.45-1-1-1h-2z" fill="#31c266"/>
                    </svg>
                </div>
                <div className="absolute -top-1 -right-1 opacity-20">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="#31c266"/>
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                {/* Left Column - MusicDNA (2/7 width) */}
                <div className="lg:col-span-2 relative my-auto">
                    <div className="sticky top-8">
                        <MusicDNA />
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

        {/* Enhanced border accents */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#31c266]/50 to-transparent rounded-b-2xl" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#31c266]/40 to-transparent rounded-l-2xl" />
        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent to-[#31c266]/30 rounded-r-2xl" />
        {/* <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#31c266]/30 via-transparent to-[#31c266]/30 rounded-t-2xl" /> */}
        
        {/* Enhanced corner accents */}
        <div className="absolute top-3 left-3 w-3 h-3 bg-[#31c266]/30 rounded-full animate-pulse" />
        <div className="absolute top-3 right-3 w-2 h-2 bg-[#31c266]/20 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
        <div className="absolute bottom-3 left-3 w-2 h-2 bg-emerald-400/20 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-3 right-3 w-3 h-3 bg-emerald-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
)

export default HomeMidSection