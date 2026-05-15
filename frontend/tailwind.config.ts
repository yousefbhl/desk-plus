import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:                    '#ba0a0d',
        'primary-container':        '#de2d24',
        'primary-fixed':            '#ffdad5',
        'on-primary':               '#ffffff',
        'on-primary-container':     '#fffbff',
        surface:                    '#fcf9f8',
        'surface-container-low':    '#f6f3f2',
        'surface-container':        '#f0eded',
        'surface-container-high':   '#eae7e7',
        'surface-container-highest':'#e5e2e1',
        'surface-container-lowest': '#ffffff',
        'surface-dim':              '#dcd9d9',
        'on-surface':               '#1c1b1b',
        'on-surface-variant':       '#5c403c',
        outline:                    '#916f6a',
        'outline-variant':          '#e5bdb8',
        secondary:                  '#5f5e5e',
        'secondary-container':      '#e2dfde',
        'on-secondary':             '#ffffff',
        'inverse-surface':          '#313030',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        ambient: '0 20px 40px rgba(28,27,27,0.06)',
        'ambient-lg': '0 32px 64px rgba(28,27,27,0.10)',
      },
      keyframes: {
        pulse_ring: {
          '0%':   { boxShadow: '0 0 0 0 rgba(186,10,13,0.45)' },
          '70%':  { boxShadow: '0 0 0 14px rgba(186,10,13,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(186,10,13,0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        pulse_ring: 'pulse_ring 1.8s infinite',
        shimmer:    'shimmer 1.4s linear infinite',
        fadeUp:     'fadeUp 0.4s ease both',
        slideIn:    'slideIn 0.3s ease both',
      },
    },
  },
  plugins: [],
}

export default config
