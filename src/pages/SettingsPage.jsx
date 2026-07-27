import { useUIStore } from '../store/useUIStore';
import Topbar from '../components/layout/Topbar';
import Button from '../components/ui/Button';

export default function SettingsPage() {
  const lowGlow = useUIStore((s) => s.lowGlow);
  const toggleLowGlow = useUIStore((s) => s.toggleLowGlow);

  return (
    <>
      <Topbar title="settings" />
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="mb-6 font-mono text-lg uppercase tracking-widest text-neon-green">
          Settings
        </h1>

        <div className="glow-card max-w-lg rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-sm text-gray-200">Low-glow mode</div>
              <p className="mt-1 font-mono text-xs text-gray-500">
                Reduce neon glow effects for accessibility / long sessions.
              </p>
            </div>
            <Button variant={lowGlow ? 'solid' : 'ghost'} size="sm" onClick={toggleLowGlow}>
              {lowGlow ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>

        <div className="glow-card mt-4 max-w-lg rounded-lg p-5 font-mono text-xs text-gray-500">
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
