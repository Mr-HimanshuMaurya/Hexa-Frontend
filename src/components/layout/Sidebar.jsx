import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LayoutTemplate,
  Users,
  Send,
  KeyRound,
  Settings,
  Terminal,
} from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/templates', icon: LayoutTemplate, label: 'Templates' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/campaigns', icon: Send, label: 'Campaigns' },
  { to: '/api-keys', icon: KeyRound, label: 'API Keys' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-neon-green/15 bg-terminal-surface/80">
      <div className="flex items-center gap-2 border-b border-neon-green/15 px-5 py-5">
        <Terminal className="text-neon-green" size={22} />
        <div>
          <div className="font-mono text-lg font-bold tracking-widest text-neon-green">HEXA</div>
          <div className="font-mono text-[10px] tracking-wider text-gray-500">MAILER v1.0</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
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
}
