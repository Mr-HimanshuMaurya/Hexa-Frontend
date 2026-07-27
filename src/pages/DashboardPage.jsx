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
      <main className="flex-1 overflow-y-auto p-6">
        {isLoading && <Spinner text="Fetching system stats" />}
        {isError && (
          <div className="font-mono text-sm text-neon-red">
            ERROR: {error?.response?.data?.message || error.message}
          </div>
        )}

        {data && (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="glow-card rounded-lg p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                      {label}
                    </span>
                    <Icon size={16} className={color} />
                  </div>
                  <div className={`font-mono text-2xl font-bold ${color}`}>{value}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="glow-card rounded-lg p-5">
                <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-cyan">
                  <Activity size={14} />
                  System Status
                </div>
                <div className="space-y-1 font-mono text-xs text-gray-400">
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

              <div className="glow-card rounded-lg p-5">
                <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-cyan">
                  <BarChart3 size={14} />
                  Recent Campaigns
                </div>
                {data.recentCampaigns?.length === 0 ? (
                  <p className="font-mono text-xs text-gray-500">No campaigns yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {data.recentCampaigns?.map((c) => (
                      <li key={c._id}>
                        <Link
                          to={`/campaigns/${c._id}`}
                          className="flex items-center justify-between rounded border border-transparent px-2 py-1.5 transition hover:border-neon-green/20 hover:bg-neon-green/5"
                        >
                          <span className="truncate font-mono text-xs text-gray-300">{c.name}</span>
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
