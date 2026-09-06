import { EmailStatus } from "@/types";

const STYLES: Record<EmailStatus, string> = {
  scheduled: "bg-amber-500/10 text-amber-400 ring-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
  sent: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
  failed: "bg-red-500/10 text-red-400 ring-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
};

const DOT_STYLES: Record<EmailStatus, string> = {
  scheduled: "bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.8)] animate-pulse",
  sent: "bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.8)]",
  failed: "bg-red-400 shadow-[0_0_5px_rgba(239,68,68,0.8)]",
};

export function StatusBadge({ status }: { status: EmailStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[status]}`} />
      {status}
    </span>
  );
}
