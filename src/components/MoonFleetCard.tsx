import { useState } from "react";
import { Send, Download, Repeat, Droplet, X, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { UnitItem } from "@/lib/game-data";

const fmt = (n: number) => n.toLocaleString("pt-BR");

type Action = "send" | "withdraw" | "swap";
type Mission = "transport" | "deploy" | "attack" | "espionage" | "recycle";

const MISSIONS: { id: Mission; label: string }[] = [
  { id: "transport", label: "Transportar" },
  { id: "deploy", label: "Estacionar" },
  { id: "attack", label: "Atacar" },
  { id: "espionage", label: "Espionar" },
  { id: "recycle", label: "Reciclar" },
];

const ACTION_META: Record<Action, { label: string; icon: typeof Send; tone: string; verb: string }> = {
  send: { label: "Enviar", icon: Send, tone: "text-accent", verb: "enviadas" },
  withdraw: { label: "Retirar", icon: Download, tone: "text-crystal", verb: "retiradas" },
  swap: { label: "Alternar Missão", icon: Repeat, tone: "text-warning", verb: "realocadas" },
};

export function MoonFleetCard({ item }: { item: UnitItem }) {
  const Icon = item.icon;
  const [open, setOpen] = useState<Action | null>(null);

  return (
    <div className="panel panel-glow rounded-md p-4 relative overflow-hidden">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 rounded bg-crystal/10 border border-crystal/30 flex items-center justify-center shrink-0">
          <Icon className="w-7 h-7 text-crystal" strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-sm font-semibold tracking-wide uppercase truncate">{item.name}</h3>
            <span className="font-mono text-lg font-bold text-accent tabular-nums">{fmt(item.count)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">Estacionado na lua</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 mb-3 text-center">
        <div className="bg-surface-elevated/50 rounded px-1 py-1.5">
          <div className="text-[9px] font-mono uppercase text-muted-foreground tracking-wider">ATK</div>
          <div className="text-xs font-mono font-bold tabular-nums text-destructive">{fmt(item.attack)}</div>
        </div>
        <div className="bg-surface-elevated/50 rounded px-1 py-1.5">
          <div className="text-[9px] font-mono uppercase text-muted-foreground tracking-wider">ESC</div>
          <div className="text-xs font-mono font-bold tabular-nums text-crystal">{fmt(item.shield)}</div>
        </div>
        <div className="bg-surface-elevated/50 rounded px-1 py-1.5">
          <div className="text-[9px] font-mono uppercase text-muted-foreground tracking-wider">VEL</div>
          <div className="text-xs font-mono font-bold tabular-nums text-accent">{item.speed ? fmt(item.speed) : "—"}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <ActBtn action="send" onClick={() => setOpen("send")} />
        <ActBtn action="withdraw" onClick={() => setOpen("withdraw")} />
        <ActBtn action="swap" onClick={() => setOpen("swap")} />
      </div>

      {open && (
        <ConfirmModal
          action={open}
          item={item}
          onClose={() => setOpen(null)}
          onConfirm={(qty, mission, fuel) => {
            const meta = ACTION_META[open];
            toast.success(`${qty} ${item.name} ${meta.verb}`, {
              description: `Missão: ${MISSIONS.find((m) => m.id === mission)?.label} • Combustível: ${fmt(fuel)} D`,
            });
            setOpen(null);
          }}
        />
      )}
    </div>
  );
}

function ActBtn({ action, onClick }: { action: Action; onClick: () => void }) {
  const meta = ACTION_META[action];
  const Icon = meta.icon;
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 py-2 px-1 bg-surface-elevated border border-border rounded text-[10px] font-display uppercase tracking-wider hover:border-crystal hover:bg-crystal/5 transition-colors ${meta.tone}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="text-foreground/90 leading-none">{meta.label}</span>
    </button>
  );
}

function ConfirmModal({
  action,
  item,
  onClose,
  onConfirm,
}: {
  action: Action;
  item: UnitItem;
  onClose: () => void;
  onConfirm: (qty: number, mission: Mission, fuel: number) => void;
}) {
  const meta = ACTION_META[action];
  const Icon = meta.icon;
  const [qty, setQty] = useState(1);
  const [mission, setMission] = useState<Mission>(action === "withdraw" ? "transport" : "deploy");

  const safeQty = Math.min(Math.max(0, qty), item.count);
  // Custo simplificado: 1 deutério por unidade, modulado por ação e missão
  const baseFuel = action === "swap" ? 0.3 : 1;
  const missionMult = mission === "attack" ? 1.5 : mission === "recycle" ? 1.2 : 1;
  const fuel = Math.ceil(safeQty * baseFuel * missionMult);
  const invalid = safeQty <= 0 || safeQty > item.count;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="panel rounded-md w-full max-w-md relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <Icon className={`w-4 h-4 ${meta.tone}`} />
            <h3 className="font-display text-sm uppercase tracking-wider text-foreground">
              {meta.label} — {item.name}
            </h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Quantidade ({fmt(item.count)} disponíveis)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                max={item.count}
                value={qty || ""}
                onChange={(e) => setQty(+e.target.value)}
                className="flex-1 bg-surface-elevated border border-border rounded px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-crystal"
              />
              <button
                onClick={() => setQty(item.count)}
                className="px-3 py-2 bg-surface-elevated border border-border rounded text-[10px] font-display uppercase tracking-wider hover:border-crystal"
              >
                Máx
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Missão
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {MISSIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMission(m.id)}
                  className={`px-2 py-1.5 rounded text-[10px] font-display uppercase tracking-wider border transition-colors ${
                    mission === m.id
                      ? "border-crystal bg-crystal/10 text-crystal"
                      : "border-border bg-surface-elevated text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-elevated/50 border border-border rounded p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-mono uppercase tracking-wider text-[10px]">Unidades</span>
              <span className="font-mono tabular-nums text-foreground">{fmt(safeQty)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-mono uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Droplet className="w-3 h-3 text-deuterium" /> Combustível
              </span>
              <span className="font-mono tabular-nums text-deuterium">{fmt(fuel)} D</span>
            </div>
          </div>

          {action === "send" && (
            <div className="flex items-start gap-2 text-[10px] font-mono text-warning bg-warning/5 border border-warning/30 rounded p-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Frota deixará a defesa lunar e ficará exposta durante o trajeto.</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 p-4 border-t border-border bg-surface/40">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-surface-elevated border border-border rounded text-xs font-display uppercase tracking-wider hover:border-foreground/40"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(safeQty, mission, fuel)}
            disabled={invalid}
            className="flex-1 px-4 py-2 bg-crystal text-background rounded text-xs font-display uppercase tracking-wider font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-crystal/90 flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
