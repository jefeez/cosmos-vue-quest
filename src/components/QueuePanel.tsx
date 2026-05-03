import { Clock, X, Building2, Wrench, FlaskConical, Rocket, Shield, Sparkles, Inbox } from "lucide-react";
import { useQueue, queueStore, progressOf, type QueueKind } from "@/lib/build-queue-store";
import { themeMap, themeFor } from "@/lib/card-themes";
import { toast } from "sonner";

const kindMeta: Record<QueueKind, { label: string; icon: any; theme: keyof typeof themeMap }> = {
  building: { label: "Edifício",   icon: Building2,    theme: "metal" },
  facility: { label: "Instalação", icon: Wrench,       theme: "amber" },
  research: { label: "Pesquisa",   icon: FlaskConical, theme: "deuterium" },
  ship:     { label: "Nave",       icon: Rocket,       theme: "crystal" },
  defense:  { label: "Defesa",     icon: Shield,       theme: "destructive" },
};

export function QueuePanel({
  filter,
  title = "Fila de Construção",
  emptyHint = "Nenhum item em fila",
}: {
  filter?: QueueKind | QueueKind[];
  title?: string;
  emptyHint?: string;
}) {
  useQueue();
  const all = queueStore.get();
  const filterSet = filter ? new Set(Array.isArray(filter) ? filter : [filter]) : null;
  const entries = filterSet ? all.filter((e) => filterSet.has(e.kind)) : all;

  // Aggregate stats
  const totalRemaining = entries.reduce((sum, e) => {
    const p = progressOf(e);
    const [h, m, s] = p.remaining.split(":").map(Number);
    return sum + h * 3600 + m * 60 + s;
  }, 0);
  const fmtTotal = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${String(m).padStart(2, "0")}m`;
  };

  return (
    <div className="panel rounded-lg overflow-hidden relative">
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-accent/40 to-transparent" />

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-xs uppercase tracking-widest text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-primary" />
            </div>
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                ETA {fmtTotal(totalRemaining)}
              </span>
            )}
            <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/30 tabular-nums">
              {entries.length}
            </span>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-surface-elevated/50 border border-border flex items-center justify-center">
              <Inbox className="w-4 h-4 text-muted-foreground/60" />
            </div>
            <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
              {emptyHint}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((e) => {
              const p = progressOf(e);
              const meta = kindMeta[e.kind];
              const t = themeMap[themeFor(e.itemId) || meta.theme];
              const Icon = meta.icon;

              return (
                <div
                  key={e.id}
                  className={`group relative rounded-md p-2.5 border bg-surface-elevated/40 ${t.border} hover:bg-surface-elevated/60 transition-colors overflow-hidden`}
                >
                  {/* themed left strip */}
                  <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${t.dot}`} />

                  <div className="flex items-center justify-between mb-1.5 gap-2 pl-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-7 h-7 rounded-md ${t.dot} flex items-center justify-center shrink-0 shadow-md ${t.glow}`}>
                        <Icon className="w-3.5 h-3.5 text-background" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-mono uppercase tracking-widest ${t.text}`}>
                            {meta.label}
                          </span>
                          {p.pct > 95 && (
                            <span className="text-[8px] font-mono uppercase tracking-widest text-deuterium flex items-center gap-0.5">
                              <Sparkles className="w-2 h-2" /> quase
                            </span>
                          )}
                        </div>
                        <div className="font-display text-xs uppercase tracking-wider truncate text-foreground">
                          {e.name}
                          {e.level && <span className={`${t.text} ml-1`}>→ Lv {e.level}</span>}
                          {e.qty && <span className={`${t.text} ml-1`}>×{e.qty}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-xs tabular-nums text-foreground">{p.remaining}</span>
                      <button
                        onClick={() => { queueStore.cancel(e.id); toast.message("Item cancelado"); }}
                        className="w-5 h-5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors"
                        title="Cancelar"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="h-1.5 bg-background/60 rounded-full overflow-hidden pl-1.5 ml-1.5">
                    <div className={`h-full ${t.dot} shimmer relative`} style={{ width: `${p.pct}%` }} />
                  </div>
                  <div className="flex justify-between mt-1 pl-1.5">
                    <span className="text-[9px] font-mono text-muted-foreground tabular-nums">
                      {p.pct.toFixed(0)}%
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground tabular-nums">
                      {p.pct >= 100 ? "Concluído" : "em progresso"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
