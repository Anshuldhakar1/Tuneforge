import { motion } from "framer-motion"

const HeaderSection = () => (
    <div className="text-center sm:mb-12 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-150 opacity-80">
            <svg 
                className="w-full h-32" 
                viewBox="0 0 800 120" 
                fill="none"
                preserveAspectRatio="xMidYMid meet"
            >
                <motion.path
                    d="M0 60 L300 60 L320 60 L340 20 L360 100 L380 60 L420 60 L440 45 L460 75 L480 60 L800 60"
                    stroke="rgba(49,194,102,0.6)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />
                
                <motion.path
                    d="M0 60 L300 60 L320 60 L340 20 L360 100 L380 60 L420 60 L440 45 L460 75 L480 60 L800 60"
                    stroke="url(#brightPulseGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="80 720"
                    animate={{ 
                        strokeDashoffset: [-800, 0, 800],
                    }}
                    transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                />
                
                <defs>
                    <linearGradient id="brightPulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(49,194,102,0)" />
                        <stop offset="20%" stopColor="rgba(49,194,102,0.8)" />
                        <stop offset="50%" stopColor="rgba(49,194,102,1)" />
                        <stop offset="80%" stopColor="rgba(49,194,102,0.8)" />
                        <stop offset="100%" stopColor="rgba(49,194,102,0)" />
                    </linearGradient>
                </defs>
            </svg>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-3 leading-tight relative z-10">
            Create Your
            <span className="relative left-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Perfect Playlist
            </span>
        </h1>
        
        <p className="text-base font-semibold text-gray-700 max-w-2xl mx-auto mb-8 mt-3 relative z-10">
            Describe your mood and let AI craft the perfect soundtrack for any moment
        </p>
    </div>
)

export default HeaderSection;