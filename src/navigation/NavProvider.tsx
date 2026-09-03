import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Route =
  | 'overview'
  | 'trades'
  | 'trade-detail'
  | 'trade-create'
  | 'calendar'
  | 'analytics'
  | 'intelligence'
  | 'dna'
  | 'replay'
  | 'debrief'
  | 'settings';

interface NavContextValue {
  route: Route;
  params: Record<string, string>;
  navigate: (route: Route, params?: Record<string, string>) => void;
}

const NavContext = createContext<NavContextValue | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('overview');
  const [params, setParams] = useState<Record<string, string>>({});

  const navigate = (r: Route, p: Record<string, string> = {}) => {
    setParams(p);
    setRoute(r);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return <NavContext.Provider value={{ route, params, navigate }}>{children}</NavContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}

export type { Route };

interface PageTransitionProps {
  children: ReactNode;
  routeKey: string;
}

export function PageTransition({ children, routeKey }: PageTransitionProps) {
  const [displayed, setDisplayed] = useState(children);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setDisplayed(children);
      setAnimating(false);
    }, 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  return (
    <div
      key={routeKey}
      className={cn(
        'transition-all duration-standard ease-premium',
        animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0',
      )}
    >
      {displayed}
    </div>
  );
}
