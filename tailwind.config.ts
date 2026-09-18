import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEFCF9',
          100: '#FAF7F2',
          200: '#F5EFE6',
          300: '#EDE3D5',
          400: '#E2D4C0',
          500: '#D4C0A3',
        },
        beige: {
          100: '#F0E8DC',
          200: '#E8DDD0',
          300: '#DCCFBE',
        },
        terracotta: {
          400: '#D4856A',
          500: '#C4704F',
          600: '#B05A3A',
          700: '#8F4428',
        },
        brown: {
          400: '#8B7355',
          500: '#7A6040',
          600: '#6B5230',
          700: '#5C4A35',
          800: '#3D2E1E',
          900: '#2C1810',
        },
        sage: {
          300: '#B8C4A8',
          400: '#9BAD8A',
          500: '#7D9268',
        },
        espresso: '#2C1810',
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(44,24,16,0.08)',
        'warm': '0 4px 12px rgba(44,24,16,0.10)',
        'warm-lg': '0 8px 28px rgba(44,24,16,0.13)',
        'warm-xl': '0 16px 48px rgba(44,24,16,0.16)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
}

export default config
