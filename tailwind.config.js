/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // 파스텔 라이트 테마 (기본)
        background: "#FFF9F5",
        foreground: "#4A4A4A",
        card: "#FFFFFF",
        "card-foreground": "#4A4A4A",
        primary: "#7ECEC0",
        "primary-foreground": "#FFFFFF",
        secondary: "#F5EDE6",
        "secondary-foreground": "#4A4A4A",
        muted: "#F5EDE6",
        "muted-foreground": "#8B8B8B",
        accent: "#F5EDE6",
        "accent-foreground": "#4A4A4A",
        destructive: "#F5A9A9",
        "destructive-foreground": "#FFFFFF",
        border: "#E8DFD6",
        input: "#F5EDE6",
        ring: "#7ECEC0",
        // Activity colors
        training: "#FFD4A3",
        match: "#A8E6CF",
        plab: "#DDA0DD",
        // Result colors
        win: "#A8E6CF",
        lose: "#F5A9A9",
        draw: "#FFE4B5",
      },
    },
  },
  plugins: [],
}
