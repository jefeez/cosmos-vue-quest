import type { UnitItem } from "@/lib/game-data";
import { useEffect, useState } from "react";
import { Swords, Shield, Gauge, Plus, Minus, AlertTriangle, Clock, Hammer, Lock, Zap, GitBranch } from "lucide-react";
import { useQueue, queueStore, progressOf, type QueueKind } from "@/lib/build-queue-store";
import { useResources } from "@/lib/resources-store";
import { themeFor, themeMap } from "@/lib/card-themes";
import { RequirementsDialog } from "@/components/RequirementsDialog";
import { toast } from "sonner";

const fmt = (n: number) => n.toLocaleString("pt-BR");

interface Props {
  item: UnitItem;
  kind?: QueueKind; // "ship" | "defense"
}

export function UnitCard({ item, kind = "ship" }: Props) {
  const Icon = item.icon;
  const [qty, setQty] = useState(0);
  useQueue();
  const resources = useResources();
  const t = themeMap[themeFor(item.id)];
  const locked = !!item.locked;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const active = mounted ? queueStore.activeFor(kind, item.id) : null;
  const progress = active ? progressOf(active) : null;

  const totalCost = {
    metal: item.cost.metal * qty,
    crystal: item.cost.crystal * qty,
    deuterium: (item.cost.deuterium ?? 0) * qty,
  };
  const canAfford = !locked && qty > 0
    && resources.metal >= totalCost.metal
    && resources.crystal >= totalCost.crystal
    && resources.deuterium >= totalCost.deuterium;

  const max = Math.min(
    Math.floor(resources.metal / item.cost.metal),
    Math.floor(resources.crystal / Math.max(1, item.cost.crystal)),
    item.cost.deuterium ? Math.floor(resources.deuterium / item.cost.deuterium) : Infinity,
  );

  const handleBuild = () => {
    if (locked) return;
    const r = queueStore.startBuild({
      kind, itemId: item.id, name: item.name, qty,
      timeStr: `0h ${Math.max(1, qty * 2)}m`, cost: totalCost,
    });
    if (!r.ok) toast.error(r.reason);
    else { toast.success(`${qty}× ${item.name} em produção`); setQty(0); }
  };

  return (
    <div className={`group relative panel shine rise-in rounded-xl overflow-hidden transition-all hover:-translate-y-1 ${t.border} ${progress ? `shadow-xl ${t.glow}` : ""} ${locked ? "opacity-95" : ""}`}>
      <div className={`h-[2px] w-full bg-gradient-to-r ${t.ring}`} />
      <div className={`absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gradient-radial ${t.ring} opacity-50 blur-3xl pointer-events-none group-hover:opacity-80 transition-opacity duration-500`} />

      {locked && (
        <div className="absolute inset-0 z-10 bg-background/55 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-surface-elevated border border-border flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <span className="font-display text-[10px] uppercase tracking-widest">Bloqueado</span>
          </div>
        </div>
      )}

      <div className="p-4 relative">
        <div className="flex items-start gap-3 mb-3">
          <div className={`relative w-12 h-12 rounded-full ${t.dot} flex items-center justify-center shrink-0 shadow-lg ${t.glow}`}>
            <Icon className="w-6 h-6 text-background" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-sm font-bold tracking-wider uppercase truncate">{item.name}</h3>
              <span className={`font-mono text-lg font-bold ${t.text} tabular-nums leading-none`}>{fmt(item.count)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <Stat icon={Swords} label="ATK" value={fmt(item.attack)} />
          <Stat icon={Shield} label="ESC" value={fmt(item.shield)} />
          <Stat icon={Gauge} label="VEL" value={item.speed ? fmt(item.speed) : "—"} />
        </div>

        {/* Rapid Fire */}
        {item.rapidFire && item.rapidFire.length > 0 && (
          <div className="mb-3 px-2 py-1.5 rounded bg-surface-elevated/60 border border-border/50">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              <Zap className={`w-3 h-3 ${t.text}`} /> Tiro Rápido
            </div>
            <div className="flex flex-wrap gap-1">
              {item.rapidFire.map((rf, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/40 border border-border/40 text-[10px] font-mono">
                  <span className={`${t.text} font-bold tabular-nums`}>×{rf.ratio}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="text-foreground/90">{rf.against}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-2.5 text-[10px] font-mono pb-2.5 border-b border-border/60">
          <span className="text-muted-foreground uppercase tracking-wider">Custo unit.</span>
          <div className="flex items-center gap-2">
            <span className="text-metal">M:{fmt(item.cost.metal)}</span>
            <span className="text-crystal">C:{fmt(item.cost.crystal)}</span>
            {item.cost.deuterium ? <span className="text-deuterium">D:{fmt(item.cost.deuterium)}</span> : null}
            {item.requirements && (
              <RequirementsDialog
                itemName={item.name}
                requirements={item.requirements}
                themeText={t.text}
                trigger={
                  <button className={`relative z-20 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border hover:border-foreground/40 transition ${locked ? "text-destructive" : "text-muted-foreground"}`}>
                    <GitBranch className="w-2.5 h-2.5" />
                    <span className="uppercase tracking-wider">Req.</span>
                  </button>
                }
              />
            )}
          </div>
        </div>

        {progress ? (
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1.5">
              <span className={`${t.text} flex items-center gap-1`}>
                <Clock className="w-3 h-3" /> {active!.qty}× em produção
              </span>
              <span className="text-foreground tabular-nums">{progress.remaining}</span>
            </div>
            <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
              <div className={`h-full ${t.dot} shimmer`} style={{ width: `${progress.pct}%` }} />
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              <button
                onClick={() => setQty(Math.max(0, qty - 10))}
                disabled={locked}
                className="px-2 bg-surface-elevated border border-border rounded text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <Minus className="w-3 h-3" />
              </button>
              <input
                type="number"
                min={0}
                disabled={locked}
                value={qty || ""}
                onChange={(e) => setQty(Math.max(0, +e.target.value))}
                placeholder="Qtd"
                className="flex-1 min-w-0 bg-surface-elevated border border-border rounded px-2 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-center tabular-nums disabled:opacity-50"
              />
              <button
                onClick={() => setQty(Math.max(0, qty + 10))}
                disabled={locked}
                className="px-2 bg-surface-elevated border border-border rounded text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                onClick={() => setQty(Number.isFinite(max) ? max : 0)}
                disabled={locked}
                className="px-2 bg-surface-elevated border border-border rounded text-[10px] font-display uppercase text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                Max
              </button>
            </div>
            <button
              onClick={handleBuild}
              disabled={!canAfford}
              className={`w-full px-3 h-9 font-display font-semibold uppercase tracking-wider text-[11px] rounded transition-all flex items-center justify-center gap-1.5 ${
                canAfford
                  ? `${t.dot} text-background hover:opacity-90 shadow-md ${t.glow}`
                  : "bg-surface-elevated text-muted-foreground cursor-not-allowed border border-border"
              }`}
            >
              {locked && <Lock className="w-3 h-3" />}
              {!locked && !canAfford && qty > 0 && <AlertTriangle className="w-3 h-3" />}
              {!locked && canAfford && <Hammer className="w-3 h-3" />}
              {locked ? "Bloqueado" : "Construir"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-surface-elevated/50 rounded-md px-2 py-1.5 border border-border/50">
      <div className="flex items-center gap-1 text-[9px] font-mono uppercase text-muted-foreground tracking-wider">
        <Icon className="w-2.5 h-2.5" />
        {label}
      </div>
      <div className="text-xs font-mono font-bold tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
