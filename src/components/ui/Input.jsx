export default function Input({
  label,
  error,
  className = "",
  as: Component = "input",
  rightIcon,
  onRightIconClick,
  ...props
}) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="font-mono text-xs uppercase tracking-wider text-neon-cyan/80">
          {label}
        </span>
      )}

      <div className="relative">
        <Component
          className={`w-full rounded border border-neon-green/20 bg-terminal-bg px-3 py-2.5 ${
            rightIcon ? "pr-10" : ""
          } font-mono text-sm text-gray-100 placeholder:text-gray-600 outline-none transition focus:border-neon-green/60 focus:shadow-[0_0_12px_rgba(0,255,157,0.15)] ${
            error ? "border-neon-red/60" : ""
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-neon-green"
          >
            {rightIcon}
          </button>
        )}
      </div>

      {error && (
        <span className="block font-mono text-xs text-neon-red">{error}</span>
      )}
    </label>
  );
}
