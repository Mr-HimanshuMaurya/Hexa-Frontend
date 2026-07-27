import { LogOut, Contrast } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ title }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleLowGlow = useUIStore((s) => s.toggleLowGlow);
  const lowGlow = useUIStore((s) => s.lowGlow);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-neon-green/15 bg-terminal-surface/50 px-6">
      <div className="font-mono text-sm uppercase tracking-widest text-gray-300">
        <span className="text-neon-cyan">~/</span>
        {title}
        <span className="cursor-blink text-neon-green">_</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleLowGlow}
          title="Toggle low-glow mode"
          className={`rounded border p-1.5 transition ${
            lowGlow
              ? 'border-neon-cyan/50 text-neon-cyan'
              : 'border-transparent text-gray-500 hover:text-neon-cyan'
          }`}
        >
          <Contrast size={16} />
        </button>
        <span className="font-mono text-xs text-gray-400">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-gray-400 transition hover:text-neon-red"
        >
          <LogOut size={14} />
          Exit
        </button>
      </div>
    </header>
  );
}
