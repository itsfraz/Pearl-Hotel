module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Slate 900 - Deep Luxury
          light: '#334155',
          dark: '#020617',
        },
        secondary: {
          DEFAULT: '#d4af37', // Metallic Gold
          light: '#f3e5ab', // Champagne
          dark: '#b4941f',
        },
        surface: {
          50: '#f8fafc', // Ultra light gray/white
          100: '#f1f5f9',
          200: '#e2e8f0',
        },
        accent: '#0ea5e9', // Sky blue for subtle tech touches if needed
      },
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'], // For headings
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slow-zoom': 'zoomIn 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

