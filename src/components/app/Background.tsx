import { useMemo, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const debounce = (fn: (...a: any[]) => void, ms = 120) => {
    let t: any; return (...args: any[]) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

const getDensity = (w: number) => {
    if (w < 480) return 6;
    if (w < 768) return 9;
    if (w < 1024) return 12;
    if (w < 1440) return 15;
    return 18;
};

const Background = () => {
    const prefersReducedMotion = useReducedMotion();

    const [prefersMoreContrast, setPrefersMoreContrast] = useState(false);
    const [forcedColors, setForcedColors] = useState(false);

    const [vw, setVw] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1440);
    useEffect(() => {
        const onResize = debounce(() => setVw(window.innerWidth), 150);
        window.addEventListener('resize', onResize, { passive: true });
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        const contrastMQ = window.matchMedia('(prefers-contrast: more)');
        const forcedColorsMQ = window.matchMedia('(forced-colors: active)');
        const update = () => setPrefersMoreContrast(contrastMQ.matches);
        const updateForced = () => setForcedColors(forcedColorsMQ.matches);
        if (contrastMQ.addEventListener) {
            contrastMQ.addEventListener('change', update);
            forcedColorsMQ.addEventListener('change', updateForced);
        } else {
            // @ts-ignore
            contrastMQ.addListener(update);
            // @ts-ignore
            forcedColorsMQ.addListener(updateForced);
        }
        update(); updateForced();
        return () => {
            if (contrastMQ.removeEventListener) {
                contrastMQ.removeEventListener('change', update);
                forcedColorsMQ.removeEventListener('change', updateForced);
            } else {
                // @ts-ignore
                contrastMQ.removeListener(update);
                // @ts-ignore
                forcedColorsMQ.removeListener(updateForced);
            }
        };
    }, []);

    const [userReducedOverride, setUserReducedOverride] = useState(false);
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const root = document.documentElement;
            setUserReducedOverride(root.dataset.bgReduced === 'true');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bg-reduced'] });
        setUserReducedOverride(document.documentElement.dataset.bgReduced === 'true');
        return () => observer.disconnect();
    }, []);

    const effectiveReduced = prefersReducedMotion || userReducedOverride;

    const baseColorClasses = prefersMoreContrast || forcedColors
        ? ["text-green-800", "text-emerald-800", "text-teal-800", "text-green-700", "text-emerald-700"]
        : ["text-green-700", "text-emerald-700", "text-teal-700", "text-green-600", "text-emerald-600"];

    const musicalSymbols = ["♪", "♫", "♬", "♩", "♭", "♯", "𝄞", "𝄢", "♮", "𝄐"];

    const density = getDensity(vw);

    const floatingSymbols = useMemo(() => {
        if (effectiveReduced) return [];
        return Array.from({ length: density }, (_, i) => ({
            id: i,
            symbol: musicalSymbols[Math.floor(Math.random() * musicalSymbols.length)],
            delay: Math.random() * 8,
            duration: 14 + Math.random() * 8,
            x: Math.random() * 100,
            size: Math.random() > 0.6 ? "text-2xl" : Math.random() > 0.3 ? "text-xl" : "text-lg",
            colorClass: baseColorClasses[Math.floor(Math.random() * baseColorClasses.length)],
        }));
    }, [density, effectiveReduced, baseColorClasses]);

    const staticSymbols = useMemo(() => {
        const all = [
            { symbol: "♪", x: 15, y: 20, delay: 0 },
            { symbol: "♫", x: 85, y: 15, delay: 2 },
            { symbol: "♬", x: 10, y: 70, delay: 4 },
            { symbol: "♩", x: 90, y: 75, delay: 6 },
            { symbol: "𝄞", x: 25, y: 85, delay: 1 },
            { symbol: "♭", x: 75, y: 25, delay: 3 },
            { symbol: "♯", x: 50, y: 10, delay: 5 },
            { symbol: "♮", x: 20, y: 50, delay: 7 },
            { symbol: "𝄢", x: 80, y: 60, delay: 8 },
            { symbol: "♪", x: 60, y: 90, delay: 9 },
        ];
        if (vw < 640) return all.slice(0, 4);
        if (vw < 1024) return all.slice(0, 7);
        return all;
    }, [vw]);

    const floatVariants: any = {
        initial: { y: "110vh", opacity: 0, rotate: 0, scale: 0.6 },
        animate: (item: any) => ({
            y: "-10vh",
            opacity: [0, 0.85, 0.9, 0.75, 0],
            rotate: [0, 180, 360],
            scale: [0.6, 1, 1, 0.85],
            transition: {
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: [0, 0, 1, 1] as any
            }
        })
    };

    const staticVariants: any = {
        animate: (item: any) => ({
            y: effectiveReduced ? 0 : [-14, 14, -14],
            rotate: effectiveReduced ? 0 : [-8, 8, -8],
            opacity: effectiveReduced ? 0.8 : [0.65, 1, 0.65],
            scale: effectiveReduced ? 1 : [0.92, 1.08, 0.92],
            transition: {
                duration: effectiveReduced ? 0 : 8 + (item.delay % 4),
                delay: item.delay,
                repeat: effectiveReduced ? 0 : Infinity,
                ease: [0.42, 0, 0.58, 1] as any
            }
        })
    };

    const reducedOverlayStyles = effectiveReduced ? "opacity-70" : "opacity-30";

    return (
        <div
            className="h-screen w-full overflow-hidden relative bg-gradient-to-br from-white via-green-50 to-emerald-50 select-none"
            role="presentation"
            aria-hidden="true"
        >
            {!forcedColors && (
                <div className={`absolute inset-0 ${reducedOverlayStyles}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.35)_1px,transparent_1px)] bg-[length:80px_80px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(20,184,166,0.28)_1px,transparent_1px)] bg-[length:120px_120px]" />
                </div>
            )}

            {!effectiveReduced && floatingSymbols.map(item => (
                <motion.div
                    key={item.id}
                    variants={floatVariants}
                    initial="initial"
                    animate="animate"
                    custom={item}
                    className={`absolute ${item.colorClass} ${item.size} font-medium pointer-events-none will-change-transform`}
                    style={{ left: `${item.x}%`, filter: prefersMoreContrast ? undefined : "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }}
                >
                    {item.symbol}
                </motion.div>
            ))}

            {staticSymbols.map((item, idx) => (
                <motion.div
                    key={`static-${idx}`}
                    variants={staticVariants}
                    animate="animate"
                    custom={item}
                    className={`${baseColorClasses[idx % baseColorClasses.length]} absolute text-xl sm:text-2xl font-medium pointer-events-none will-change-transform`}
                    style={{ left: `${item.x}%`, top: `${item.y}%`, filter: prefersMoreContrast ? undefined : "drop-shadow(0 3px 10px rgba(0,0,0,0.35))" }}
                >
                    {item.symbol}
                </motion.div>
            ))}

            {!effectiveReduced && !forcedColors && (
                <>
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "radial-gradient(circle at 30% 50%, rgba(34,197,94,0.08) 0%, transparent 55%)" }}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.28, 0.55, 0.28] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "radial-gradient(circle at 70% 30%, rgba(20,184,166,0.06) 0%, transparent 60%)" }}
                        animate={{ scale: [1.1, 1, 1.1], opacity: [0.18, 0.45, 0.18] }}
                        transition={{ duration: 15, repeat: Infinity, delay: 3, ease: "easeInOut" }}
                    />
                </>
            )}

            {!effectiveReduced && !forcedColors && (
                <>
                    <motion.div
                        className="absolute top-12 left-12 text-3xl sm:text-4xl font-bold text-green-700 pointer-events-none"
                        style={{ filter: prefersMoreContrast ? undefined : "drop-shadow(0 4px 12px rgba(0,0,0,0.35))" }}
                        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                    >
                        𝄞
                    </motion.div>
                    <motion.div
                        className="absolute bottom-12 right-12 text-3xl sm:text-4xl font-bold text-emerald-700 pointer-events-none"
                        style={{ filter: prefersMoreContrast ? undefined : "drop-shadow(0 4px 12px rgba(0,0,0,0.35))" }}
                        animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 13, repeat: Infinity, delay: 2, ease: "easeInOut" }}
                    >
                        ♫
                    </motion.div>
                </>
            )}

            {!effectiveReduced && vw >= 768 && !forcedColors && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0.18, 0.5, 0.18] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                    <svg className="w-full h-full" aria-hidden="true">
                        <motion.path
                            d="M 100 200 Q 400 100 700 300 T 1200 250"
                            stroke="rgba(21,128,61,0.7)"
                            strokeWidth="3.5"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: [0, 1, 0] }}
                            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M 200 500 Q 500 300 800 600 T 1100 550"
                            stroke="rgba(15,118,110,0.7)"
                            strokeWidth="3.5"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: [0, 1, 0] }}
                            transition={{ duration: 19, repeat: Infinity, delay: 4, ease: "easeInOut" }}
                        />
                        {vw > 1280 && (
                            <>
                                <motion.path
                                    d="M 0 300 Q 300 150 600 400 Q 900 200 1400 350"
                                    stroke="rgba(5,150,105,0.6)"
                                    strokeWidth="3"
                                    fill="none"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: [0, 1, 0] }}
                                    transition={{ duration: 20, repeat: Infinity, delay: 2, ease: "easeInOut" }}
                                />
                                <motion.path
                                    d="M 150 100 Q 450 400 750 150 Q 1050 500 1300 200"
                                    stroke="rgba(6,95,70,0.55)"
                                    strokeWidth="3"
                                    fill="none"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: [0, 1, 0] }}
                                    transition={{ duration: 22, repeat: Infinity, delay: 6, ease: "easeInOut" }}
                                />
                            </>
                        )}
                    </svg>
                </motion.div>
            )}
        </div>
    );
};

export default Background;