import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#2563eb",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#f3f4f6",
                    foreground: "#1f2937",
                },
                muted: {
                    DEFAULT: "#9ca3af",
                    foreground: "#f9fafb",
                },
                accent: {
                    DEFAULT: "#8b5cf6",
                    foreground: "#ffffff",
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
export default config;
