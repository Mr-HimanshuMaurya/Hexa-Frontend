import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative glow-card w-full ${wide ? "sm:max-w-4xl" : "sm:max-w-lg"} max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col rounded-t-lg sm:rounded-lg`}
      >
        <div className="flex items-center justify-between border-b border-neon-green/20 px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="truncate font-mono text-sm uppercase tracking-widest text-neon-green">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-neon-red transition-colors shrink-0 ml-2"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}
