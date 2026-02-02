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
        // 화이트 & 파스텔 라이트 테마 (기본)
        background: "#FFFFFF",
        foreground: "#374151",
        card: "#FFFFFF",
        "card-foreground": "#374151",
        primary: "#93C5FD",
        "primary-foreground": "#FFFFFF",
        secondary: "#F3F4F6",
        "secondary-foreground": "#374151",
        muted: "#F3F4F6",
        "muted-foreground": "#9CA3AF",
        accent: "#F3F4F6",
        "accent-foreground": "#374151",
        destructive: "#FCA5A5",
        "destructive-foreground": "#FFFFFF",
        border: "#E5E7EB",
        input: "#F3F4F6",
        ring: "#93C5FD",
        // Activity colors
        training: "#FDE68A",
        match: "#A7F3D0",
        plab: "#C4B5FD",
        // Result colors
        win: "#A7F3D0",
        lose: "#FCA5A5",
        draw: "#FDE68A",
      },
    },
  },
  plugins: [],
}
