import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'vault-theme';
const THEME_TRANSITIONING = 'theme-transitioning';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const transitionTheme = (next: Theme) => {
    if (next === theme) return;

    const supportsVT = typeof document !== 'undefined' && 'startViewTransition' in document;

    if (supportsVT && !prefersReducedMotion()) {
      const vt = (document as Document & { startViewTransition: (cb: () => void) => { finished: Promise<void> } });
      vt.startViewTransition(() => {
        setThemeState(next);
      });
    } else if (!prefersReducedMotion()) {
      // Coordinated fallback: a single overlay crossfade so the visual change
      // feels unified instead of per-element color interpolation.
      const root = document.documentElement;
      root.classList.add(THEME_TRANSITIONING);
      // Force a snapshot of the old state, then swap.
      requestAnimationFrame(() => {
        setThemeState(next);
      });
      // Remove the transitioning class after the fallback duration.
      window.setTimeout(() => {
        root.classList.remove(THEME_TRANSITIONING);
      }, 420);
    } else {
      setThemeState(next);
    }
  };

  const setTheme = (t: Theme) => transitionTheme(t);
  const toggleTheme = () => transitionTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
