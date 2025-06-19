import { motion } from "framer-motion";

const Background = () => {

    // More musical symbols for variety
    const musicalSymbols = ["♪", "♫", "♬", "♩", "♭", "♯", "𝄞", "𝄢", "♮", "𝄐"]

    // More floating symbols with color variations
    const floatingSymbols = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        symbol: musicalSymbols[Math.floor(Math.random() * musicalSymbols.length)],
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 10,
        x: Math.random() * 100,
        size: Math.random() > 0.6 ? "text-2xl" : Math.random() > 0.3 ? "text-xl" : "text-lg",
        colorClass: ["text-green-700", "text-emerald-700", "text-teal-700", "text-green-600", "text-emerald-600"][
            Math.floor(Math.random() * 5)
        ],
    }))

    // Static symbols with enhanced colors
    const staticSymbols = [
        { symbol: "♪", x: 15, y: 20, delay: 0, color: "text-green-700" },
        { symbol: "♫", x: 85, y: 15, delay: 2, color: "text-emerald-700" },
        { symbol: "♬", x: 10, y: 70, delay: 4, color: "text-teal-700" },
        { symbol: "♩", x: 90, y: 75, delay: 6, color: "text-green-600" },
        { symbol: "𝄞", x: 25, y: 85, delay: 1, color: "text-emerald-600" },
        { symbol: "♭", x: 75, y: 25, delay: 3, color: "text-green-700" },
        { symbol: "♯", x: 50, y: 10, delay: 5, color: "text-teal-600" },
        { symbol: "♮", x: 20, y: 50, delay: 7, color: "text-emerald-700" },
        { symbol: "𝄢", x: 80, y: 60, delay: 8, color: "text-green-600" },
        { symbol: "♪", x: 60, y: 90, delay: 9, color: "text-teal-700" },
    ]

    return (
        <div className="h-screen w-full overflow-hidden relative bg-gradient-to-br from-white via-green-50 to-emerald-50">
            {/* Enhanced background pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.4)_1px,transparent_1px)] bg-[length:80px_80px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(20,184,166,0.3)_1px,transparent_1px)] bg-[length:120px_120px]" />
            </div>

            {/* Floating Musical Symbols with shadow effects */}
            {floatingSymbols.map((item) => (
                <motion.div
                    key={item.id}
                    className={`absolute ${item.colorClass} ${item.size} font-medium select-none`}
                    style={{
                        left: `${item.x}%`,
                        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
                    }}
                    initial={{ y: "110vh", opacity: 0, rotate: 0, scale: 0.5 }}
                    animate={{
                        y: "-10vh",
                        opacity: [0, 0.8, 0.9, 0.8, 0],
                        rotate: [0, 180, 360],
                        scale: [0.5, 1, 1, 0.8],
                    }}
                    transition={{
                        duration: item.duration,
                        delay: item.delay,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                >
                    {item.symbol}
                </motion.div>
            ))}

            {/* Static floating symbols with enhanced effects */}
            {staticSymbols.map((item, index) => (
                <motion.div
                    key={`static-${index}`}
                    className={`absolute ${item.color} text-2xl select-none font-medium`}
                    style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.4))",
                    }}
                    animate={{
                        y: [-15, 15, -15],
                        rotate: [-8, 8, -8],
                        opacity: [0.6, 1, 0.6],
                        scale: [0.9, 1.1, 0.9],
                    }}
                    transition={{
                        duration: 8 + Math.random() * 4,
                        delay: item.delay,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                >
                    {item.symbol}
                </motion.div>
            ))}

            {/* Animated gradient overlays for depth */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(circle at 30% 50%, rgba(34,197,94,0.08) 0%, transparent 50%)",
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(circle at 70% 30%, rgba(20,184,166,0.06) 0%, transparent 60%)",
                }}
                animate={{
                    scale: [1.1, 1, 1.1],
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                    duration: 15,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 3,
                    ease: "easeInOut",
                }}
            />

            {/* Enhanced corner accent symbols */}
            <motion.div
                className="absolute top-12 left-12 text-4xl font-bold text-green-700"
                style={{
                    filter: "drop-shadow(0 4px 15px rgba(0,0,0,0.4))",
                }}
                animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            >
                𝄞
            </motion.div>

            <motion.div
                className="absolute bottom-12 right-12 text-4xl font-bold text-emerald-700"
                style={{
                    filter: "drop-shadow(0 4px 15px rgba(0,0,0,0.4))",
                }}
                animate={{
                    rotate: [0, -15, 15, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 2,
                    ease: "easeInOut",
                }}
            >
                ♫
            </motion.div>

            <motion.div
                className="absolute top-1/2 left-8 text-3xl font-bold text-teal-700"
                style={{
                    filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.4))",
                }}
                animate={{
                    x: [-10, 10, -10],
                    opacity: [0.6, 1, 0.6],
                    scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                    duration: 9,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                    ease: "easeInOut",
                }}
            >
                ♪
            </motion.div>

            <motion.div
                className="absolute top-1/3 right-12 text-3xl font-bold text-green-600"
                style={{
                    filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.4))",
                }}
                animate={{
                    y: [-12, 12, -12],
                    opacity: [0.6, 1, 0.6],
                    scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                    duration: 11,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 4,
                    ease: "easeInOut",
                }}
            >
                ♬
            </motion.div>

            {/* Enhanced animated streaks with darker colors for light mode */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                    opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            >
                <svg className="w-full h-full">
                    {/* Main streaks with darker colors */}
                    <motion.path
                        d="M 100 200 Q 400 100 700 300 T 1200 250"
                        stroke="rgba(21,128,61,0.8)"
                        strokeWidth="4"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: [0, 1, 0] }}
                        transition={{
                            duration: 15,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.path
                        d="M 200 500 Q 500 300 800 600 T 1100 550"
                        stroke="rgba(15,118,110,0.8)"
                        strokeWidth="4"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: [0, 1, 0] }}
                        transition={{
                            duration: 18,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: 5,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Additional curved streaks with darker colors */}
                    <motion.path
                        d="M 0 300 Q 300 150 600 400 Q 900 200 1400 350"
                        stroke="rgba(5,150,105,0.7)"
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: [0, 1, 0] }}
                        transition={{
                            duration: 20,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: 2,
                            ease: "easeInOut",
                        }}
                    />

                    <motion.path
                        d="M 150 100 Q 450 400 750 150 Q 1050 500 1300 200"
                        stroke="rgba(6,95,70,0.7)"
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: [0, 1, 0] }}
                        transition={{
                            duration: 22,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: 8,
                            ease: "easeInOut",
                        }}
                    />

                    <motion.path
                        d="M 50 600 Q 350 450 650 700 Q 950 400 1250 650"
                        stroke="rgba(8,145,178,0.7)"
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: [0, 1, 0] }}
                        transition={{
                            duration: 25,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: 12,
                            ease: "easeInOut",
                        }}
                    />
                </svg>
            </motion.div>
        </div>
    );
};

export default Background;