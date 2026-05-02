import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plane, X, Rocket, Fuel, Package, AlertTriangle } from "lucide-react";
import { fleetShips } from "@/lib/fleet-data";
import { fleetStore, type MissionType } from "@/lib/fleet-store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  origin?: string;
  defaultTarget?: { g: number; s: number; p: number };
  defaultMission?: MissionType;
}

type Step = 1 | 2 | 3 | 4;

export function FleetDispatchDialog({ open, onClose, origin = "[1:147:8]", defaultTarget, defaultMission }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [target, setTarget] = useState(defaultTarget ?? { g: 1, s: 147, p: 9 });
  const [mission, setMission] = useState<MissionType>(defaultMission ?? "Ataque");
  const [speed, setSpeed] = useState(100);
  const [cargo, setCargo] = useState({ metal: 0, crystal: 0, deuterium: 0 });

  const totalShips = Object.values(selected).reduce((a, b) => a + b, 0);
  const selectedDefs = fleetShips.filter((s) => (selected[s.id] ?? 0) > 0);

  // Distance heuristic
  const distance = useMemo(() => {
    const o = { g: 1, s: 147, p: 8 };
    const dg = Math.abs(o.g - target.g);
    const ds = Math.abs(o.s - target.s);
    const dp = Math.abs(o.p - target.p);
    if (dg) return 20000 + 2000 * dg;
    if (ds) return 2700 + 95 * ds;
    return 1000 + 5 * dp;
  }, [target]);

  const slowestSpeed = useMemo(() => {
    if (selectedDefs.length === 0) return 1;
    return Math.min(...selectedDefs.map((s) => s.speed));
  }, [selectedDefs]);

  const flightSecs = useMemo(() => {
    const factor = 10 / (speed / 10);
    return Math.max(60, Math.round((35000 / slowestSpeed) * Math.sqrt((distance * 10) / slowestSpeed) * factor));
  }, [distance, slowestSpeed, speed]);

  const fuel = useMemo(() => {
    const base = selectedDefs.reduce((sum, s) => {
      const count = selected[s.id] ?? 0;
      return sum + count * s.consumption * (distance / 35000);
    }, 0);
    return Math.max(1, Math.round(base * (speed / 100) ** 2 * 2));
  }, [selectedDefs, selected, distance, speed]);

  const totalCapacity = useMemo(
    () => selectedDefs.reduce((sum, s) => sum + (selected[s.id] ?? 0) * s.capacity, 0),
    [selectedDefs, selected],
  );
  const usedCargo = cargo.metal + cargo.crystal + cargo.deuterium;
  const cargoOver = usedCargo > totalCapacity;
  const fuelAvailable = totalCapacity - usedCargo;

  const reset = () => {
    setStep(1); setSelected({}); setMission("Ataque"); setSpeed(100); setCargo({ metal: 0, crystal: 0, deuterium: 0 });
  };

  const handleClose = () => { onClose(); setTimeout(reset, 200); };

  const handleSend = () => {
    fleetStore.addMission({
      type: mission,
      origin,
      target: `[${target.g}:${target.s}:${target.p}]`,
      ships: selectedDefs.map((s) => ({ id: s.id, name: s.name, count: selected[s.id] })),
      cargo,
      fuel,
      speed,
      arrivalAt: Date.now() + flightSecs * 1000,
      returnAt: Date.now() + flightSecs * 2000,
    });
    toast.success(`Frota lançada — ${mission}`, {
      description: `${totalShips} naves rumo a [${target.g}:${target.s}:${target.p}] · ${fuel.toLocaleString("pt-BR")} deutério`,
    });
    handleClose();
  };

  if (!open) return null;

  const fmt = (n: number) => n.toLocaleString("pt-BR");
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={handleClose}>
      <div
        className="panel rounded-md w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-surface border border-border flex items-center justify-center text-primary">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display uppercase tracking-widest text-sm">Lançar Frota</h2>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Etapa {step} de 4 — {["Naves", "Destino", "Missão & Carga", "Confirmação"][step - 1]}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>

        {/* Stepper */}
        <div className="px-5 pt-3 flex gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={`h-1 flex-1 rounded-full ${n <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === 1 && (
            <div className="space-y-2">
              {fleetShips.map((s) => {
                const count = selected[s.id] ?? 0;
                const Icon = s.icon;
                return (
                  <div key={s.id} className="flex items-center gap-3 bg-surface-elevated/40 border border-border rounded p-2.5">
                    <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-xs uppercase tracking-wider truncate">{s.name}</div>
                      <div className="text-[9px] font-mono text-muted-foreground">
                        Disp: {fmt(s.available)} · Cap: {fmt(s.capacity)} · Vel: {fmt(s.speed)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number" min={0} max={s.available} value={count}
                        onChange={(e) => setSelected({ ...selected, [s.id]: Math.min(s.available, Math.max(0, +e.target.value || 0)) })}
                        className="w-20 bg-surface border border-border rounded px-2 py-1 text-xs font-mono text-right focus:outline-none focus:border-primary"
                      />
                      <button
                        onClick={() => setSelected({ ...selected, [s.id]: s.available })}
                        className="text-[9px] font-mono uppercase px-1.5 py-1 border border-border rounded hover:border-primary hover:text-primary"
                      >max</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Coordenadas alvo</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {(["g", "s", "p"] as const).map((k, i) => (
                    <div key={k}>
                      <div className="text-[9px] font-mono uppercase text-muted-foreground mb-0.5">{["Galáxia", "Sistema", "Posição"][i]}</div>
                      <input
                        type="number" value={target[k]}
                        onChange={(e) => setTarget({ ...target, [k]: +e.target.value || 1 })}
                        className="w-full bg-surface-elevated border border-border rounded px-3 py-2 text-sm font-mono text-center focus:outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { l: "Próprio", g: 1, s: 147, p: 6 },
                  { l: "Aliado", g: 1, s: 147, p: 9 },
                  { l: "Hostil", g: 2, s: 241, p: 11 },
                ].map((q) => (
                  <button key={q.l} onClick={() => setTarget({ g: q.g, s: q.s, p: q.p })}
                    className="bg-surface-elevated/40 border border-border rounded p-2 text-left hover:border-primary">
                    <div className="text-[9px] font-mono uppercase text-muted-foreground">{q.l}</div>
                    <div className="font-mono text-xs">[{q.g}:{q.s}:{q.p}]</div>
                  </button>
                ))}
              </div>

              <div className="bg-surface-elevated/40 border border-border rounded p-3 grid grid-cols-3 gap-3">
                <Stat label="Distância" value={`${fmt(distance)}`} />
                <Stat label="Vel. Frota" value={`${fmt(slowestSpeed)}`} />
                <Stat label="ETA (100%)" value={formatTime(flightSecs)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Missão</label>
                <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                  {(["Ataque", "Transporte", "Espionagem", "Colonizar", "Reciclar", "Estacionar", "Expedição", "Destruir"] as MissionType[]).map((t) => (
                    <button key={t} onClick={() => setMission(t)}
                      className={`px-2 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider border ${
                        mission === t ? "bg-primary/15 border-primary text-primary" : "bg-surface-elevated/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Velocidade — {speed}%</label>
                <input type="range" min={10} max={100} step={10} value={speed}
                  onChange={(e) => setSpeed(+e.target.value)} className="w-full mt-1 accent-primary" />
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground"><span>Lento (econômico)</span><span>Rápido</span></div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Carga</label>
                  <div className={`text-[10px] font-mono ${cargoOver ? "text-destructive" : "text-muted-foreground"}`}>
                    {fmt(usedCargo)} / {fmt(totalCapacity)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["metal", "crystal", "deuterium"] as const).map((k) => (
                    <div key={k}>
                      <div className={`text-[9px] font-mono uppercase mb-0.5 text-${k}`}>{k}</div>
                      <input type="number" min={0} value={cargo[k]}
                        onChange={(e) => setCargo({ ...cargo, [k]: Math.max(0, +e.target.value || 0) })}
                        className="w-full bg-surface-elevated border border-border rounded px-2 py-1.5 text-xs font-mono text-right focus:outline-none focus:border-primary" />
                    </div>
                  ))}
                </div>
                {cargoOver && (
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-destructive">
                    <AlertTriangle className="w-3 h-3" /> Capacidade excedida em {fmt(usedCargo - totalCapacity)}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <div className="bg-surface-elevated/40 border border-border rounded p-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Resumo da operação</div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-mono">
                  <Row label="Missão" value={mission} />
                  <Row label="Origem" value={origin} />
                  <Row label="Alvo" value={`[${target.g}:${target.s}:${target.p}]`} />
                  <Row label="Velocidade" value={`${speed}%`} />
                  <Row label="Naves" value={fmt(totalShips)} />
                  <Row label="Tempo de voo" value={formatTime(flightSecs)} />
                  <Row label="Carga" value={`${fmt(usedCargo)} t`} />
                  <Row label="Capacidade livre" value={`${fmt(Math.max(0, fuelAvailable))} t`} />
                </div>
              </div>

              <div className="bg-surface-elevated/40 border border-border rounded p-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Composição</div>
                <div className="space-y-1">
                  {selectedDefs.map((s) => (
                    <div key={s.id} className="flex justify-between text-xs font-mono">
                      <span className="text-muted-foreground">{s.name}</span>
                      <span className="text-foreground tabular-nums">{fmt(selected[s.id])}</span>
                    </div>
                  ))}
                  {selectedDefs.length === 0 && <div className="text-xs font-mono text-muted-foreground">Nenhuma nave selecionada.</div>}
                </div>
              </div>

              <div className="bg-deuterium/5 border border-deuterium/30 rounded p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-deuterium" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Consumo total</span>
                </div>
                <span className="font-display text-lg tabular-nums text-deuterium">{fmt(fuel)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Sticky summary */}
        <div className="px-5 py-2 border-t border-border bg-surface/40 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1"><Plane className="w-3 h-3" /> {fmt(totalShips)} naves</span>
            <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {fmt(usedCargo)} t</span>
            <span className="flex items-center gap-1 text-deuterium"><Fuel className="w-3 h-3" /> {fmt(fuel)}</span>
          </div>
          <span className="text-muted-foreground">ETA <span className="text-foreground">{formatTime(flightSecs)}</span></span>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex justify-between gap-2">
          <button
            onClick={() => step > 1 ? setStep((step - 1) as Step) : handleClose()}
            className="px-4 py-2 rounded border border-border text-xs font-mono uppercase tracking-wider hover:border-primary hover:text-primary flex items-center gap-1"
          >
            <ChevronLeft className="w-3 h-3" /> {step > 1 ? "Voltar" : "Cancelar"}
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((step + 1) as Step)}
              disabled={(step === 1 && totalShips === 0)}
              className="px-4 py-2 rounded bg-primary text-primary-foreground text-xs font-display uppercase tracking-wider font-semibold hover:shadow-[0_0_16px_-4px_var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Avançar <ChevronRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={cargoOver || totalShips === 0}
              className="px-4 py-2 rounded bg-primary text-primary-foreground text-xs font-display uppercase tracking-wider font-semibold hover:shadow-[0_0_16px_-4px_var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Lançar Frota →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-sm tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-muted-foreground uppercase tracking-wider text-[10px]">{label}</span>
      <span className="text-right text-foreground">{value}</span>
    </>
  );
}
