import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon, title, subtitle, code,
}: { icon: LucideIcon; title: string; subtitle: string; code: string }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 pb-4 border-b border-border/70 rise-in relative">
      {/* subtle nebula glow */}
      <div className="absolute -top-8 left-12 w-72 h-24 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -top-8 left-1/2 w-72 h-24 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <div className="absolute inset-0 rounded-lg bg-primary/30 blur-lg opacity-70 orbit-glow" />
          <div className="relative w-12 h-12 rounded-lg bg-surface border border-primary/40 flex items-center justify-center backdrop-blur shadow-[inset_0_0_18px_-6px_var(--primary)]">
            <Icon className="w-6 h-6 text-primary" strokeWidth={1.6} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wider uppercase text-gradient">
            {title}
          </h1>
          <p className="text-[10px] md:text-xs text-muted-foreground font-mono uppercase tracking-[0.25em] mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 px-3 h-9 bg-surface/70 backdrop-blur border border-border rounded-md font-mono text-xs shadow-[inset_0_0_12px_-6px_var(--accent)]">
        <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-glow" />
        <span className="text-muted-foreground uppercase tracking-wider">Setor</span>
        <span className="text-foreground tabular-nums">{code}</span>
      </div>
    </div>
  );
}
