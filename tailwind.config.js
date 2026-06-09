/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ===== IMPERIAL EXTERIORS BRAND COLORS =====
        // Change these to update branding across the whole app
        imperial: {
          purple: '#7C3AED',      // primary purple
          purpledark: '#4C1D95',  // deep purple (gradients, headers)
          purpleglow: '#A78BFA',  // light purple (accents, text)
          green: '#22C55E',       // success / progress green
          greenglow: '#4ADE80',   // bright green (wins, highlights)
          charcoal: '#17151D',    // app background
          slate: '#211E2B',       // card background
          slate2: '#2B2738',      // raised card / inputs
          line: '#383249',        // borders
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'], // big scoreboard numbers
        body: ['Barlow', 'sans-serif'],
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '70%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideup: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowpulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.45)' },
          '50%': { boxShadow: '0 0 0 10px rgba(74, 222, 128, 0)' },
        },
      },
      animation: {
        pop: 'pop 0.25s ease-out both',
        slideup: 'slideup 0.3s ease-out both',
        glowpulse: 'glowpulse 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
