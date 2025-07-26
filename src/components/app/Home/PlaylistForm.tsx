import { Play, Music, Wand2 } from "lucide-react"

interface PlaylistFormProps {
    description: string
    setDescription: (desc: string) => void
    playlistName: string
    setPlaylistName: (name: string) => void
    isGenerating: boolean
    handleGenerate: () => void
    setFocusedInput: (input: string | null) => void
}

const PlaylistForm = ({
    description,
    setDescription,
    playlistName,
    setPlaylistName,
    isGenerating,
    handleGenerate,
    setFocusedInput,
}: PlaylistFormProps) => (
    <div className="relative">
        {/* Enhanced decorative background with music-themed elements */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            {/* <div className="absolute inset-0 bg-gradient-to-br from-[#31c266]/10 via-transparent to-emerald-500/12" /> */}
            
            {/* Animated bubbles */}
            <div className="absolute top-4 right-6 w-20 h-20 bg-[#31c266]/12 rounded-full animate-pulse blur-sm" />
            <div className="absolute top-[30%] right-[20%] w-12 h-12 bg-[#31c266]/8 rounded-full animate-pulse blur-sm" style={{ animationDelay: '1.2s' }} />
            <div className="absolute bottom-6 left-6 w-10 h-10 bg-emerald-400/15 rounded-full animate-bounce blur-sm" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-[40%] left-[15%] w-8 h-8 bg-emerald-300/10 rounded-full animate-pulse blur-sm" style={{ animationDelay: '0.8s' }} />
            
        </div>

        {/* Sound wave visualization */}
        <svg className="absolute bottom-[-5%] left-0 w-full h-12 opacity-50" viewBox="0 0 100 20">
            <path d="M0 10 Q 5 5, 10 10 T 20 10 T 30 10 T 40 10 T 50 10 T 60 10 T 70 10 T 80 10 T 90 10 T 100 10" 
                stroke="#31c266" 
                strokeWidth="0.5" 
                fill="none"
                className="animate-pulse" />
            <path d="M0 10 Q 7 3, 14 10 T 28 10 T 42 10 T 56 10 T 70 10 T 84 10 T 100 10" 
                stroke="#31c266" 
                strokeWidth="0.5" 
                fill="none" 
                className="animate-pulse"
                style={{ animationDelay: '0.3s' }} />
            <path d="M0 10 Q 10 15, 20 10 T 40 10 T 60 10 T 80 10 T 100 10" 
                stroke="#31c266" 
                strokeWidth="0.5" 
                fill="none" 
                className="animate-pulse"
                style={{ animationDelay: '0.6s' }} />
        </svg>

        <div className="relative p-7">
            <div className="pt-3 border-2 border-green-400 p-4 rounded-xl relative">

                <div className="absolute w-full h-full top-0 left-0 rounded-xl z-[-1] bg-green-200/15 backdrop-blur-sm" />
                
                <div className="text-center z-[5] py-2">
                    <div className="mt-1 text-sm text-black dark:text-gray-300 font-bold tracking-wide">
                        Craft the perfect playlist with your musical vision
                    </div>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#31c266] to-emerald-400 rounded-full mx-auto mt-2"></div>

                </div>

                {/* Description Input - Enhanced with music-themed styling */}
                <div className="relative group py-4">
                    <div className="flex items-center gap-3 mb-3">
                        {/* <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#31c266] to-emerald-700 flex items-center justify-center shadow-lg">
                            <Music className="w-4 h-4 text-white" />
                        </div> */}
                        <label className="font-bold text-lg text-gray-800 dark:text-gray-200 flex items-center">
                            Describe your perfect playlist
                            <div className="ml-2 bg-red-300/10 rounded-full px-2 py-0.5 text-xs font-normal text-red-500 border border-red-400">Required</div>
                        </label>
                    </div>
                    
                    <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#31c266]/50 via-emerald-500/50 to-[#31c266]/50 opacity-20 rounded-xl blur group-hover:opacity-30 transition-opacity duration-300"></div>
                        
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onFocus={() => setFocusedInput("description")}
                            onBlur={() => setFocusedInput(null)}
                            placeholder="Paint your musical landscape... 'Dreamy synthwave for midnight drives through neon-lit cityscapes, with atmospheric vocals and pulsing basslines...'"
                            className="w-full h-28 px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#31c266]/40 focus:border-[#31c266] resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 bg-white/95 dark:bg-gray-700/95 backdrop-blur-sm shadow-sm transition-all duration-300 text-sm leading-relaxed font-medium group-hover:shadow-md relative z-10"
                            maxLength={500}
                        />
                        
                        {/* Sound wave decoration */}
                        <svg className="absolute bottom-3 left-4 w-20 h-5 opacity-30" viewBox="0 0 100 20">
                            <path d="M0 10 Q 5 5, 10 10 T 20 10 T 30 10 T 40 10 T 50 10" 
                                stroke="#31c266" 
                                strokeWidth="1" 
                                fill="none" 
                                className="group-hover:animate-pulse" />
                        </svg>
                        
                        {/* Enhanced Character count with visualization */}
                        <div className="absolute bottom-3 right-4 flex items-center">
                            <div className="mr-2 h-1.5 w-16 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${
                                        description.length > 450 
                                            ? 'bg-red-500' 
                                            : description.length > 300 
                                                ? 'bg-yellow-500' 
                                                : 'bg-[#31c266]'
                                    }`}
                                    style={{ width: `${Math.min((description.length / 500) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                                description.length > 450 
                                    ? 'bg-red-100 text-red-700 border border-red-200' 
                                    : description.length > 300 
                                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                                        : 'bg-green-100 text-green-700 border border-green-200'
                            }`}>
                                {description.length}/500
                            </div>
                        </div>
                        
                        {/* Focus indicator */}
                        <div className="absolute inset-0 rounded-xl border-2 border-[#31c266]/0 group-focus-within:border-[#31c266]/30 transition-all duration-300 pointer-events-none" />
                    </div>
                </div>

                {/* Playlist Name Input - Enhanced with music-themed styling */}
                <div className="relative group py-4 pt-0">
                    <div className="flex items-center gap-3 mb-3">
                        {/* <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#31c266] to-teal-600 flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 text-white" />
                        </div> */}
                        <label className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                            Custom playlist name
                            <div className="relative top-[2px] ml-2 bg-blue-100 dark:bg-blue-700 rounded-full px-2 py-0.5 text-xs font-normal text-blue-500 dark:text-blue-300 border border-blue-600 dark:border-blue-600">Optional</div>
                        </label>
                    </div>
                    
                    <div className="relative">
                        {/* Subtle gradient background */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/30 via-emerald-500/30 to-teal-500/30 opacity-10 rounded-xl blur group-hover:opacity-20 transition-opacity duration-300"></div>
                        
                        <input
                            type="text"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            onFocus={() => setFocusedInput("name")}
                            onBlur={() => setFocusedInput(null)}
                            placeholder="Leave empty for AI magic, or craft your own title..."
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#31c266]/40 focus:border-[#31c266] text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 bg-white/95 dark:bg-gray-700/95 backdrop-blur-sm shadow-sm transition-all duration-300 text-sm font-medium group-hover:shadow-md relative z-10"
                        />
                        
                        {/* Decorative musical notes */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-30 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none">
                            <svg className="w-4 h-4 group-hover:animate-bounce" viewBox="0 0 24 24" fill="#31c266" style={{ animationDuration: '2s' }}>
                                <path d="M9 18V5l12-2v13" />
                                <circle cx="6" cy="18" r="3" />
                                <circle cx="18" cy="16" r="3" />
                            </svg>
                            <svg className="w-3 h-3 group-hover:animate-bounce" viewBox="0 0 24 24" fill="#31c266" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }}>
                                <path d="M9 18V5l12-2v13" />
                                <circle cx="6" cy="18" r="3" />
                                <circle cx="18" cy="16" r="3" />
                            </svg>
                        </div>
                        
                        {/* Focus indicator with more dynamic effect */}
                        <div className="absolute inset-0 rounded-xl border-2 border-[#31c266]/0 group-focus-within:border-[#31c266]/30 group-focus-within:shadow-[0_0_10px_rgba(49,194,102,0.3)] transition-all duration-300 pointer-events-none" />
                    </div>
                </div>

                {/* Enhanced CTA Button with animations */}
                <div className="pt-4 flex justify-center">
                    <button
                        onClick={handleGenerate}
                        disabled={!description.trim() || isGenerating}
                        className="group relative bg-gradient-to-r from-[#31c266] to-emerald-600 hover:from-[#2eb55f] hover:to-emerald-700 disabled:from-[#31c266]/50 disabled:to-emerald-600/50 text-white font-bold py-3 px-6 rounded-3xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:transform-none overflow-hidden"
                    >
                        {/* Animated background effect */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -inset-[10px] bg-gradient-to-r from-emerald-400/20 to-transparent blur-xl group-hover:animate-pulse"></div>
                            <svg className="absolute bottom-0 left-0 w-full h-8 opacity-20" viewBox="0 0 100 20">
                                <path d="M0 10 Q 10 5, 20 10 T 40 10 T 60 10 T 80 10 T 100 10" 
                                    stroke="white" 
                                    strokeWidth="0.5" 
                                    fill="none"
                                    className="group-hover:animate-pulse" />
                            </svg>
                            <svg className="absolute -right-12 -top-12 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                                <circle cx="50" cy="50" r="40" fill="white" className="group-hover:animate-ping" style={{ animationDuration: '3s' }} />
                            </svg>
                        </div>

                        {isGenerating ? (
                            <div key="generating" className="flex items-center gap-3 relative z-10">
                                <div className="relative">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <div className="absolute inset-0 w-5 h-5 border-2 border-white/30 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                                </div>
                                <span className="text-base font-semibold tracking-wide">Creating Your Playlist...</span>
                            </div>
                        ) : (
                            <div key="generate" className="flex items-center gap-3 relative z-10">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                    <path d="M8 5.14v14l11-7-11-7z" fill="white" />
                                </svg>
                                    <div className="absolute rounded-full size-[33px] top-[-0.23rem] left-[-0.43rem] z-[-1] bg-white/30 backdrop-blur-sm" />
                                <span className="text-base font-semibold tracking-wide">Generate Playlist</span>
                            </div>
                        )}
                    </button>
                </div>

            </div>
        </div>
    </div>
)

export default PlaylistForm