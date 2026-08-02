import { Pencil, Trash2, Mail } from 'lucide-react';
import Badge from '../ui/Badge';

export default function TemplateCard({ template, onEdit, onDelete }) {
  return (
    <div className="glow-card group flex flex-col rounded-lg p-3 sm:p-4">
      <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
        <div className="min-w-0">
          <h3 className="truncate font-mono text-sm text-neon-green">{template.name}</h3>
          <p className="mt-1 truncate font-mono text-[11px] text-gray-500 sm:text-xs">{template.subject}</p>
        </div>
        <Mail size={14} className="shrink-0 text-neon-cyan/60 sm:size-16" />
      </div>

      <div className="mb-3 h-20 overflow-hidden rounded border border-neon-green/10 bg-white/95 p-2 text-[8px] leading-tight text-gray-800 sm:mb-4 sm:h-24">
        <div dangerouslySetInnerHTML={{ __html: template.htmlContent?.slice(0, 500) || '' }} />
      </div>

      <div className="mt-auto flex items-center justify-between">
        <Badge color="cyan">
          {new Date(template.updatedAt).toLocaleDateString()}
        </Badge>
        <div className="flex gap-1.5 sm:gap-2 opacity-70 transition group-hover:opacity-100">
          <button
            onClick={() => onEdit(template)}
            className="rounded border border-neon-cyan/30 p-1.5 text-neon-cyan hover:bg-neon-cyan/10"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(template._id)}
            className="rounded border border-neon-red/30 p-1.5 text-neon-red hover:bg-neon-red/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
