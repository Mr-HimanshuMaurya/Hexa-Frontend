import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function CampaignProgress({ progress, onResume, resumeLoading }) {
  if (!progress) return null;

  const pct = progress.percent || 0;
  const isSending = progress.status === 'sending';
  const isPaused = progress.status === 'paused';

  return (
    <div className="glow-card rounded-lg p-4 sm:p-5">
      <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {isSending && <Loader2 size={14} className="animate-spin text-neon-cyan sm:size-16" />}
          {progress.status === 'completed' && (
            <CheckCircle2 size={14} className="text-neon-green sm:size-16" />
          )}
          {(progress.status === 'failed' || isPaused) && (
            <XCircle size={14} className="text-neon-red sm:size-16" />
          )}
          <span className="truncate font-mono text-sm text-gray-200">{progress.name}</span>
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
          <Button size="sm" variant="solid" loading={resumeLoading} onClick={onResume} className="self-start sm:self-auto">
            Resume
          </Button>
        )}
      </div>

      <div className="mb-2 flex justify-between font-mono text-[11px] text-gray-400 sm:text-xs">
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

      <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px] sm:gap-3 sm:text-xs">
        <div className="rounded border border-neon-green/20 p-2 text-center sm:p-3">
          <div className="text-base text-neon-green sm:text-lg">{progress.sentCount}</div>
          <div className="text-gray-500">Sent</div>
        </div>
        <div className="rounded border border-neon-red/20 p-2 text-center sm:p-3">
          <div className="text-base text-neon-red sm:text-lg">{progress.failedCount}</div>
          <div className="text-gray-500">Failed</div>
        </div>
        <div className="rounded border border-neon-cyan/20 p-2 text-center sm:p-3">
          <div className="text-base text-neon-cyan sm:text-lg">{progress.pendingCount}</div>
          <div className="text-gray-500">Pending</div>
        </div>
      </div>

      {progress.pauseReason && (
        <p className="mt-3 font-mono text-[11px] text-yellow-400 sm:text-xs">{progress.pauseReason}</p>
      )}

      {isSending && (
        <p className="mt-3 font-mono text-[11px] text-neon-cyan sm:text-xs">
          Transmitting<span className="cursor-blink">_</span>
        </p>
      )}
    </div>
  );
}
