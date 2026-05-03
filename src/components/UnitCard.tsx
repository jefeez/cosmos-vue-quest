import type { UnitItem } from "@/lib/game-data";
import { useState } from "react";
import { Swords, Shield, Gauge, Plus, Minus, AlertTriangle, Clock, Hammer } from "lucide-react";
import { useQueue, queueStore, progressOf, type QueueKind } from "@/lib/build-queue-store";
import { useResources } from "@/lib/resources-store";
import { themeFor, themeMap } from "@/lib/card-themes";
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

  const active = queueStore.activeFor(kind, item.id);
  const progress = active ? progressOf(active) : null;

  const totalCost = {
    metal: item.cost.metal * qty,
    crystal: item.cost.crystal * qty,
    deuterium: (item.cost.deuterium ?? 0) * qty,
  };
  const canAfford = qty > 0
    && resources.metal >= totalCost.metal
    && resources.crystal >= totalCost.crystal
    && resources.deuterium >= totalCost.deuterium;

  const max = Math.min(
    Math.floor(resources.metal / item.cost.metal),
    Math.floor(resources.crystal / Math.max(1, item.cost.crystal)),
    item.cost.deuterium ? Math.floor(resources.deuterium / item.cost.deuterium) : Infinity,
  );

  const handleBuild = () => {
    const r = queueStore.startBuild({
      kind,
      itemId: item.id,
      name: item.name,
      qty,
      timeStr: `0h ${Math.max(1, qty * 2)}m`,
      cost: totalCost,
    });
    if (!r.ok) toast.error(r.reason);
    else { toast.success(`${qty}× ${item.name} em produção`); setQty(0); }
  };

  return (
    <div className={`group relative panel rounded-lg overflow-hidden transition-all hover:-translate-y-0.5 ${t.border} ${progress ? `shadow-lg ${t.glow}` : ""}`}>
      {/* themed top accent */}
      <div className={`h-1 w-full bg-gradient-to-r ${t.ring}`} />

      {/* themed glow orb */}
      <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-radial ${t.ring} opacity-40 blur-2xl pointer-events-none`} />

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

        <div className="flex items-center justify-between gap-2 mb-2.5 text-[10px] font-mono pb-2.5 border-b border-border/60">
          <span className="text-muted-foreground uppercase tracking-wider">Custo unit.</span>
          <div className="flex gap-2">
            <span className="text-metal">M:{fmt(item.cost.metal)}</span>
            <span className="text-crystal">C:{fmt(item.cost.crystal)}</span>
            {item.cost.deuterium ? <span className="text-deuterium">D:{fmt(item.cost.deuterium)}</span> : null}
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
          <div className="flex gap-1.5">
            <button
              onClick={() => setQty(Math.max(0, qty - 10))}
              className="px-2 bg-surface-elevated border border-border rounded text-muted-foreground hover:text-foreground"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              min={0}
              value={qty || ""}
              onChange={(e) => setQty(Math.max(0, +e.target.value))}
              placeholder="Qtd"
              className="flex-1 bg-surface-elevated border border-border rounded px-2 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-center tabular-nums"
            />
            <button
              onClick={() => setQty(Math.max(0, qty + 10))}
              className="px-2 bg-surface-elevated border border-border rounded text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={() => setQty(Number.isFinite(max) ? max : 0)}
              className="px-2 bg-surface-elevated border border-border rounded text-[10px] font-display uppercase text-muted-foreground hover:text-foreground"
            >
              Max
            </button>
            <button
              onClick={handleBuild}
              disabled={!canAfford}
              className={`px-3 h-8 font-display font-semibold uppercase tracking-wider text-[11px] rounded transition-all flex items-center gap-1 ${
                canAfford
                  ? `${t.dot} text-background hover:opacity-90 shadow-md ${t.glow}`
                  : "bg-surface-elevated text-muted-foreground cursor-not-allowed border border-border"
              }`}
            >
              {!canAfford && qty > 0 && <AlertTriangle className="w-3 h-3" />}
              {canAfford && <Hammer className="w-3 h-3" />}
              Construir
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
