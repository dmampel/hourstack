'use client';

import { useState } from 'react';
import { User, Target, CircleDollarSign, Download, Trash2, Save, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const { settings, updateSettings, resetStore, projects, sessions } = useAppStore();
  
  const [name, setName] = useState(settings.name);
  const [weeklyGoal, setWeeklyGoal] = useState(settings.weeklyGoal.toString());
  const [currency, setCurrency] = useState(settings.defaultCurrency);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name,
      weeklyGoal: Number(weeklyGoal) || 0,
      defaultCurrency: currency,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExport = () => {
    const data = {
      projects,
      sessions,
      settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hourstack-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm('¿ESTÁS SEGURO? Se borrarán todos tus proyectos y sesiones permanentemente. No hay vuelta atrás.')) {
      resetStore();
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-6 pt-8 pb-10 md:px-8">
      <div>
        <h1 className="font-[family-name:var(--font-fraunces)] font-semibold text-[var(--color-ink)]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Manage your preferences and data.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card padding="md" title="Profile Settings">
          <div className="grid gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
                <User size={14} />
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-line)] bg-transparent px-4 py-2 text-sm text-[var(--color-ink)] transition-colors focus:border-[var(--color-lime)] focus:outline-none"
                placeholder="Delfina"
                required
              />
            </div>

            {/* Weekly Goal */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
                <Target size={14} />
                Weekly Goal (Hours)
              </label>
              <input
                type="number"
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-line)] bg-transparent px-4 py-2 text-sm text-[var(--color-ink)] transition-colors focus:border-[var(--color-lime)] focus:outline-none"
                min="1"
                max="168"
                required
              />
            </div>

            {/* Default Currency */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
                <CircleDollarSign size={14} />
                Default Currency
              </label>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'USD' | 'ARS')}
                  className="w-full appearance-none rounded-lg border border-[var(--color-line)] bg-transparent px-4 py-2 text-sm text-[var(--color-ink)] transition-colors focus:border-[var(--color-lime)] focus:outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="ARS">ARS ($)</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button type="submit" variant="primary" size="md">
              <Save size={16} />
              {isSaved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </form>

      {/* Data Management */}
      <Card padding="md" title="Data Management">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">Export Data</p>
              <p className="text-xs text-[var(--color-ink-soft)]">Download all your projects and sessions in JSON format.</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download size={14} />
              Export Backup
            </Button>
          </div>

          <div className="border-t border-[var(--color-line)] pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-red-500">Reset All Data</p>
                <p className="text-xs text-[var(--color-ink-soft)]">Permanently delete everything. This cannot be undone.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleReset} className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600">
                <Trash2 size={14} />
                Reset Store
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
