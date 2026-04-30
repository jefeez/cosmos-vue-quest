import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon, title, subtitle, code,
}: { icon: LucideIcon; title: string; subtitle: string; code: string }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 pb-4 border-b border-border">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-surface border border-border flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" strokeWidth={1.6} />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-wider uppercase">{title}</h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded font-mono text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-glow" />
        <span className="text-muted-foreground uppercase tracking-wider">Setor</span>
        <span className="text-foreground">{code}</span>
      </div>
    </div>
  );
}
