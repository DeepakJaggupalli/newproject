import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  accent: "brand" | "amber" | "emerald" | "red";
}

const ACCENT_CLASSES: Record<StatCardProps["accent"], string> = {
  brand: "bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-[0_0_15px_rgba(124,58,237,0.15)]",
  amber: "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
  emerald: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
  red: "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
};

export function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className="group flex items-center gap-5 rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md px-6 py-5 shadow-glass transition-all hover:bg-zinc-900/60 hover:scale-[1.02]">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all group-hover:scale-110 ${ACCENT_CLASSES[accent]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-3xl font-bold tabular-nums text-white tracking-tight">{value.toLocaleString()}</div>
        <div className="truncate text-sm font-medium text-zinc-400 mt-0.5">{label}</div>
      </div>
    </div>
  );
}
