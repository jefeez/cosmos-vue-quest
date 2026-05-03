import type { BuildItem } from "@/lib/game-data";
import { Clock, X, Zap, AlertTriangle } from "lucide-react";
import { useQueue, queueStore, progressOf, type QueueKind } from "@/lib/build-queue-store";
import { useResources } from "@/lib/resources-store";
import { toast } from "sonner";

const fmt = (n: number) => n.toLocaleString("pt-BR");

const CostPill = ({ label, value, color, lacks }: { label: string; value: number; color: string; lacks?: boolean }) => (
  <div className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded ${lacks ? "bg-destructive/15" : ""}`}>
    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `var(${color})`, boxShadow: `0 0 6px var(${color})` }} />
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    <span className={`font-mono text-xs tabular-nums ${lacks ? "text-destructive" : "text-foreground"}`}>{fmt(value)}</span>
  </div>
);

interface Props {
  item: BuildItem;
  kind?: QueueKind;
  actionLabel?: string;
}

export function BuildCard({ item, kind = "building", actionLabel = "Melhorar" }: Props) {
  const Icon = item.icon;
  useQueue();
  const resources = useResources();

  // active queue entry for this item
  const active = queueStore.activeFor(kind, item.id);
  const progress = active ? progressOf(active) : null;

  const cost = item.cost;
  const lacking = {
    metal: resources.metal < cost.metal,
    crystal: resources.crystal < cost.crystal,
    deuterium: !!cost.deuterium && resources.deuterium < cost.deuterium,
  };
  const canAfford = !lacking.metal && !lacking.crystal && !lacking.deuterium;
  const blocked = !!active;

  const handleBuild = () => {
    const r = queueStore.startBuild({
      kind,
      itemId: item.id,
      name: item.name,
      level: item.level + 1,
      timeStr: item.buildTime,
      cost,
    });
    if (!r.ok) toast.error(r.reason);
    else toast.success(`${item.name} → Lv ${item.level + 1} iniciado`);
  };

  const handleCancel = () => {
    if (!active) return;
    queueStore.cancel(active.id);
    toast.message("Construção cancelada");
  };

  return (
    <div className={`panel rounded-md transition-all relative overflow-hidden group ${blocked ? "" : "panel-glow"}`}>
      {/* level ribbon */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-accent/40" />

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded bg-surface-elevated border border-border flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <Icon className="w-7 h-7 text-primary relative z-10" strokeWidth={1.6} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-background border border-primary/60 text-primary text-[10px] font-mono font-bold px-1.5 h-5 min-w-[24px] rounded flex items-center justify-center">
              Lv {item.level}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-sm font-semibold tracking-wider text-foreground uppercase truncate">{item.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-snug">{item.description}</p>
            {item.production && (
              <div className="text-[10px] font-mono text-accent mt-1 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> {item.production}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-1 gap-y-1 mb-3 pb-3 border-b border-border/60">
          <CostPill label="Metal" value={cost.metal} color="--metal" lacks={lacking.metal} />
          <CostPill label="Cristal" value={cost.crystal} color="--crystal" lacks={lacking.crystal} />
          {cost.deuterium ? <CostPill label="Deut" value={cost.deuterium} color="--deuterium" lacks={lacking.deuterium} /> : null}
        </div>

        {progress ? (
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1.5">
              <span className="text-accent flex items-center gap-1">
                <Clock className="w-3 h-3" /> Lv {item.level} → {(active!.level ?? item.level + 1)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-foreground tabular-nums">{progress.remaining}</span>
                <button onClick={handleCancel} className="text-destructive hover:text-destructive/80" title="Cancelar">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-primary to-accent shimmer" style={{ width: `${progress.pct}%` }} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="tabular-nums">{item.buildTime}</span>
            </div>
            <button
              disabled={!canAfford}
              onClick={handleBuild}
              className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 disabled:bg-surface-elevated disabled:text-muted-foreground disabled:cursor-not-allowed text-primary-foreground text-xs font-display font-semibold uppercase tracking-wider rounded transition-all hover:shadow-[0_0_16px_-4px_var(--primary)] flex items-center gap-1"
            >
              {!canAfford && <AlertTriangle className="w-3 h-3" />}
              {actionLabel} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
