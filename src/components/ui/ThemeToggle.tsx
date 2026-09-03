import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/theme/ThemeProvider';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative h-9 w-16 rounded-full bg-surface-interactive border border-border flex items-center transition-all duration-structural ease-premium focus-ring group"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Track glow — subtle accent aura when dark */}
      <div
        className={cn(
          'absolute inset-0 rounded-full transition-opacity duration-structural',
          isDark
            ? 'opacity-100'
            : 'opacity-0',
        )}
        style={{
          boxShadow: 'inset 0 0 12px rgb(var(--accent-glow) / 0.06)',
        }}
      />
      <span
        className={cn(
          'absolute h-7 w-7 rounded-full flex items-center justify-center transition-all duration-structural ease-premium z-10',
          isDark
            ? 'left-1 bg-bg-secondary text-accent'
            : 'left-8 bg-surface text-warning shadow-sm',
        )}
        style={{
          boxShadow: isDark
            ? '0 0 12px rgb(var(--accent-glow) / 0.2)'
            : '0 2px 6px rgb(0 0 0 / 0.08)',
        }}
      >
        {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
      </span>
    </button>
  );
}
