import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'layer-purple': {
          light: '#F3E8FF',
          border: '#D8B4FE',
        },
        'layer-indigo': {
          light: '#E0E7FF',
          border: '#A5B4FC',
        },
        'layer-blue': {
          light: '#DBEAFE',
          border: '#93C5FD',
        },
        'layer-green': {
          light: '#DCFCE7',
          border: '#86EFAC',
        },
        'layer-yellow': {
          light: '#FEF9C3',
          border: '#FDE047',
        },
        'layer-orange': {
          light: '#FFEDD5',
          border: '#FDBA74',
        },
        'layer-red': {
          light: '#FEE2E2',
          border: '#FCA5A5',
        },
        'dark-layer-purple': {
          dark: '#581C87',
          border: '#7E22CE',
        },
        'dark-layer-indigo': {
          dark: '#3730A3',
          border: '#4F46E5',
        },
        'dark-layer-blue': {
          dark: '#1E40AF',
          border: '#3B82F6',
        },
        'dark-layer-green': {
          dark: '#166534',
          border: '#22C55E',
        },
        'dark-layer-yellow': {
          dark: '#854D0E',
          border: '#EAB308',
        },
        'dark-layer-orange': {
          dark: '#9A3412',
          border: '#F97316',
        },
        'dark-layer-red': {
          dark: '#991B1B',
          border: '#EF4444',
        },
      },
    },
  },
  plugins: [],
};

export default config; 