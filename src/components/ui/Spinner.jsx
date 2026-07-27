export default function Spinner({ text = 'Establishing connection' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 font-mono text-sm text-neon-green">
      <div className="flex items-center gap-1">
        <span>{text}</span>
        <span className="cursor-blink">_</span>
      </div>
      <div className="h-0.5 w-48 overflow-hidden rounded bg-neon-green/10">
        <div className="h-full w-1/3 animate-pulse bg-neon-green/60" />
      </div>
    </div>
  );
}
