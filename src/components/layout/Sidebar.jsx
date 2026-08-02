import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LayoutTemplate,
  Users,
  Send,
  KeyRound,
  Terminal,
  X,
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/templates', icon: LayoutTemplate, label: 'Templates' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/campaigns', icon: Send, label: 'Campaigns' },
  { to: '/api-keys', icon: KeyRound, label: 'API Keys' },
];

export default function Sidebar() {
  const sidebarMobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const setSidebarMobileOpen = useUIStore((s) => s.setSidebarMobileOpen);

  const sidebarContent = (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-neon-green/15 bg-terminal-surface md:w-60">
      <div className="flex items-center justify-between border-b border-neon-green/15 px-5 py-5">
        <div className="flex items-center gap-2">
          <Terminal className="text-neon-green" size={22} />
          <div>
            <div className="font-mono text-lg font-bold tracking-widest text-neon-green">HEXA</div>
            <div className="font-mono text-[10px] tracking-wider text-gray-500">MAILER v1.0</div>
          </div>
        </div>
        <button
          onClick={() => setSidebarMobileOpen(false)}
          className="text-gray-400 hover:text-neon-red md:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setSidebarMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition-all ${
                isActive
                  ? 'border border-neon-green/40 bg-neon-green/10 text-neon-green shadow-[0_0_12px_rgba(0,255,157,0.12)]'
                  : 'border border-transparent text-gray-400 hover:border-neon-green/20 hover:text-neon-green/80'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-neon-green/15 px-4 py-3 font-mono text-[10px] text-gray-600">
        <span className="text-neon-green">●</span> system online
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden shrink-0 md:block">
        {sidebarContent}
      </div>

      {sidebarMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarMobileOpen(false)}
          />
          <div className="relative h-full w-64 max-w-[85%]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
