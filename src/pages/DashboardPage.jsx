import {
  Users,
  LayoutTemplate,
  Send,
  KeyRound,
  Activity,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { useDashboardStats } from '../api/campaigns';

const statusColor = {
  sending: 'cyan',
  completed: 'green',
  failed: 'red',
  paused: 'yellow',
  draft: 'gray',
};

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardStats();

  const cards = data
    ? [
        { label: 'Contacts', value: data.totalContacts, icon: Users, color: 'text-neon-green' },
        { label: 'Templates', value: data.totalTemplates, icon: LayoutTemplate, color: 'text-neon-cyan' },
        { label: 'Sent Today', value: data.emailsSentToday, icon: Send, color: 'text-neon-green' },
        {
          label: 'Quota Left',
          value: `${data.quotaRemaining}/${data.totalQuota}`,
          icon: KeyRound,
          color: 'text-neon-cyan',
        },
      ]
    : [];

  return (
    <>
      <Topbar title="dashboard" />
      <main className="flex-1 overflow-y-auto p-3 sm:p-6">
        {isLoading && <Spinner text="Fetching system stats" />}
        {isError && (
          <div className="font-mono text-sm text-neon-red">
            ERROR: {error?.response?.data?.message || error.message}
          </div>
        )}

        {data && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
              {cards.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="glow-card rounded-lg p-3 sm:p-5">
                  <div className="mb-2 flex items-center justify-between sm:mb-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 sm:text-[10px]">
                      {label}
                    </span>
                    <Icon size={14} className={color} />
                  </div>
                  <div className={`font-mono text-lg font-bold sm:text-2xl ${color}`}>{value}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <div className="glow-card rounded-lg p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neon-cyan sm:mb-4 sm:text-xs">
                  <Activity size={12} className="sm:hidden" />
                  <Activity size={14} className="hidden sm:inline" />
                  System Status
                </div>
                <div className="space-y-1 font-mono text-[11px] text-gray-400 sm:text-xs">
                  <p>
                    <span className="text-neon-green">$</span> active_keys: {data.activeKeys}
                  </p>
                  <p>
                    <span className="text-neon-green">$</span> campaigns_total: {data.totalCampaigns}
                  </p>
                  <p>
                    <span className="text-neon-green">$</span> quota_pool: {data.quotaRemaining} remaining
                  </p>
                  <p>
                    <span className="text-neon-green">$</span> status:{' '}
                    <span className="text-neon-green">ONLINE</span>
                    <span className="cursor-blink">_</span>
                  </p>
                </div>
              </div>

              <div className="glow-card rounded-lg p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neon-cyan sm:mb-4 sm:text-xs">
                  <BarChart3 size={12} className="sm:hidden" />
                  <BarChart3 size={14} className="hidden sm:inline" />
                  Recent Campaigns
                </div>
                {data.recentCampaigns?.length === 0 ? (
                  <p className="font-mono text-[11px] text-gray-500 sm:text-xs">No campaigns yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {data.recentCampaigns?.map((c) => (
                      <li key={c._id}>
                        <Link
                          to={`/campaigns/${c._id}`}
                          className="flex items-center justify-between gap-2 rounded border border-transparent px-2 py-1.5 transition hover:border-neon-green/20 hover:bg-neon-green/5"
                        >
                          <span className="truncate font-mono text-[11px] text-gray-300 sm:text-xs">{c.name}</span>
                          <Badge color={statusColor[c.status] || 'gray'}>{c.status}</Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
