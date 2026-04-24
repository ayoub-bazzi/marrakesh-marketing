import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/* ─── LAUNCH DATE — change this ─── */
const LAUNCH = new Date("2026-05-17T23:59:59");

/* ─── Floating background icons as SVG paths ─── */
const BG_ICONS = [
    {
        id: 1, x: "8%", y: "12%", size: 52, delay: 0,
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 17h2v-7H3v7zm4 0h2V7H7v10zm4 0h2v-4h-2v4zm4 0h2V3h-2v14zm4 0h2v-9h-2v9zM3 20h18" />
            </svg>
        ),
    },
    {
        id: 2, x: "88%", y: "8%", size: 60, delay: 1,
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 11l19-9-9 19-2-8-8-2z" />
            </svg>
        ),
    },
    {
        id: 3, x: "75%", y: "72%", size: 48, delay: 2,
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        id: 4, x: "15%", y: "78%", size: 44, delay: 1.5,
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
            </svg>
        ),
    },
    {
        id: 5, x: "50%", y: "5%", size: 40, delay: 0.8,
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
        ),
    },
    {
        id: 6, x: "92%", y: "50%", size: 50, delay: 2.5,
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l6 6m0 0l6-6m-6 6v10" /><circle cx="16" cy="18" r="2" /><circle cx="8" cy="18" r="2" />
            </svg>
        ),
    },
    {
        id: 7, x: "5%", y: "45%", size: 46, delay: 3,
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 3l14 9-14 9V3z" />
            </svg>
        ),
    },
];

/* ─── Countdown hook ─── */
function useCountdown(target) {
    const calc = () => {
        const diff = Math.max(0, target - Date.now());
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
        };
    };
    const [time, setTime] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, []);
    return time;
}

/* ─── Single countdown cell ─── */
function TimeUnit({ value, label }) {
    return (
        <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.span
                key={value}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="text-5xl md:text-7xl font-black text-lime tabular-nums leading-none"
                style={{ fontFamily: "Montserrat, sans-serif" }}
            >
                {String(value).padStart(2, "0")}
            </motion.span>
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-lime/50 mt-2">
                {label}
            </span>
        </motion.div>
    );
}

/* ─── Main App ─── */
export default function App() {
    const { days, hours, minutes, seconds } = useCountdown(LAUNCH);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    /* Parallax mouse tracking */
    useEffect(() => {
        const handler = (e) => {
            const { innerWidth: w, innerHeight: h } = window;
            setMousePos({ x: (e.clientX / w - 0.5) * 2, y: (e.clientY / h - 0.5) * 2 });
        };
        window.addEventListener("mousemove", handler);
        return () => window.removeEventListener("mousemove", handler);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        setSubmitted(true);
    };

    /* Stagger entrance variants */
    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
    };
    const item = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen w-full bg-forest overflow-hidden flex items-center justify-center"
        >
            {/* ── Noise texture overlay ── */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04] z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                }}
            />

            {/* ── Radial glow ── */}
            <div className="pointer-events-none absolute inset-0 z-0"
                style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(223,255,191,0.07) 0%, transparent 70%)" }}
            />

            {/* ── Floating background icons with parallax ── */}
            {BG_ICONS.map((icon) => (
                <motion.div
                    key={icon.id}
                    className="absolute text-lime/10 pointer-events-none"
                    style={{
                        left: icon.x,
                        top: icon.y,
                        width: icon.size,
                        height: icon.size,
                    }}
                    animate={{
                        y: [0, -18, 0],
                        rotate: [0, 4, -4, 0],
                        x: mousePos.x * (icon.id % 2 === 0 ? 18 : -12),
                    }}
                    transition={{
                        y: { duration: 5 + icon.delay, repeat: Infinity, ease: "easeInOut", delay: icon.delay },
                        rotate: { duration: 7 + icon.delay, repeat: Infinity, ease: "easeInOut", delay: icon.delay },
                        x: { duration: 0.6, ease: "easeOut" },
                    }}
                >
                    {icon.svg}
                </motion.div>
            ))}

            {/* ── Main content ── */}
            <motion.div
                className="relative z-20 flex flex-col items-center text-center px-6 py-16 max-w-3xl w-full"
                variants={container}
                initial="hidden"
                animate="show"
            >

                {/* ── LOGO / BLOB HERO ── */}
                <motion.div variants={item} className="relative mb-10 flex items-center justify-center">
                    {/* Blob */}
                    <motion.div
                        className="w-36 h-36 md:w-44 md:h-44 bg-lime flex items-center justify-center shadow-[0_0_80px_rgba(223,255,191,0.25)]"
                        animate={{
                            borderRadius: [
                                "60% 40% 30% 70% / 60% 30% 70% 40%",
                                "30% 60% 70% 40% / 50% 60% 30% 60%",
                                "50% 60% 30% 60% / 30% 40% 70% 50%",
                                "40% 60% 60% 40% / 60% 40% 50% 60%",
                                "60% 40% 30% 70% / 60% 30% 70% 40%",
                            ],
                            scale: [1, 1.04, 0.97, 1.03, 1],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {/* Cursor icon inside blob */}
                        <svg
                            viewBox="0 0 24 24"
                            fill="#002219"
                            className="w-16 h-16 md:w-20 md:h-20 drop-shadow-xl"
                        >
                            <path d="M4 0L4 20L8.5 15.5L12 22L14.5 21L11 14L17 14Z" />
                        </svg>
                    </motion.div>

                    {/* Orbiting ring */}
                    <motion.div
                        className="absolute w-52 h-52 md:w-64 md:h-64 rounded-full border border-lime/10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    >
                        <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-lime/60"
                        />
                    </motion.div>
                </motion.div>

                {/* ── Eyebrow label ── */}
                <motion.p
                    variants={item}
                    className="text-xs md:text-sm tracking-[0.4em] uppercase text-lime/50 mb-4 font-medium"
                >
                    Marrakesh Marketing — Est. 2025
                </motion.p>

                {/* ── Main Heading ── */}
                <motion.h1
                    variants={item}
                    className="text-4xl md:text-6xl lg:text-7xl font-black text-lime leading-tight tracking-tight mb-6"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    SOMETHING BIG
                    <br />
                    <span className="text-lime/40">IS</span>{" "}
                    <span
                        className="relative inline-block"
                        style={{
                            WebkitTextStroke: "2px #DFFFBF",
                            color: "transparent",
                        }}
                    >
                        CLICKING.
                    </span>
                </motion.h1>

                {/* ── Sub-heading ── */}
                <motion.p
                    variants={item}
                    className="text-lime/60 text-base md:text-lg max-w-md mb-12 leading-relaxed"
                >
                    We're crafting a marketing agency that moves fast, looks sharp, and
                    delivers results that actually matter. Stay tuned.
                </motion.p>

                {/* ── Countdown ── */}
                <motion.div
                    variants={item}
                    className="flex gap-8 md:gap-14 mb-14"
                >
                    {[
                        { value: days, label: "Days" },
                        { value: hours, label: "Hours" },
                        { value: minutes, label: "Minutes" },
                        { value: seconds, label: "Seconds" },
                    ].map(({ value, label }, i) => (
                        <div key={label} className="flex items-center gap-8 md:gap-14">
                            <TimeUnit value={value} label={label} />
                            {i < 3 && (
                                <span className="text-lime/20 text-4xl md:text-5xl font-thin -ml-4 md:-ml-10 select-none">
                                    :
                                </span>
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* ── Divider ── */}
                <motion.div
                    variants={item}
                    className="w-24 h-px bg-lime/20 mb-10"
                />

                {/* ── Newsletter ── */}
                <motion.div variants={item} className="w-full max-w-md">
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="
                  flex-1 bg-transparent border border-lime/20 rounded-full
                  px-6 py-3.5 text-lime placeholder-lime/30 text-sm
                  outline-none focus:border-lime/60 focus:shadow-[0_0_20px_rgba(223,255,191,0.1)]
                  transition-all duration-300
                "
                            />
                            <motion.button
                                type="submit"
                                whileTap={{ scale: 0.96 }}
                                className="
                  btn-liquid border border-lime/80 text-lime
                  rounded-full px-8 py-3.5 text-sm font-bold tracking-widest uppercase
                  transition-colors duration-300 whitespace-nowrap
                "
                            >
                                Notify Me
                            </motion.button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-lime/80 text-sm tracking-widest uppercase border border-lime/20 rounded-full py-4 px-6"
                        >
                            ✦ You're on the list. We'll be in touch.
                        </motion.div>
                    )}
                </motion.div>

                {/* ── Bottom tag ── */}
                <motion.p
                    variants={item}
                    className="mt-14 text-lime/20 text-xs tracking-widest uppercase"
                >
                    marrakesh.marketing
                </motion.p>
            </motion.div>

            {/* ── WhatsApp Floating Button ── */}
            <motion.a
                href="https://wa.me/212753787624"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-lime text-forest shadow-[0_0_20px_rgba(223,255,191,0.25)] hover:shadow-[0_0_35px_rgba(223,255,191,0.5)] transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 50, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-9 md:h-9">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
            </motion.a>
        </div>
    );
}