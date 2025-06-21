import { Play, Zap, Music, Mic2 } from "lucide-react"
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
    <div className="relative overflow-hidden rounded-3xl shadow-xl">
        <div className="absolute inset-0 bg-white">
            <div className="absolute inset-0 bg-white/60"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
        </div>
        <div className="relative backdrop-blur-md border border-white/50 p-6">
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Mic2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Describe Your Vibe</h2>
                </div>
                <p className="text-sm text-gray-600">
                    Tell us what you're feeling and we'll create the perfect playlist
                </p>
            </div>
            <div className="space-y-5">
                <div className="relative">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Music className="w-4 h-4 text-green-600" />
                        Describe your ideal playlist
                    </label>
                    <div className="relative">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onFocus={() => setFocusedInput("description")}
                            onBlur={() => setFocusedInput(null)}
                            placeholder="Dreamy synthpop for late-night city drives under neon lights..."
                            className="w-full h-28 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-sm text-gray-800 placeholder-gray-500 bg-white/70 backdrop-blur-sm shadow-inner transition-all duration-300"
                            maxLength={500}
                        />
                        <div className="absolute bottom-2 right-3 flex items-center gap-2">
                            <span className="text-xs text-gray-500">{description.length}/500</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Play className="w-4 h-4 text-green-600" />
                        Custom playlist name (optional)
                    </label>
                    <input
                        type="text"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        onFocus={() => setFocusedInput("name")}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="Leave empty for AI-generated name ✨"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm text-gray-800 placeholder-gray-500 bg-white/70 backdrop-blur-sm shadow-inner transition-all duration-300"
                    />
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={!description.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl disabled:cursor-not-allowed relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <div key="generating" className="flex items-center gap-3">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span className="text-base relative z-10">Creating Your Playlist...</span>
                            </div>
                        ) : (
                            <div key="generate" className="flex items-center gap-3">
                                <Zap className="w-4 h-4 relative z-10" />
                                <span className="text-base relative z-10">Generate Playlist</span>
                            </div>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    </div>
)

export default PlaylistForm