/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,mdx}', // Include Astro + TS/JS + MDX
    './public/**/*.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1e40af',
        secondary: '#9333ea',
        accent: '#facc15',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
