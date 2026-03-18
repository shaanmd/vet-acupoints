import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // SDVetStudio — VetAI Overlap theme
        vetai: {
          primary:   '#1A3A5C',
          secondary: '#48C9A0',
          bg:        '#F0F7F5',
          surface:   '#FFFFFF',
          text:      '#0D2035',
          muted:     '#5A8080',
          border:    '#C0DDD6',
          accent:    '#FF6B6B',
        },
        // Keep tcvm shades for category colour-coding on cards (indigo/amber/rose/cyan/emerald)
        tcvm: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        serif:   ['Lora', 'Georgia', 'serif'],
        mono:    ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        'card': '18px',
        'btn':  '12px',
        'tag':  '100px',
      },
    },
  },
  plugins: [],
}
export default config
