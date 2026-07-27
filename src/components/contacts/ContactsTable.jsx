import Badge from '../ui/Badge';

const sourceColor = {
  manual: 'cyan',
  excel: 'green',
  csv: 'green',
  paste: 'yellow',
  screenshot: 'cyan',
};

export default function ContactsTable({
  contacts,
  selectedIds,
  onToggle,
  onToggleAll,
  onDelete,
}) {
  const allSelected =
    contacts.length > 0 && contacts.every((c) => selectedIds.includes(c._id));

  return (
    <div className="overflow-x-auto rounded-lg border border-neon-green/15">
      <table className="w-full min-w-[640px] text-left">
        <thead className="border-b border-neon-green/15 bg-terminal-surface">
          <tr className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onToggleAll(e.target.checked)}
                className="accent-neon-green"
              />
            </th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Tags</th>
            <th className="px-4 py-3">Added</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-neon-green/10">
          {contacts.map((c) => (
            <tr key={c._id} className="hover:bg-neon-green/5">
              <td className="px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c._id)}
                  onChange={() => onToggle(c._id)}
                  className="accent-neon-green"
                />
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-200">{c.email}</td>
              <td className="px-4 py-2.5 text-sm text-gray-400">{c.name || '—'}</td>
              <td className="px-4 py-2.5">
                <Badge color={sourceColor[c.source] || 'gray'}>{c.source}</Badge>
              </td>
              <td className="px-4 py-2.5">
                <div className="flex flex-wrap gap-1">
                  {c.tags?.length
                    ? c.tags.map((t) => (
                        <Badge key={t} color="gray">
                          {t}
                        </Badge>
                      ))
                    : '—'}
                </div>
              </td>
              <td className="px-4 py-2.5 font-mono text-[10px] text-gray-500">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2.5">
                <button
                  onClick={() => onDelete(c._id)}
                  className="font-mono text-[10px] uppercase text-neon-red/70 hover:text-neon-red"
                >
                  Del
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
