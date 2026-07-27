const styles = {
  green: 'border-neon-green/40 text-neon-green bg-neon-green/10',
  cyan: 'border-neon-cyan/40 text-neon-cyan bg-neon-cyan/10',
  red: 'border-neon-red/40 text-neon-red bg-neon-red/10',
  gray: 'border-gray-500/40 text-gray-400 bg-gray-500/10',
  yellow: 'border-yellow-400/40 text-yellow-400 bg-yellow-400/10',
};

export default function Badge({ children, color = 'green', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${styles[color] || styles.green} ${className}`}
    >
      {children}
    </span>
  );
}
