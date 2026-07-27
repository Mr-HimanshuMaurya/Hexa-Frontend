export default function ImportPreviewList({ items, selected, onToggle, onToggleAll }) {
  if (!items?.length) {
    return (
      <p className="font-mono text-xs text-gray-500 py-4">
        No emails extracted yet.
      </p>
    );
  }

  const allSelected = items.length > 0 && selected.length === items.length;

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <label className="flex items-center gap-2 font-mono text-xs text-gray-400">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => onToggleAll(e.target.checked)}
            className="accent-neon-green"
          />
          Select all ({items.length})
        </label>
        <span className="font-mono text-[10px] text-neon-cyan">
          {selected.length} selected
        </span>
      </div>
      <ul className="max-h-56 overflow-y-auto rounded border border-neon-green/15 divide-y divide-neon-green/10">
        {items.map(({ email, alreadyExists }) => (
          <li
            key={email}
            className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-neon-green/5"
          >
            <label className="flex min-w-0 flex-1 items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(email)}
                onChange={() => onToggle(email)}
                className="accent-neon-green"
              />
              <span className="truncate font-mono text-xs text-gray-300">{email}</span>
            </label>
            {alreadyExists && (
              <span className="shrink-0 font-mono text-[10px] text-yellow-400">exists</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
