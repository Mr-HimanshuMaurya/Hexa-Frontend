import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import CampaignCreate from '../components/campaigns/CampaignCreate';
import { useCampaigns } from '../api/campaigns';

const statusColor = {
  sending: 'cyan',
  completed: 'green',
  failed: 'red',
  paused: 'yellow',
  draft: 'gray',
};

export default function CampaignsPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading } = useCampaigns(page);

  return (
    <>
      <Topbar title="campaigns" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-mono text-lg uppercase tracking-widest text-neon-green">
              Campaigns
            </h1>
            <p className="mt-1 font-mono text-xs text-gray-500">
              Launch bulk sends with automatic API key rotation
            </p>
          </div>
          <Button variant="solid" onClick={() => setCreateOpen(true)}>
            <Plus size={14} /> New Campaign
          </Button>
        </div>

        {isLoading && <Spinner text="Loading campaigns" />}

        <div className="space-y-3">
          {data?.data?.map((c) => (
            <Link
              key={c._id}
              to={`/campaigns/${c._id}`}
              className="glow-card flex flex-wrap items-center justify-between gap-3 rounded-lg px-5 py-4 transition hover:border-neon-green/40"
            >
              <div>
                <div className="font-mono text-sm text-gray-200">{c.name}</div>
                <div className="mt-1 font-mono text-[10px] text-gray-500">
                  {c.templateId?.name || 'Template'} · {c.totalCount} recipients ·{' '}
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-neon-green">
                  {c.sentCount}/{c.totalCount}
                </span>
                <Badge color={statusColor[c.status] || 'gray'}>{c.status}</Badge>
              </div>
            </Link>
          ))}
        </div>

        {data?.data?.length === 0 && !isLoading && (
          <p className="font-mono text-sm text-gray-500">No campaigns yet.</p>
        )}

        {data?.pagination?.pages > 1 && (
          <div className="mt-6 flex justify-center gap-3">
            <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </Button>
            <span className="font-mono text-xs text-gray-400">
              {page} / {data.pagination.pages}
            </span>
            <Button
              size="sm"
              variant="ghost"
              disabled={page >= data.pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </main>

      <CampaignCreate open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
