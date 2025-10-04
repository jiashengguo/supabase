const config = require('config/tailwind.config')

module.exports = config({
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './../../packages/ui/src/**/*.{tsx,ts,js}',
    './../../packages/ui-patterns/src/**/*.{tsx,ts,js}',
  ],
  plugins: [require('@tailwindcss/container-queries')],
  theme: {
    extend: {
      fontSize: {
        grid: '13px',
      },
    },
  },
})
