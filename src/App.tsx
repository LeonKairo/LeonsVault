import { Plus } from 'lucide-react';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { NavProvider, useNav, PageTransition, type Route } from '@/navigation/NavProvider';
import { SessionCheckInProvider, useSessionCheckIn } from '@/session/SessionCheckInProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastContainer } from '@/components/ui/Toast';
import { SessionCheckIn } from '@/components/session/SessionCheckIn';
import { SessionRestricted } from '@/components/session/SessionRestricted';
import { OverviewPage } from '@/pages/OverviewPage';
import { TradesPage } from '@/pages/TradesPage';
import { TradeDetailPage } from '@/pages/TradeDetailPage';
import { TradeCreatePage } from '@/pages/TradeCreatePage';
import { CalendarPage } from '@/pages/CalendarPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { IntelligencePage } from '@/pages/IntelligencePage';
import { DnaPage } from '@/pages/DnaPage';
import { DebriefPage } from '@/pages/DebriefPage';
import { ReplayPage } from '@/pages/ReplayPage';
import { SettingsPage } from '@/pages/SettingsPage';

const PLATFORM_ROUTES: Route[] = ['overview', 'trades', 'trade-detail', 'trade-create'];

function CurrentPage() {
  const { route } = useNav();

  switch (route) {
    case 'overview':
      return <OverviewPage />;
    case 'trades':
      return <TradesPage />;
    case 'trade-detail':
      return <TradeDetailPage />;
    case 'trade-create':
      return <TradeCreatePage />;
    case 'calendar':
      return <CalendarPage />;
    case 'analytics':
      return <AnalyticsPage />;
    case 'intelligence':
      return <IntelligencePage />;
    case 'dna':
      return <DnaPage />;
    case 'debrief':
      return <DebriefPage />;
    case 'replay':
      return <ReplayPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <OverviewPage />;
  }
}

function AppShell() {
  const { route, navigate } = useNav();
  const { loading, checkIn, status, blocked, checkInPending } = useSessionCheckIn();

  const softWarningPending = !loading && status === 'soft_warning' && checkIn && !checkIn.acknowledged;
  const isPlatformRoute = PLATFORM_ROUTES.includes(route);

  if (checkInPending || softWarningPending) {
    return (
      <SessionCheckIn
        onComplete={() => {
          if (isPlatformRoute) navigate('overview');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />

      <main className="flex-1 min-w-0">
        <div className="max-w-vault mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 md:pt-8">
          {blocked && isPlatformRoute ? (
            <SessionRestricted />
          ) : (
            <PageTransition routeKey={route}>
              <CurrentPage />
            </PageTransition>
          )}
        </div>

        {/* Floating action button — L3 primary glow */}
        {(route === 'overview' || route === 'trades') && !(blocked && isPlatformRoute) && (
          <button
            onClick={() => navigate('trade-create')}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full vault-primary-glow text-bg flex items-center justify-center focus-ring z-30"
            aria-label="Add new trade"
            title="Add new trade"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SessionCheckInProvider>
        <NavProvider>
          <AppShell />
          <ToastContainer />
        </NavProvider>
      </SessionCheckInProvider>
    </ThemeProvider>
  );
}
