/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        // Reversed mapping so we don't have to change the JSX classes:
        // bg-950 is now the Warm Cream background, bg-900 is white cards
        bg: {
          950: '#FBF9F6', // Warm Cream
          900: '#FFFFFF', // White for cards
          800: '#F4F0E6', // Inputs
          700: '#EAE4D5', // Hovers
        },
        surface: {
          border: '#E2DCD0',
          subtle: '#F0EBE0',
        },
        // Reversed slate so slate-100 is now dark text
        slate: {
          100: '#2F3E46', // Deep Slate (main text)
          200: '#3D505A',
          300: '#4C616D',
          400: '#687E8B', // Muted text
          500: '#839DAA',
          600: '#A1B5C0',
          700: '#C5D2D9',
          800: '#DFE6EA',
          900: '#F2F6F8',
        },
        brand: {
          400: '#9DBBAE', // Light Sage
          500: '#87A99B', // Primary Sage Green
          600: '#759688', // Dark Sage
        },
        secondary: {
          500: '#C8B6FF', // Soft Lavender
        },
        accent: {
          500: '#F7D6C8', // Muted Peach
        },
        risk: {
          low: '#4ade80',
          medium: '#fbbf24',
          high: '#f87171',
        },
      },
      backgroundImage: {
        'glow-indigo': 'radial-gradient(ellipse at top left, rgba(135,169,155,0.15) 0%, transparent 60%)',
      },
      boxShadow: {
        'glow-sm':     '0 4px 12px rgba(135,169,155,0.15)',
        'glow-md':     '0 8px 24px rgba(135,169,155,0.2)',
        'glow-lg':     '0 12px 48px rgba(135,169,155,0.25)',
        'glow-danger': '0 8px 24px rgba(248,113,113,0.25)',
        'card':        '0 2px 12px rgba(47,62,70,0.04)',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(135,169,155,0.2)' },
          '50%':       { boxShadow: '0 0 28px rgba(135,169,155,0.4)' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(248,113,113,0.2)' },
          '50%':       { boxShadow: '0 0 22px rgba(248,113,113,0.5)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%':       { transform: 'scale(1.07)', opacity: '1' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease both',
        'fade-in':    'fadeIn 0.4s ease both',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'pulse-red':  'pulseRed 1.8s ease-in-out infinite',
        'breathe':    'breathe 3s ease-in-out infinite',
        'slide-in':   'slideIn 0.4s ease both',
      },
    },
  },
  plugins: [],
}
