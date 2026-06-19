/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0E0E10',
        surface: '#18181C',
        surface2: '#222228',
        'border-subtle': 'rgba(255,255,255,0.08)',
        'border-hover': 'rgba(255,255,255,0.14)',
        'text-primary': '#F0EFF5',
        'text-muted': '#8A8A9A',
        accent: '#7C6CF8',
        'accent-light': '#B5AAFF',
        'accent-glow': 'rgba(124,108,248,0.18)',
        'accent-hover': '#6A5CF0',
        success: '#4ADE80',
        error: '#F87171',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      fontSize: {
        hero: 'clamp(32px, 6vw, 52px)',
      },
      letterSpacing: {
        hero: '-1.5px',
      },
    },
  },
  plugins: [],
};
