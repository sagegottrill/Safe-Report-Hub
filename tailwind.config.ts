import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: {
          DEFAULT: '#FFFFFF',
          light: '#F2F2F2',
          official: '#FFFFFF',
        },
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#008000', /* Nigerian Flag Green */
          light: '#00A000',
          dark: '#006000',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#0056B3', /* Deep Royal Blue */
          light: '#0077CC',
          dark: '#004080',
          foreground: '#FFFFFF'
        },
        accent: {
          DEFAULT: '#FFD700', /* Gold */
          light: '#FFE44D',
          dark: '#FFC000',
          foreground: '#222222'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        /* Official status colors */
        danger: {
          DEFAULT: '#D32F2F',
          light: '#F44336',
        },
        success: {
          DEFAULT: '#388E3C',
          light: '#4CAF50',
        },
        warning: {
          DEFAULT: '#FBC02D',
          light: '#FFEB3B',
        },
        info: {
          DEFAULT: '#0056B3',
          light: '#2196F3',
        },
        text: {
          DEFAULT: '#222222',
          light: '#666666',
          muted: '#888888',
        },
        /* Official Nigerian colors */
        nigerian: {
          green: '#008000',
          blue: '#0056B3',
          gold: '#FFD700',
          white: '#FFFFFF',
          grey: '#F2F2F2',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Roboto', 'Lato', 'Inter', 'sans-serif'],
        official: ['Roboto', 'Lato', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'calc(var(--radius) + 2px)',
        md: 'var(--radius)',
        sm: 'calc(var(--radius) - 2px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-official': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'pulse-official': 'pulse-official 2s ease-in-out infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#222222',
            fontFamily: 'Roboto, Lato, Inter, sans-serif',
            h1: {
              color: '#222222',
              fontWeight: '700',
              fontSize: '2.5rem',
            },
            h2: {
              color: '#222222',
              fontWeight: '600',
              fontSize: '2rem',
            },
            h3: {
              color: '#222222',
              fontWeight: '600',
              fontSize: '1.5rem',
            },
          },
        },
      },
      fontSize: {
        base: '1.125rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
      boxShadow: {
        'official': '0 2px 4px rgba(0, 128, 0, 0.2)',
        'official-lg': '0 4px 8px rgba(0, 128, 0, 0.3)',
        'card-official': '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    }
  },
  plugins: [
    animate,
    typography,
  ],
} satisfies Config;
