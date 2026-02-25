/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ff4d4d",
                secondary: "#2d3436",
                accent: "#00cec9",
                golden: "#FFD700",
            },
        },
    },
    plugins: [],
}
