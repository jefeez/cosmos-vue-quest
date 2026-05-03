import type { BuildItem } from "@/lib/game-data";
import { Clock, X, Zap, AlertTriangle, ArrowUp } from "lucide-react";
import { useQueue, queueStore, progressOf, type QueueKind } from "@/lib/build-queue-store";
import { useResources } from "@/lib/resources-store";
import { themeFor, themeMap } from "@/lib/card-themes";
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
  const t = themeMap[themeFor(item.id)];

  const active = queueStore.activeFor(kind, item.id);
  const progress = active ? progressOf(active) : null;

  const cost = item.cost;
  const lacking = {
    metal: resources.metal < cost.metal,
    crystal: resources.crystal < cost.crystal,
    deuterium: !!cost.deuterium && resources.deuterium < cost.deuterium,
  };
  const canAfford = !lacking.metal && !lacking.crystal && !lacking.deuterium;

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
    <div className={`group relative panel rounded-lg overflow-hidden transition-all hover:-translate-y-0.5 ${t.border} ${progress ? `ring-1 ring-${t.text.replace("text-", "")}/30 shadow-lg ${t.glow}` : ""}`}>
      {/* themed top accent */}
      <div className={`h-1 w-full bg-gradient-to-r ${t.ring}`} />

      {/* themed glow orb */}
      <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-radial ${t.ring} opacity-40 blur-2xl pointer-events-none`} />

      <div className="p-4 relative">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative shrink-0">
            <div className={`w-12 h-12 rounded-full ${t.dot} flex items-center justify-center shadow-lg ${t.glow}`}>
              <Icon className="w-6 h-6 text-background" strokeWidth={1.8} />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-background border border-border text-foreground text-[10px] font-mono font-bold px-1.5 h-5 min-w-[28px] rounded flex items-center justify-center">
              Lv {item.level}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-sm font-bold tracking-wider uppercase truncate">{item.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-snug">{item.description}</p>
            {item.production && (
              <div className={`text-[10px] font-mono ${t.text} mt-1 uppercase tracking-wider flex items-center gap-1`}>
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
              <span className={`${t.text} flex items-center gap-1`}>
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
              <div className={`h-full ${t.dot} shimmer`} style={{ width: `${progress.pct}%` }} />
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
              className={`px-3.5 h-9 font-display tracking-wider uppercase text-[11px] rounded transition-all flex items-center gap-1.5 ${
                canAfford
                  ? `${t.dot} text-background hover:opacity-90 shadow-md ${t.glow}`
                  : "bg-surface-elevated text-muted-foreground cursor-not-allowed border border-border"
              }`}
            >
              {!canAfford && <AlertTriangle className="w-3 h-3" />}
              {canAfford && <ArrowUp className="w-3 h-3" />}
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
