import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useUIStore } from '../../store/useUIStore';

export default function DashboardLayout() {
  const lowGlow = useUIStore((s) => s.lowGlow);

  return (
    <div className={`flex h-screen overflow-hidden terminal-bg ${lowGlow ? 'low-glow' : ''}`}>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}
