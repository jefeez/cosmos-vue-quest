import { Clock, X } from "lucide-react";
import { useQueue, queueStore, progressOf, type QueueKind } from "@/lib/build-queue-store";
import { toast } from "sonner";

const kindLabel: Record<QueueKind, string> = {
  building: "Edifício",
  facility: "Instalação",
  research: "Pesquisa",
  ship: "Nave",
  defense: "Defesa",
};

export function QueuePanel({ filter, title = "Fila de Construção" }: { filter?: QueueKind | QueueKind[]; title?: string }) {
  useQueue();
  const all = queueStore.get();
  const filterSet = filter ? new Set(Array.isArray(filter) ? filter : [filter]) : null;
  const entries = filterSet ? all.filter((e) => filterSet.has(e.kind)) : all;

  return (
    <div className="panel rounded-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-xs uppercase tracking-widest text-foreground flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-primary" /> {title}
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{entries.length} ativo{entries.length === 1 ? "" : "s"}</span>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground font-mono uppercase tracking-wider">
          Nenhum item em fila
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((e) => {
            const p = progressOf(e);
            return (
              <div key={e.id} className="bg-surface-elevated/40 rounded p-2.5 border border-border">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <div className="min-w-0">
                    <div className="text-[9px] font-mono uppercase text-muted-foreground tracking-widest">{kindLabel[e.kind]}</div>
                    <div className="font-display text-xs uppercase tracking-wider truncate">
                      {e.name}
                      {e.level && <span className="text-primary ml-1">→ Lv {e.level}</span>}
                      {e.qty && <span className="text-accent ml-1">×{e.qty}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs tabular-nums text-foreground">{p.remaining}</span>
                    <button
                      onClick={() => { queueStore.cancel(e.id); toast.message("Item cancelado"); }}
                      className="text-muted-foreground hover:text-destructive p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="h-1 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent shimmer" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
