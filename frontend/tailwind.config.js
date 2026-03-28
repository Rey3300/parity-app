/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Quant Terminal Palette
        'terminal-dark': '#020617',  /* Deep Midnight */
        'terminal-amber': '#f59e0b', /* Ticker Gold */
        'terminal-mint': '#10b981',  /* Profit Green */
        'terminal-red': '#ef4444',   /* Loss Red */
        'terminal-slate': '#1e293b', /* Grid Lines */
      },
      fontFamily: {
        // This allows Claude to use 'font-mono' for data
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}