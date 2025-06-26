import { Play, Zap, Music, Sparkles } from "lucide-react"
import { AnimatePresence } from "framer-motion"

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
        {/* Enhanced decorative background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-[#31c266]/5 via-transparent to-emerald-500/8" />
            <div className="absolute top-4 right-6 w-16 h-16 bg-[#31c266]/8 rounded-full animate-pulse blur-sm" />
            <div className="absolute bottom-6 left-6 w-8 h-8 bg-emerald-400/10 rounded-full animate-bounce blur-sm" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="relative p-7">
            

            <div className="space-y-6">
                {/* Description Input - Enhanced */}
                <div className="relative group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Music className="w-4 h-4 text-white" />
                        </div>
                        <label className="text-base font-bold text-gray-800 dark:text-gray-200">
                            Describe your perfect playlist
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                    </div>
                    
                    <div className="relative">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onFocus={() => setFocusedInput("description")}
                            onBlur={() => setFocusedInput(null)}
                            placeholder="Paint your musical landscape... 'Dreamy synthwave for midnight drives through neon-lit cityscapes, with atmospheric vocals and pulsing basslines...'"
                            className="w-full h-28 px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#31c266]/40 focus:border-[#31c266] resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 bg-white/95 dark:bg-gray-700/95 backdrop-blur-sm shadow-sm transition-all duration-300 text-sm leading-relaxed font-medium group-hover:shadow-md"
                            maxLength={500}
                        />
                        
                        {/* Enhanced Character count */}
                        <div className="absolute bottom-3 right-4">
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

                {/* Playlist Name Input - Enhanced */}
                <div className="relative group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 text-white" />
                        </div>
                        <label className="text-base font-bold text-gray-800 dark:text-gray-200">
                            Custom playlist name
                            <span className="text-sm text-gray-500 font-normal ml-2">(optional)</span>
                        </label>
                    </div>
                    
                    <div className="relative">
                        <input
                            type="text"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            onFocus={() => setFocusedInput("name")}
                            onBlur={() => setFocusedInput(null)}
                            placeholder="✨ Leave empty for AI magic, or craft your own title..."
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#31c266]/40 focus:border-[#31c266] text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 bg-white/95 dark:bg-gray-700/95 backdrop-blur-sm shadow-sm transition-all duration-300 text-sm font-medium group-hover:shadow-md"
                        />
                        
                        {/* Magic sparkle icon */}
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <Sparkles className="w-4 h-4 text-[#31c266]/60 animate-pulse" />
                        </div>
                        
                        {/* Focus indicator */}
                        <div className="absolute inset-0 rounded-xl border-2 border-[#31c266]/0 group-focus-within:border-[#31c266]/30 transition-all duration-300 pointer-events-none" />
                    </div>
                </div>

                {/* Better CTA Button */}
                <div className="pt-3">
                    <button
                        onClick={handleGenerate}
                        disabled={!description.trim() || isGenerating}
                        className="w-full group relative bg-gradient-to-r from-[#31c266] to-emerald-600 hover:from-[#2eb55f] hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                        {/* Subtle shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500 opacity-0 group-hover:opacity-100" />
                        
                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <div key="generating" className="flex items-center gap-3 relative z-10">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span className="text-base font-semibold">Creating Your Playlist...</span>
                                </div>
                            ) : (
                                <div key="generate" className="flex items-center gap-3 relative z-10">
                                    <Zap className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="text-base font-semibold">Generate Playlist</span>
                                    <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200" />
                                </div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

            </div>
        </div>
    </div>
)

export default PlaylistForm