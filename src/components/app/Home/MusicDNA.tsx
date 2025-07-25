import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Headphones, Heart, User, Calendar } from "lucide-react";
interface MusicDNAProps {
    isSpotifyConnected: boolean;
}

const MusicDNA = ({ isSpotifyConnected }: MusicDNAProps) => {
    const sessionToken = localStorage.getItem("session_token");
    
    // Use hooks at the top level - pass null token if no session token exists
    const userId = useQuery(api.auth.getUserBySessionToken, 
        sessionToken ? { token: sessionToken } : "skip"
    );
    
    // Only query user music data if we have a valid userId
    const userMusicData = useQuery(api.spotifyStats.getUserSpotifyStats, 
        userId ? { userId: userId as Id<"users"> } : "skip"
    );
    if (!sessionToken) {
        console.error("No session token found");
        return null;
    }

    return (
        <div className="relative overflow-hidden z-[101] rounded-2xl border border-white/30 backdrop-blur-xl shadow-xl">
            
            <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-green-100 dark:from-green-400 dark:to-green-700"></div>
            
            {/* Bubbles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute rounded-full size-[3rem] top-[-1.5rem] bg-white/20 backdrop-blur-sm" />
                <div className="absolute rounded-full size-[2rem] top-[1.5rem] left-[90%] bg-white/20 backdrop-blur-sm" />
                <div className="absolute rounded-full size-[3rem] top-[-.5rem] left-[70%] bg-white/20 backdrop-blur-sm" />
                <div className="absolute rounded-full size-[2rem] bottom-[10%] left-[10%] bg-white/30 backdrop-blur-sm" />
                <div className="absolute rounded-full size-[5rem] bottom-[50%] left-[-10%] bg-white/30 backdrop-blur-sm" />
                <div className="absolute rounded-full size-[4rem] bottom-[30%] right-[-10%] bg-white/30 backdrop-blur-sm" />
                <div className="absolute rounded-full size-[10px] top-[1.5rem] bg-white/50 backdrop-blur-sm" />
                <div className="absolute rounded-full size-[10px] top-[0.6rem] left-[1rem] bg-white/50 backdrop-blur-sm" />
                <div className="absolute rounded-full size-[10px] top-[10%] left-[30%] bg-white/50 backdrop-blur-sm" />
            </div>
            
            <div className="relative p-4">
                <div className="text-center">
                    <h3 className="mb-1">
                        <span className="text-2xl text-white font-normal">Music Insights</span>
                    </h3>
                    <div className="w-15 h-[2px] bg-white/40 mx-auto relative left-[5px] top-[5px]"></div>
                </div>
            </div>
                
            {userMusicData ? (
                <div className="relative px-6">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#31c266" stopOpacity="0.3" />
                                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>
                            <path d="M0,100 Q100,50 200,100 T400,100 L400,300 L0,300 Z" fill="url(#waveGrad)" />
                            <path d="M0,150 Q150,100 300,150 T400,150 L400,300 L0,300 Z" fill="url(#waveGrad)" opacity="0.5" />
                        </svg>

                        {userMusicData.topArtistCovers?.slice(0, 5).map((cover, index) => {
                            // Create more balanced positions using a grid-like approach
                            const positions = [
                                { top: '15%', left: '15%' },    // Top left
                                { top: '15%', left: '75%' },    // Top right
                                { top: '50%', left: '45%' },    // Middle
                                { top: '80%', left: '20%' },    // Bottom left
                                { top: '75%', left: '70%' },    // Bottom right
                            ];
                            
                            return (
                                <div
                                    key={`artist-cover-${index}`}
                                    className="absolute shadow-lg hover:scale-105 transition-transform duration-300"
                                    style={{
                                        top: positions[index].top,
                                        left: positions[index].left,
                                        width: index === 0 ? '65px' : index === 1 ? '55px' : '45px',
                                        height: index === 0 ? '65px' : index === 1 ? '55px' : '45px',
                                        backgroundImage: `url(${cover})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        clipPath: index === 0 ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' :
                                                 index === 1 ? 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0% 100%)' :
                                                 index === 2 ? 'circle(50% at 50% 50%)' :
                                                 index === 3 ? 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' :
                                                 'polygon(0% 0%, 100% 25%, 100% 100%, 25% 100%)',
                                        transform: `rotate(${index * 45}deg)`,
                                        opacity: 0.9,
                                        zIndex: 5,
                                        border: '2px solid rgba(255,255,255,0.4)',
                                    }}
                                />
                            );
                        })}

                    </div>

                    {/* Main Content */}
                    <div className="relative z-10">
                        {/* Top Track Display */}

                        <div className="mb-2 px-3 pb-4 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/50">
                            <div className="p-3 flex items-center justify-center">
                                <span className="font-bold text-base text-black/80 tracking-[0.015em]">
                                    Your Top track and Artist
                                </span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-xl p-2">
                                <div className="flex-shrink-0">
                                    <img
                                        src={userMusicData.topTrackCover}
                                        alt={userMusicData.topTrack}
                                        className="w-12 h-12 rounded-lg shadow-lg"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 ">
                                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                        {userMusicData.topTrack}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {userMusicData.topTrackArtist || "Unknown Artist"}
                                    </p>
                                </div>
                            </div>                 
                            <div className="flex items-center gap-3 my-4 rounded-lg bg-white/40 backdrop-blur-sm p-2">
                                <div className="flex-shrink-0">
                                    <img src={userMusicData.topArtistCover} alt={userMusicData.topArtist} className="w-12 h-12  bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                        {userMusicData.topArtist}
                                    </h4>
                                </div>
                            </div>

                            <div className="flex items-center justify-center pb-1">
                                <span className="font-bold text-md text-black/80 tracking-wide">
                                    Your Stats this month
                                </span>
                            </div>

                            {/* Stats Cards Grid - Compact Design */}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="flex items-center p-1.5 rounded-lg bg-emerald-100/75 dark:bg-emerald-900/30 border border-emerald-200/70 dark:border-emerald-800/60 shadow-sm">
                                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-emerald-500/20 rounded-full mr-2">
                                        <Headphones className="w-3 h-3 text-emerald-600 dark:text-emerald-300" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[0.55rem] font-bold text-emerald-800/70 dark:text-emerald-300/80 uppercase tracking-wider">
                                            Tracks
                                        </span>
                                        <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                                            {userMusicData.totalTracks?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center p-1.5 rounded-lg bg-blue-100/75 dark:bg-blue-900/30 border border-blue-200/70 dark:border-blue-800/60 shadow-sm">
                                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-blue-500/20 rounded-full mr-2">
                                        <User className="w-3 h-3 text-blue-600 dark:text-blue-300" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[0.55rem] font-bold text-blue-800/70 dark:text-blue-300/80 uppercase tracking-wider">
                                            Artists
                                        </span>
                                        <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                                            {userMusicData.totalArtists?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center p-1.5 rounded-lg bg-purple-100/75 dark:bg-purple-900/30 border border-purple-200/70 dark:border-purple-800/60 shadow-sm">
                                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-purple-500/20 rounded-full mr-2">
                                        <Heart className="w-3 h-3 text-purple-600 dark:text-purple-300" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[0.55rem] font-bold text-purple-800/70 dark:text-purple-300/80 uppercase tracking-wider">
                                            Playlists
                                        </span>
                                        <span className="text-sm font-bold text-purple-900 dark:text-purple-100">
                                            {userMusicData.totalPlaylists?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center p-1.5 rounded-lg bg-orange-100/75 dark:bg-orange-900/30 border border-orange-200/70 dark:border-orange-800/60 shadow-sm">
                                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-orange-500/20 rounded-full mr-2">
                                        <Calendar className="w-3 h-3 text-orange-600 dark:text-orange-300" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[0.55rem] font-bold text-orange-800/70 dark:text-orange-300/80 uppercase tracking-wider">
                                            Hours
                                        </span>
                                        <span className="text-sm font-bold text-orange-900 dark:text-orange-100">
                                            {userMusicData.totalHoursListened?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Artist Display */}
                        

                        
                    </div>
                </div>
            ) : (<></>)}
            
            <div className="w-full flex justify-center relative z-10">
                <button className=" relative overflow-hidden inline-flex scale-[0.85] items-center gap-3 px-8 py-4 m-4 mt-0 rounded-full bg-[#25be5a] hover:bg-[#1ed760] text-white font-bold text-sm transition-all duration-200 hover:scale-90 shadow-lg hover:shadow-xl uppercase">
                    
                    {!userMusicData ? <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12h4l3-9 4 18 3-9h4" />
                        </svg>
                        Analyze your music
                    </> : <>
                        <svg className="z-10 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                            <path d="M21 3v5h-5"/>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                            <path d="M3 21v-5h5"/>
                        </svg>

                        <div className="absolute rounded-full size-[35px] top-[17%] left-[1.5rem] bg-white/30 backdrop-blur-sm" />
                        Refresh Stats
                    </>
                 }
                </button>
            </div>

        </div>
    )
}

export default MusicDNA