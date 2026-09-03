import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  BarChart3,
  Brain,
  Dna,
  Settings,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';
import { useNav, type Route } from '@/navigation/NavProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems: Array<{ route: Route; label: string; icon: typeof LayoutDashboard }> = [
  { route: 'overview', label: 'Overview', icon: LayoutDashboard },
  { route: 'trades', label: 'Trades', icon: BookOpen },
  { route: 'calendar', label: 'Calendar', icon: Calendar },
  { route: 'analytics', label: 'Analytics', icon: BarChart3 },
  { route: 'intelligence', label: 'Intelligence', icon: Brain },
  { route: 'dna', label: 'Trading DNA', icon: Dna },
];

export function Sidebar() {
  const { route, navigate } = useNav();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-bg/80 backdrop-blur-lg border-b border-border flex items-center justify-between px-4">
        <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors focus-ring rounded-md">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <VaultMark className="w-6 h-6" />
          <span className="font-semibold text-sm text-text-primary">LEON'S VAULT</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:sticky top-0 left-0 z-50 md:z-auto h-screen w-[260px] flex-shrink-0',
          'bg-bg-secondary border-r border-border flex flex-col',
          'transition-transform duration-structural ease-premium',
          'md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden absolute top-4 right-4 p-1.5 text-text-tertiary hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="px-5 pt-6 pb-8">
          <div className="flex items-center gap-2.5">
            <VaultMark className="w-8 h-8" />
            <div>
              <div className="font-semibold text-sm text-text-primary tracking-wide">LEON'S VAULT</div>
              <div className="text-[0.6875rem] text-text-tertiary tracking-wider uppercase mt-0.5">Trading OS</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          <div className="px-2 pb-2 pt-1">
            <span className="text-[0.6875rem] text-text-tertiary uppercase tracking-[0.12em] font-medium">Workspace</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = route === item.route || (route === 'trade-detail' && item.route === 'trades') || (route === 'trade-create' && item.route === 'trades') || (route === 'replay' && item.route === 'calendar') || (route === 'debrief' && item.route === 'calendar');
            return (
              <button
                key={item.route}
                onClick={() => go(item.route)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium focus-ring relative group vault-quiet-hover',
                  active
                    ? 'vault-nav-active bg-surface text-text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/60',
                )}
              >
                <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-accent' : 'text-text-tertiary group-hover:text-text-secondary')} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 space-y-3 border-t border-border">
          <button
            onClick={() => go('settings')}
            className={cn(
              'w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium focus-ring vault-quiet-hover',
              route === 'settings'
                ? 'bg-surface text-text-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface/60',
            )}
          >
            <Settings className="w-4 h-4 text-text-tertiary" />
            Settings
          </button>

          <div className="flex items-center justify-between px-3 h-10">
            <span className="text-xs text-text-tertiary font-medium uppercase tracking-wider">Theme</span>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface/60">
            <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-semibold text-sm">
              L
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary truncate">Leon</div>
              <div className="text-xs text-text-tertiary truncate">Trader</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function VaultMark({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg bg-bg flex items-center justify-center border border-border', className)}>
      <svg viewBox="0 0 32 32" className="w-full h-full p-1.5">
        <path d="M8 7v18h2.5v-12.5l5 8h0.5l5-8V25H23.5V7H21l-4.8 7.8L11.5 7H8z" fill="currentColor" className="text-accent" />
      </svg>
    </div>
  );
}
