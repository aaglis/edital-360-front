import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        text: 'hsl(var(--text))',
        'text-list': 'hsl(var(--text-list))',

        primary: 'hsl(var(--primary))',
        "primary-hover": 'hsl(var(--primary-hover))',
        secondary: 'hsl(var(--secondary))',

        success: 'hsl(var(--success))',
        info: 'hsl(var(--info))',
        warning: 'hsl(var(--warning))',
        destructive: 'hsl(var(--destructive))',

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
