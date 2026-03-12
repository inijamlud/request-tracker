import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./constants/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        background: "var(--color-background)",
        accent: "var(--color-accent)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        status: {
          pending: "var(--color-status-pending)",
          submitted: "var(--color-status-submitted)",
          done: "var(--color-status-done)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
