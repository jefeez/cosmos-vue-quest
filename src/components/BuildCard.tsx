import type { BuildItem } from "@/lib/game-data";
import { Clock } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("pt-BR");

const CostPill = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex items-center gap-1.5">
    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `var(${color})` }} />
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    <span className="font-mono text-xs tabular-nums text-foreground">{fmt(value)}</span>
  </div>
);

export function BuildCard({ item, actionLabel = "Melhorar" }: { item: BuildItem; actionLabel?: string }) {
  const Icon = item.icon;
  const isBuilding = !!item.building;

  return (
    <div className="panel panel-glow rounded-md p-4 transition-all relative overflow-hidden group">
      {/* corner accent */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-primary/10 to-transparent" />

      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded bg-surface-elevated border border-border flex items-center justify-center shrink-0 relative">
          <Icon className="w-6 h-6 text-primary" strokeWidth={1.8} />
          <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-mono font-bold w-6 h-5 rounded flex items-center justify-center border border-background">
            {item.level}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase truncate">{item.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
        </div>
      </div>

      {item.production && (
        <div className="text-[10px] font-mono text-accent mb-2 uppercase tracking-wider">⚙ {item.production}</div>
      )}

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3 pb-3 border-b border-border/60">
        <CostPill label="Metal" value={item.cost.metal} color="--metal" />
        <CostPill label="Cristal" value={item.cost.crystal} color="--crystal" />
        {item.cost.deuterium ? <CostPill label="Deut" value={item.cost.deuterium} color="--deuterium" /> : null}
      </div>

      {isBuilding ? (
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1.5">
            <span className="text-accent flex items-center gap-1"><Clock className="w-3 h-3" /> Construindo</span>
            <span className="text-foreground tabular-nums">{item.building!.remaining}</span>
          </div>
          <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent shimmer relative"
              style={{ width: `${item.building!.progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="tabular-nums">{item.buildTime}</span>
          </div>
          <button className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-display font-semibold uppercase tracking-wider rounded transition-all hover:shadow-[0_0_16px_-4px_var(--primary)]">
            {actionLabel} →
          </button>
        </div>
      )}
    </div>
  );
}
