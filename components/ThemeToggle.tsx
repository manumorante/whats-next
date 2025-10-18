'use client';

import { useEffect, useState } from 'react';
import type { Theme } from '@/types';

const STORAGE_KEY = 'whats-next-theme';

function resolveInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent('theme-change', { detail: theme }));
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const initial = resolveInitialTheme();
    setTheme(initial);
    applyTheme(initial);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    applyTheme(theme);
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const label = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      className="group flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800 shadow-sm transition-all hover:scale-105 hover:border-neutral-400 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-500"
    >
      {isMounted ? (
        theme === 'dark' ? (
          <SunIcon className="h-5 w-5 transition-transform group-hover:rotate-12" />
        ) : (
          <MoonIcon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
        )
      ) : null}
    </button>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <title>Sol</title>
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="2.5" x2="12" y2="5.5" />
      <line x1="12" y1="18.5" x2="12" y2="21.5" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2.5" y1="12" x2="5.5" y2="12" />
      <line x1="18.5" y1="12" x2="21.5" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <title>Luna</title>
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5c0-.5 0-1 .1-1.5A9.5 9.5 0 1 0 21.9 15.4c-.5.1-1 .1-1.4.1Z" />
    </svg>
  );
}
