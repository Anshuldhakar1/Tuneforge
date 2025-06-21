import { Activity, Headphones, Clock, Heart, Sparkles } from "lucide-react"

const MusicDNA = () => (
    <div className="relative overflow-hidden rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-white">
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div
                    className="absolute top-8 right-4 w-1 h-1 bg-indigo-400 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute bottom-4 left-6 w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute bottom-8 right-2 w-2 h-2 bg-blue-300 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                ></div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-200/40 to-indigo-200/40 rounded-full blur-lg"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-slate-200/40 to-blue-200/40 rounded-full blur-xl"></div>
        </div>
        <div className="relative bg-white/50 backdrop-blur-sm border border-white/50 p-5">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-semibold text-gray-900">Your Music DNA</h3>
            </div>
            <div className="space-y-4">
                <div className="p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Headphones className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700">Connect Your Music</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        Link your Spotify account to get personalized insights and better playlist recommendations
                    </p>
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors">
                        Connect Spotify
                    </button>
                </div>
                <div className="space-y-3">
                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-600">Listening Patterns</span>
                        </div>
                        <p className="text-xs text-gray-500">Connect to see your music habits</p>
                    </div>
                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Heart className="w-3 h-3 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-600">Favorite Genres</span>
                        </div>
                        <p className="text-xs text-gray-500">Discover your top genres</p>
                    </div>
                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-3 h-3 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-600">Discovery Score</span>
                        </div>
                        <p className="text-xs text-gray-500">See how adventurous your taste is</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default MusicDNA