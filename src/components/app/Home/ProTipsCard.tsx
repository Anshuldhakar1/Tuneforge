import { Palette } from "lucide-react"

const ProTipsCard = () => (
    <div className="relative overflow-hidden rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-white">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-200/50 to-yellow-200/50 rounded-full blur-lg"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-pink-200/30 to-purple-200/30 rounded-full blur-md"></div>
        </div>
        <div className="relative bg-white/40 backdrop-blur-sm border border-white/50 p-5">
            <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-purple-600" />
                <h3 className="text-base font-semibold text-gray-900">Pro Tips</h3>
            </div>
            <div className="space-y-4">
                <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-100">
                    <h4 className="text-sm font-semibold text-purple-700 mb-1">Be Specific</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Include mood, genre, tempo, and setting for better results
                    </p>
                </div>
                <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-700 mb-1">Set the Scene</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Describe when and where you'll listen to this playlist
                    </p>
                </div>
                <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-pink-100">
                    <h4 className="text-sm font-semibold text-pink-700 mb-1">Mix Emotions</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Combine different feelings for more dynamic playlists
                    </p>
                </div>
                <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-orange-100">
                    <h4 className="text-sm font-semibold text-orange-700 mb-1">Time Periods</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Mention decades or eras to influence song selection
                    </p>
                </div>
            </div>
        </div>
    </div>
)

export default ProTipsCard