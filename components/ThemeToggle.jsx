'use client';

import { useEffect, useSyncExternalStore } from 'react';

const THEME_STORAGE_KEY = 'streambox-theme';
const THEME_CHANGE_EVENT = 'streambox-theme-change';

function subscribeToThemeChanges(onChange) {
  window.addEventListener('storage', onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

function getThemeSnapshot() {
  return window.localStorage.getItem(THEME_STORAGE_KEY) === 'glossy';
}

function getServerThemeSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const isGlossy = useSyncExternalStore(
    subscribeToThemeChanges,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  useEffect(() => {
    if (isGlossy) {
      document.documentElement.dataset.theme = 'glossy';
    } else {
      delete document.documentElement.dataset.theme;
    }
  }, [isGlossy]);

  const toggleTheme = () => {
    const nextIsGlossy = !isGlossy;

    if (nextIsGlossy) {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'glossy');
    } else {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    }

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      className="theme-toggle rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-blue-300/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
      aria-label={`Switch to ${isGlossy ? 'default' : 'glossy'} theme`}
      aria-pressed={isGlossy}
      title={`Switch to ${isGlossy ? 'default' : 'glossy'} theme`}
      onClick={toggleTheme}
    >
      {isGlossy ? 'Glossy' : 'Default'}
    </button>
  );
}
