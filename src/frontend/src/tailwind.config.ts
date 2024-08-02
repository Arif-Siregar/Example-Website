import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        garamond: ['Garamond', 'serif'],
      },
      colors:{
        'dark-green':'#0b6623'
      }
    }
   
  },
  plugins: [],
}
export default config
