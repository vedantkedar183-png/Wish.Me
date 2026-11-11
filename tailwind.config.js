/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        romantic: {
          50:    '#fff5f7',
          100:   '#ffe0ea',
          200:   '#ffb3c6',
          300:   '#ff80a0',
          400:   '#ff6b9d',
          500:   '#f43f78',
          600:   '#e63946',
          700:   '#c0294f',
          800:   '#7a1a30',
          900:   '#4a1020',
          muted: '#9e6b7a',
          warm:  '#4a3728',
          cream: '#fff9f5',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        cursive: ['"Dancing Script"', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'parallax-float': 'parallaxFloat 6s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        neonPulse: {
          '0%, 100%': { textShadow: '0 0 10px currentColor, 0 0 20px currentColor' },
          '50%': { textShadow: '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3) translateY(40px)' },
          '50%': { opacity: '1', transform: 'scale(1.05) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        parallaxFloat: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-15px) translateX(5px)' },
          '75%': { transform: 'translateY(10px) translateX(-5px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' },
        },
      },
      backgroundSize: {
        '200%': '200%',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 30px rgba(236, 72, 153, 0.5), 0 0 60px rgba(236, 72, 153, 0.3)',
        'glow-lg': '0 0 50px rgba(236, 72, 153, 0.6), 0 0 100px rgba(236, 72, 153, 0.4)',
      },
      screens: {
        '3xs': '320px',
        xs: '375px',
      },
    },
  },
  plugins: [],
};
