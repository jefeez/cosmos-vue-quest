import { X, Eye, Crosshair, Send, Recycle, MessageSquare, UserPlus, Shield, Moon, Trash2, Pickaxe, Gem } from "lucide-react";
import { type PlanetSlot, statusMeta } from "@/lib/galaxy-data";
import { toast } from "sonner";

interface Props {
  slot: PlanetSlot | null;
  galaxy: number;
  system: number;
  onClose: () => void;
  onDispatch: (slot: PlanetSlot, mission: "Ataque" | "Espionagem" | "Transporte" | "Reciclar") => void;
}

export function GalaxySlotDetail({ slot, galaxy, system, onClose, onDispatch }: Props) {
  if (!slot) return null;
  const coords = `[${galaxy}:${system}:${slot.pos}]`;
  const isEmpty = !slot.player;
  const isSelf = slot.status === "self";
  const meta = slot.status ? statusMeta[slot.status] : null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 panel border-l border-border z-40 overflow-y-auto">
      <div className="sticky top-0 bg-surface-elevated/90 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Posição</div>
          <div className="font-display text-lg tracking-wide">{coords}</div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {isEmpty ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-border mb-3 flex items-center justify-center">
              <span className="text-2xl text-muted-foreground/40">∅</span>
            </div>
            <div className="text-sm text-muted-foreground mb-4">Posição vazia</div>
            <button
              onClick={() => toast.info("Colonização requer Nave Colonizadora")}
              className="px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-display uppercase tracking-wider"
            >
              Colonizar
            </button>
          </div>
        ) : (
          <>
            {/* Planet card */}
            <div className="panel rounded-md p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-14 h-14 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, oklch(0.7 0.15 ${(slot.pos * 30) % 360}), oklch(0.3 0.05 ${(slot.pos * 30) % 360}))`,
                    boxShadow: "inset -6px -6px 14px oklch(0 0 0 / 0.5)",
                  }}
                />
                <div className="flex-1">
                  <div className="font-display tracking-wide">{slot.planet}</div>
                  <div className={`text-xs font-mono ${meta?.color}`}>{slot.player}</div>
                </div>
              </div>

              {slot.moon && (
                <div className="flex items-center gap-2 text-xs panel-glow rounded p-2 mt-2">
                  <Moon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-display tracking-wide">{slot.moon.name}</span>
                  <span className="ml-auto font-mono tabular-nums text-muted-foreground">{slot.moon.size.toLocaleString()} km</span>
                </div>
              )}
            </div>

            {/* Player info */}
            {!isSelf && (
              <div className="panel rounded-md p-4 space-y-2">
                <div className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-2">Jogador</div>
                <Row label="Status" value={<span className={meta?.color}>{meta?.label}</span>} />
                <Row label="Aliança" value={slot.alliance ?? <span className="text-muted-foreground">—</span>} />
                <Row label="Ranking" value={`#${slot.rank?.toLocaleString()}`} />
                <Row
                  label="Atividade"
                  value={slot.activity === 0
                    ? <span className="text-deuterium">● online</span>
                    : <span className="text-muted-foreground">há {slot.activity}m</span>}
                />
              </div>
            )}

            {/* Debris field */}
            {slot.debris && (
              <div className="panel rounded-md p-4">
                <div className="text-[10px] font-display uppercase tracking-widest text-warning mb-2 flex items-center gap-1.5">
                  <Recycle className="w-3 h-3" /> Campo de destroços
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Pickaxe className="w-3 h-3 text-metal" />
                    <span className="font-mono tabular-nums">{slot.debris.metal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Gem className="w-3 h-3 text-crystal" />
                    <span className="font-mono tabular-nums">{slot.debris.crystal.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => onDispatch(slot, "Reciclar")}
                  className="w-full mt-3 px-3 py-2 bg-warning/15 border border-warning/40 text-warning rounded text-xs font-display uppercase tracking-wider hover:bg-warning/25 flex items-center justify-center gap-1.5"
                >
                  <Recycle className="w-3 h-3" /> Reciclar
                </button>
              </div>
            )}

            {/* Actions */}
            {!isSelf && (
              <div className="space-y-2">
                <div className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Ações táticas</div>
                <div className="grid grid-cols-2 gap-2">
                  <ActionBtn icon={Eye} label="Espionar" onClick={() => onDispatch(slot, "Espionagem")} />
                  <ActionBtn icon={Crosshair} label="Atacar" tone="destructive" onClick={() => onDispatch(slot, "Ataque")} />
                  <ActionBtn icon={Send} label="Transportar" onClick={() => onDispatch(slot, "Transporte")} />
                  <ActionBtn icon={Shield} label="Defender" onClick={() => toast.info("Frota defensiva enviada")} />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <ActionBtn icon={MessageSquare} label="Msg" small onClick={() => toast.info(`Mensagem para ${slot.player}`)} />
                  <ActionBtn icon={UserPlus} label="Aliado" small onClick={() => toast.success("Pedido enviado")} />
                  <ActionBtn icon={Trash2} label="Bloq." small onClick={() => toast.warning(`${slot.player} bloqueado`)} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-muted-foreground font-mono uppercase tracking-wider text-[10px]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, tone, small }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  tone?: "destructive";
  small?: boolean;
}) {
  const cls = tone === "destructive"
    ? "border-destructive/40 hover:border-destructive hover:text-destructive hover:bg-destructive/10"
    : "border-border hover:border-primary hover:text-primary hover:bg-primary/10";
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 px-2 ${small ? "py-1.5" : "py-2"} bg-surface-elevated border ${cls} rounded text-xs font-display uppercase tracking-wider transition-colors`}
    >
      <Icon className="w-3 h-3" /> {label}
    </button>
  );
}
