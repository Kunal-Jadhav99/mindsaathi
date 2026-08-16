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
        bg: {
          950: '#0a0a0f',
          900: '#111118',
          800: '#1a1a24',
          700: '#20202e',
        },
        surface: {
          border: '#2a2a3a',
          subtle: '#1e1e2a',
        },
        brand: {
          400: '#a78bfa',
          500: '#7c6af7',
          600: '#6d5ae0',
        },
        risk: {
          low: '#4ade80',
          medium: '#fbbf24',
          high: '#f87171',
        },
      },
      backgroundImage: {
        'glow-indigo': 'radial-gradient(ellipse at top left, rgba(124,106,247,0.14) 0%, transparent 60%)',
      },
      boxShadow: {
        'glow-sm':     '0 0 12px rgba(124,106,247,0.25)',
        'glow-md':     '0 0 24px rgba(124,106,247,0.35)',
        'glow-lg':     '0 0 48px rgba(124,106,247,0.45)',
        'glow-danger': '0 0 24px rgba(248,113,113,0.35)',
        'card':        '0 4px 24px rgba(0,0,0,0.5)',
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
          '0%, 100%': { boxShadow: '0 0 12px rgba(124,106,247,0.3)' },
          '50%':       { boxShadow: '0 0 28px rgba(124,106,247,0.65)' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(248,113,113,0.4)' },
          '50%':       { boxShadow: '0 0 22px rgba(248,113,113,0.8)' },
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
