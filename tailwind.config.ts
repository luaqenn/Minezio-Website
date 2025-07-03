import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          dark: '#1e40af',    // blue-800
        },
        secondary: {
          DEFAULT: '#64748b', // slate-500
          dark: '#334155',    // slate-800
        },
        background: {
          DEFAULT: '#fff',
          dark: '#0f172a',
        },
        muted: {
          DEFAULT: '#f1f5f9', // slate-100
          dark: '#1e293b',    // slate-900
        },
        destructive: {
          DEFAULT: '#ef4444', // red-500
          dark: '#b91c1c',    // red-800
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
