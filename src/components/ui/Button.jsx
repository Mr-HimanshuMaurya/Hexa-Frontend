export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-mono uppercase tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-1';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-sm',
  };

  const variants = {
    primary:
      'border border-neon-green/60 text-neon-green hover:bg-neon-green/10 hover:shadow-[0_0_15px_rgba(0,255,157,0.3)] focus:ring-neon-green/50',
    secondary:
      'border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] focus:ring-neon-cyan/50',
    danger:
      'border border-neon-red/60 text-neon-red hover:bg-neon-red/10 hover:shadow-[0_0_15px_rgba(255,56,96,0.3)] focus:ring-neon-red/50',
    ghost:
      'border border-transparent text-gray-400 hover:text-neon-green hover:border-neon-green/30',
    solid:
      'bg-neon-green/15 border border-neon-green text-neon-green hover:bg-neon-green/25 shadow-[0_0_12px_rgba(0,255,157,0.2)]',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="cursor-blink">_</span>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
