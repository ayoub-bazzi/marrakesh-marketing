/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                forest: "#002219",
                lime: "#DFFFBF",
            },
            fontFamily: {
                sans: ["Inter", "Montserrat", "sans-serif"],
            },
            keyframes: {
                blob: {
                    "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
                    "25%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
                    "50%": { borderRadius: "50% 60% 30% 60% / 30% 40% 70% 50%" },
                    "75%": { borderRadius: "40% 60% 60% 40% / 60% 40% 50% 60%" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                    "50%": { transform: "translateY(-18px) rotate(4deg)" },
                },
            },
            animation: {
                blob: "blob 8s ease-in-out infinite",
                float: "float 6s ease-in-out infinite",
            },
        },
    },
    plugins: [],
}