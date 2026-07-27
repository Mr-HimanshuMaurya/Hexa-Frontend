import { useState } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useCampaignLogs } from '../../api/campaigns';
import Spinner from '../ui/Spinner';

export default function CampaignLogs({ campaignId }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const { data, isLoading } = useCampaignLogs(campaignId, page, status);

  const downloadCsv = () => {
    const rows = data?.data || [];
    const header = 'email,status,apiKey,error,sentAt\n';
    const body = rows
      .map(
        (r) =>
          `"${r.contactEmail}","${r.status}","${r.apiKeyUsed || ''}","${(r.errorMessage || '').replace(/"/g, '""')}","${r.sentAt || ''}"`
      )
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${campaignId}-logs.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glow-card rounded-lg p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-mono text-xs uppercase tracking-widest text-neon-cyan">Send Logs</h3>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded border border-neon-green/20 bg-terminal-bg px-2 py-1 font-mono text-xs text-gray-300 outline-none"
          >
            <option value="">All</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
          <Button size="sm" variant="ghost" onClick={downloadCsv} disabled={!data?.data?.length}>
            Download CSV
          </Button>
        </div>
      </div>

      {isLoading && <Spinner text="Loading logs" />}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead className="border-b border-neon-green/15 font-mono text-[10px] uppercase tracking-widest text-gray-500">
            <tr>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Key</th>
              <th className="px-2 py-2">Error</th>
              <th className="px-2 py-2">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neon-green/10">
            {data?.data?.map((log) => (
              <tr key={log._id} className="hover:bg-neon-green/5">
                <td className="px-2 py-2 font-mono text-xs text-gray-300">{log.contactEmail}</td>
                <td className="px-2 py-2">
                  <Badge
                    color={
                      log.status === 'sent' ? 'green' : log.status === 'failed' ? 'red' : 'yellow'
                    }
                  >
                    {log.status}
                  </Badge>
                </td>
                <td className="px-2 py-2 font-mono text-[10px] text-gray-500">
                  {log.apiKeyUsed || '—'}
                </td>
                <td className="max-w-[200px] truncate px-2 py-2 text-xs text-neon-red/80">
                  {log.errorMessage || '—'}
                </td>
                <td className="px-2 py-2 font-mono text-[10px] text-gray-500">
                  {log.sentAt ? new Date(log.sentAt).toLocaleString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.pagination?.pages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
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
    </div>
  );
}
