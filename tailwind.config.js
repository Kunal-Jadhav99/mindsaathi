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
          950: '#F4F8FF',
          900: '#FFFFFF',
          800: '#EDF4FF',
          700: '#E0ECFF',
        },
        surface: {
          border: '#D6E3F7',
          subtle: '#EEF4FF',
        },
        slate: {
          100: '#0F172A',
          200: '#15314F',
          300: '#23436C',
          400: '#466387',
          500: '#667D9B',
          600: '#8EA0B8',
          700: '#B9C7D8',
          800: '#DDEAFD',
          900: '#F6F9FF',
        },
        brand: {
          400: '#7DB6FF',
          500: '#2D6CDF',
          600: '#1F4FB3',
        },
        secondary: {
          500: '#9EC3FF',
        },
        accent: {
          500: '#DCEBFF',
        },
        risk: {
          low: '#22c55e',
          medium: '#f59e0b',
          high: '#ef4444',
        },
      },
      backgroundImage: {
        'glow-indigo': 'radial-gradient(ellipse at top left, rgba(45,108,223,0.12) 0%, transparent 60%)',
      },
      boxShadow: {
        'glow-sm': '0 8px 24px rgba(45,108,223,0.14)',
        'glow-md': '0 16px 36px rgba(45,108,223,0.18)',
        'glow-lg': '0 22px 52px rgba(45,108,223,0.22)',
        'glow-danger': '0 10px 30px rgba(239,68,68,0.2)',
        'card': '0 4px 20px rgba(15,23,42,0.04)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(45,108,223,0.18)' },
          '50%': { boxShadow: '0 0 28px rgba(45,108,223,0.28)' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(239,68,68,0.18)' },
          '50%': { boxShadow: '0 0 22px rgba(239,68,68,0.32)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.07)', opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'pulse-red': 'pulseRed 1.8s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.4s ease both',
      },
    },
  },
  plugins: [],
};
