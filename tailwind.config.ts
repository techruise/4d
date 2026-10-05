import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#060A13',
        panel: '#0D1526',
        line: '#1E2B47',
        accent: '#22D3EE',
        gold: '#F5C451',
        ink: '#E8EEF8',
        muted: '#8E9BB3',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument)', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 50px -10px rgba(34, 211, 238, 0.45)',
        'glow-sm': '0 0 24px -6px rgba(34, 211, 238, 0.5)',
        'glow-gold': '0 0 30px -8px rgba(245, 196, 81, 0.45)',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};

export default config;
