import { useUIStore } from '../store/useUIStore';
import Topbar from '../components/layout/Topbar';
import Button from '../components/ui/Button';

export default function SettingsPage() {
  const lowGlow = useUIStore((s) => s.lowGlow);
  const toggleLowGlow = useUIStore((s) => s.toggleLowGlow);

  return (
    <>
      <Topbar title="settings" />
      <main className="flex-1 overflow-y-auto p-3 sm:p-6">
        <h1 className="mb-4 font-mono text-base uppercase tracking-widest text-neon-green sm:mb-6 sm:text-lg">
          Settings
        </h1>

        <div className="glow-card max-w-lg rounded-lg p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-mono text-sm text-gray-200">Low-glow mode</div>
              <p className="mt-1 font-mono text-[11px] text-gray-500 sm:text-xs">
                Reduce neon glow effects for accessibility / long sessions.
              </p>
            </div>
            <Button variant={lowGlow ? 'solid' : 'ghost'} size="sm" onClick={toggleLowGlow} className="self-start sm:self-auto">
              {lowGlow ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>

        <div className="glow-card mt-3 max-w-lg rounded-lg p-4 font-mono text-[11px] text-gray-500 sm:mt-4 sm:p-5 sm:text-xs">
          <p>Hexa Mailer v1.0</p>
          <p className="mt-1">Brevo transactional email · multi-key rotation</p>
          <p className="mt-1 text-neon-green/60">
            FROM_NAME / FROM_EMAIL configured via backend .env
          </p>
        </div>
      </main>
    </>
  );
}
