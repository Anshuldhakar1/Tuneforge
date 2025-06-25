import { Activity, Headphones, Clock, Heart, Sparkles, TrendingUp, Music } from "lucide-react"

interface MusicDNAProps {
    isSpotifyConnected: boolean;
}

const MusicDNA = ({ isSpotifyConnected }: MusicDNAProps) => {
    // Mock data based on what Spotify Web API can actually provide
    const mockStats = {
        topArtist: "Radiohead", // From /me/top/artists
        topTrack: "Bohemian Rhapsody", // From /me/top/tracks
        totalSavedTracks: 1247, // From /me/tracks
        totalPlaylists: 23, // From /me/playlists
        totalFollowedArtists: 156, // From /me/following?type=artist
        recentlyPlayed: "Creep - Radiohead", // From /me/player/recently-played
        currentlyPlaying: null, // From /me/player/currently-playing
        topGenres: ["alternative rock", "indie rock", "post-rock"], // Derived from top artists
        timeRange: "medium_term" // Last 6 months (spotify supports short_term, medium_term, long_term)
    };

    // Function to fetch real data from backend (placeholder)
    const fetchSpotifyStats = async () => {
        // TODO: Implement actual API calls to:
        // - GET /v1/me/top/artists
        // - GET /v1/me/top/tracks  
        // - GET /v1/me/tracks
        // - GET /v1/me/playlists
        // - GET /v1/me/following?type=artist
        // - GET /v1/me/player/recently-played
        // - GET /v1/me/player/currently-playing
        console.log("Fetching Spotify statistics...");
        return mockStats;
    };

    return (
        <div className="relative overflow-hidden bg-blue-50/60 dark:bg-gray-800/95 rounded-xl border border-blue-200/30 dark:border-gray-700 p-4">
            {/* Minimal decorative background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-indigo-500/5" />
                <div className="absolute top-2 right-2 w-4 h-4 bg-blue-400/20 rounded-full animate-pulse" />
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-indigo-400/20 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
            </div>

            <div className="relative">
                {/* Simplified Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Your Music DNA</h3>
                        <div className="w-6 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
                    </div>
                </div>

                <div className="space-y-3">
                    {!isSpotifyConnected ? (
                        /* Simplified Connect Card */
                        <div className="p-3 bg-gradient-to-br from-green-50/90 to-emerald-50/90 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/50 dark:border-green-700/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Headphones className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-bold text-green-700 dark:text-green-400">Connect Spotify</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Use the Spotify button in the header to connect and see your stats
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Compact Stats Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-white/80 dark:bg-gray-700/80 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Music className="w-3 h-3 text-blue-600" />
                                        <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Saved</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{mockStats.totalSavedTracks}</p>
                                </div>
                                
                                <div className="p-2 bg-white/80 dark:bg-gray-700/80 rounded-lg border border-indigo-200/50 dark:border-indigo-700/50">
                                    <div className="flex items-center gap-1 mb-1">
                                        <TrendingUp className="w-3 h-3 text-indigo-600" />
                                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Artists</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{mockStats.totalFollowedArtists}</p>
                                </div>
                            </div>

                            {/* Compact Genre Badge */}
                            <div className="text-center">
                                <div className="inline-flex px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full border border-purple-200/50 dark:border-purple-700/50">
                                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                                        🎵 {mockStats.topGenres[0]}
                                    </span>
                                </div>
                            </div>

                            {/* Simplified Stats List */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-700/60 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-3 h-3 text-pink-500" />
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Top Artist</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate ml-2">{mockStats.topArtist}</p>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-700/60 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-green-500" />
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Playlists</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">{mockStats.totalPlaylists}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Simplified border accent */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </div>
    )
}

export default MusicDNA