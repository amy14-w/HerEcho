/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'her-purple': {
          400: '#a855f7',
          500: '#9333ea',
          600: '#7c3aed',
        },
        'her-teal': {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        'her-pink': {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
        'her-emerald': {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'wave': 'wave 1.5s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(45, 212, 191, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(45, 212, 191, 0.8), 0 0 30px rgba(45, 212, 191, 0.6)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.5)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}