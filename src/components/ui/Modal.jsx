import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glow-card w-full ${wide ? 'max-w-4xl' : 'max-w-lg'} max-h-[90vh] overflow-hidden flex flex-col rounded-lg`}
      >
        <div className="flex items-center justify-between border-b border-neon-green/20 px-5 py-4">
          <h2 className="font-mono text-sm uppercase tracking-widest text-neon-green">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-neon-red transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
