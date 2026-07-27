import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function CampaignProgress({ progress, onResume, resumeLoading }) {
  if (!progress) return null;

  const pct = progress.percent || 0;
  const isSending = progress.status === 'sending';
  const isPaused = progress.status === 'paused';

  return (
    <div className="glow-card rounded-lg p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {isSending && <Loader2 size={16} className="animate-spin text-neon-cyan" />}
          {progress.status === 'completed' && (
            <CheckCircle2 size={16} className="text-neon-green" />
          )}
          {(progress.status === 'failed' || isPaused) && (
            <XCircle size={16} className="text-neon-red" />
          )}
          <span className="font-mono text-sm text-gray-200">{progress.name}</span>
          <Badge
            color={
              progress.status === 'completed'
                ? 'green'
                : progress.status === 'sending'
                  ? 'cyan'
                  : progress.status === 'paused'
                    ? 'yellow'
                    : 'red'
            }
          >
            {progress.status}
          </Badge>
        </div>
        {isPaused && (
          <Button size="sm" variant="solid" loading={resumeLoading} onClick={onResume}>
            Resume
          </Button>
        )}
      </div>

      <div className="mb-2 flex justify-between font-mono text-xs text-gray-400">
        <span>
          {progress.sentCount + progress.failedCount} / {progress.totalCount}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded bg-terminal-bg">
        <div
          className="h-full bg-neon-green transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-xs">
        <div className="rounded border border-neon-green/20 p-3 text-center">
          <div className="text-lg text-neon-green">{progress.sentCount}</div>
          <div className="text-gray-500">Sent</div>
        </div>
        <div className="rounded border border-neon-red/20 p-3 text-center">
          <div className="text-lg text-neon-red">{progress.failedCount}</div>
          <div className="text-gray-500">Failed</div>
        </div>
        <div className="rounded border border-neon-cyan/20 p-3 text-center">
          <div className="text-lg text-neon-cyan">{progress.pendingCount}</div>
          <div className="text-gray-500">Pending</div>
        </div>
      </div>

      {progress.pauseReason && (
        <p className="mt-3 font-mono text-xs text-yellow-400">{progress.pauseReason}</p>
      )}

      {isSending && (
        <p className="mt-3 font-mono text-xs text-neon-cyan">
          Transmitting<span className="cursor-blink">_</span>
        </p>
      )}
    </div>
  );
}
