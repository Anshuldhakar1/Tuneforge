import { Play, Zap, Music, Wand2 } from "lucide-react"
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
        <div className="relative p-6">
            {/* Simplified Header Section */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#31c266] to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Wand2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Your Vibe</h2>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-[#31c266] to-emerald-500 rounded-full mt-1" />
                    </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium">
                    Transform your emotions into the perfect musical journey
                </p>
            </div>

            <div className="space-y-4">
                {/* Description Input */}
                <div className="relative group">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <Music className="w-3 h-3 text-white" />
                        </div>
                        <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
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
                            placeholder="Dreamy synthwave for midnight drives through neon-lit cityscapes..."
                            className="w-full h-24 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31c266]/50 focus:border-[#31c266] resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm shadow-sm transition-all duration-300 text-sm leading-relaxed"
                            maxLength={500}
                        />
                        
                        {/* Character count */}
                        <div className="absolute bottom-2 right-3">
                            <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                                description.length > 450 
                                    ? 'bg-red-50 text-red-600' 
                                    : description.length > 300 
                                        ? 'bg-yellow-50 text-yellow-600' 
                                        : 'bg-gray-50 text-gray-500'
                            }`}>
                                {description.length}/500
                            </div>
                        </div>
                    </div>
                </div>

                {/* Playlist Name Input */}
                <div className="relative group">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                            <Play className="w-3 h-3 text-white" />
                        </div>
                        <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            Custom playlist name
                            <span className="text-xs text-gray-500 font-normal ml-2">(optional)</span>
                        </label>
                    </div>
                    
                    <input
                        type="text"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        onFocus={() => setFocusedInput("name")}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="Leave empty for AI magic ✨"
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31c266]/50 focus:border-[#31c266] text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm shadow-sm transition-all duration-300 text-sm"
                    />
                </div>

                {/* Generate Button */}
                <div className="pt-2">
                    <button
                        onClick={handleGenerate}
                        disabled={!description.trim() || isGenerating}
                        className="w-full group relative bg-gradient-to-r from-[#31c266] to-emerald-600 hover:from-[#2eb55f] hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <div key="generating" className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span className="text-base">Creating Your Playlist...</span>
                                </div>
                            ) : (
                                <div key="generate" className="flex items-center gap-3">
                                    <Zap className="w-4 h-4" />
                                    <span className="text-base">Generate Playlist</span>
                                </div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

                {/* Simplified Helper */}
                <div className="bg-blue-50/60 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200/30 dark:border-blue-700/30">
                    <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                        💡 <strong>Tip:</strong> Include mood, genre, and setting for better results
                    </p>
                </div>
            </div>
        </div>
    </div>
)

export default PlaylistForm