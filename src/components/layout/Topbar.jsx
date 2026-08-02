import { LogOut, Contrast, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ title }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleLowGlow = useUIStore((s) => s.toggleLowGlow);
  const lowGlow = useUIStore((s) => s.lowGlow);
  const toggleSidebarMobile = useUIStore((s) => s.toggleSidebarMobile);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-neon-green/15 bg-terminal-surface/50 px-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={toggleSidebarMobile}
          className="rounded border border-transparent p-1.5 text-gray-400 transition hover:text-neon-green md:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0 truncate font-mono text-xs uppercase tracking-widest text-gray-300 sm:text-sm">
          <span className="text-neon-cyan">~/</span>
          {title}
          <span className="cursor-blink text-neon-green">_</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
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
        <span className="hidden font-mono text-xs text-gray-400 sm:inline">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-gray-400 transition hover:text-neon-red sm:gap-1.5"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </div>
    </header>
  );
}
