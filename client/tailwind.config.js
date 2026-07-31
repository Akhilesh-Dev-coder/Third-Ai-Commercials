/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#FF2A3B',
          'red-bright': '#FF4D5E',
          'red-hover': '#E01E2E',
          'red-glow': 'rgba(255, 42, 59, 0.4)',
          dark: '#050508',
          surface: '#0B0B10',
          card: '#12121A',
          'card-hover': '#181824',
          grey: '#1F202B',
          muted: '#8A8F9E',
          accent: '#FF7E36'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        display: ['Outfit', 'Space Grotesk', 'sans-serif']
      },
      boxShadow: {
        'red-glow': '0 0 25px rgba(255, 42, 59, 0.35)',
        'red-glow-lg': '0 0 50px rgba(255, 42, 59, 0.55)',
        'red-glow-xl': '0 0 80px rgba(255, 42, 59, 0.7)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-hover': '0 12px 40px 0 rgba(255, 42, 59, 0.25)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'glow-pulse': 'glowPulse 3s infinite ease-in-out',
        'fadeIn': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(40px)' },
          '50%': { opacity: '0.8', filter: 'blur(60px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }
      });
    }
  ],
}
