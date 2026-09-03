import { Settings as SettingsIcon, User, Bell, Database, Palette } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-h1 text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1.5">Manage your vault preferences.</p>
      </div>

      <Card className="p-6 animate-fade-up">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-text-tertiary" />
          <SectionLabel>Profile</SectionLabel>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-semibold text-lg">
            L
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-text-primary">Leon</div>
            <div className="text-xs text-text-tertiary">Trader · Personal Vault</div>
          </div>
          <Button variant="secondary" size="sm">Edit</Button>
        </div>
      </Card>

      <Card className="p-6 animate-fade-up animate-delay-100">
        <div className="flex items-center gap-2 mb-5">
          <Palette className="w-4 h-4 text-text-tertiary" />
          <SectionLabel>Appearance</SectionLabel>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-medium text-text-primary">Theme</div>
            <div className="text-xs text-text-tertiary mt-0.5">Switch between dark and light mode</div>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      <Card className="p-6 animate-fade-up animate-delay-200">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-text-tertiary" />
          <SectionLabel>Notifications</SectionLabel>
        </div>
        <div className="space-y-4">
          <ToggleRow label="Daily debrief reminder" description="Get reminded to debrief after each trading day" defaultOn />
          <ToggleRow label="Weekly performance summary" description="Receive a weekly summary of your trading" defaultOn />
          <ToggleRow label="Streak alerts" description="Alert me when I break a discipline streak" />
        </div>
      </Card>

      <Card className="p-6 animate-fade-up animate-delay-300">
        <div className="flex items-center gap-2 mb-5">
          <Database className="w-4 h-4 text-text-tertiary" />
          <SectionLabel>Data</SectionLabel>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium text-text-primary">Export trades</div>
              <div className="text-xs text-text-tertiary mt-0.5">Download your full trade history as CSV</div>
            </div>
            <Button variant="secondary" size="sm">Export</Button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border pt-4">
            <div>
              <div className="text-sm font-medium text-text-primary">Import trades</div>
              <div className="text-xs text-text-tertiary mt-0.5">Import trades from CSV or broker export</div>
            </div>
            <Button variant="secondary" size="sm">Import</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ToggleRow({ label, description, defaultOn }: { label: string; description: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1 pr-4">
        <div className="text-sm font-medium text-text-primary">{label}</div>
        <div className="text-xs text-text-tertiary mt-0.5">{description}</div>
      </div>
      <Toggle defaultOn={defaultOn} />
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn?: boolean }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
      <div className="w-10 h-6 rounded-full bg-surface-interactive border border-border peer-checked:bg-accent/30 peer-checked:border-accent/40 transition-colors duration-standard" />
      <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-surface border border-border-strong peer-checked:translate-x-4 peer-checked:bg-accent transition-transform duration-standard ease-premium" />
    </label>
  );
}
