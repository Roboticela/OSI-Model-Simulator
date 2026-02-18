"use client";

export const initializeTheme = (): "light" | "dark" => {
  if (typeof window === 'undefined') return 'light';
  
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = (storedTheme || (systemPrefersDark ? 'dark' : 'light')) as "light" | "dark";
  
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(initialTheme);
  
  return initialTheme;
};

export const setThemePreference = (theme: "light" | "dark"): void => {
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(theme);
  
  localStorage.setItem('theme', theme);
}; 