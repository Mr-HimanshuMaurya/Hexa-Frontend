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
      <main className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h1 className="font-mono text-base uppercase tracking-widest text-neon-green sm:text-lg">
              Campaigns
            </h1>
            <p className="mt-1 font-mono text-[10px] text-gray-500 sm:text-xs">
              Launch bulk sends with automatic API key rotation
            </p>
          </div>
          <Button variant="solid" onClick={() => setCreateOpen(true)} className="self-start sm:self-auto">
            <Plus size={14} /> New Campaign
          </Button>
        </div>

        {isLoading && <Spinner text="Loading campaigns" />}

        <div className="space-y-2 sm:space-y-3">
          {data?.data?.map((c) => (
            <Link
              key={c._id}
              to={`/campaigns/${c._id}`}
              className="glow-card flex flex-col gap-2 rounded-lg px-4 py-3 transition hover:border-neon-green/40 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-4"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-sm text-gray-200">{c.name}</div>
                <div className="mt-1 font-mono text-[9px] text-gray-500 sm:text-[10px]">
                  {c.templateId?.name || 'Template'} · {c.totalCount} recipients
                </div>
                <div className="font-mono text-[9px] text-gray-500 sm:hidden">
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
                <div className="hidden font-mono text-[10px] text-gray-500 sm:inline">
                  {' '}· {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="font-mono text-[11px] text-neon-green sm:text-xs">
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
          <div className="mt-4 flex justify-center gap-3 sm:mt-6">
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
