/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Existing (backward compatibility)
        'galaxy-blue-start': '#4facfe',
        'galaxy-blue-end': '#00f2fe',

        // Time-based gradients
        'dawn-start': '#FF6B9D',
        'dawn-end': '#FEC163',
        'morning-start': '#4FACFE',
        'morning-end': '#00F2FE',
        'afternoon-start': '#89F7FE',
        'afternoon-end': '#66A6FF',
        'evening-start': '#FA709A',
        'evening-end': '#FEE140',
        'night-start': '#2E3192',
        'night-end': '#1BFFFF',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
      },
      keyframes: {
        'slide-down': {
          '0%': {
            transform: 'translateX(-50%) translateY(-100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(-50%) translateY(0)',
            opacity: '1',
          },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
