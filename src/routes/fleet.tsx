import { createFileRoute } from "@tanstack/react-router";
import { Plane, Send, RotateCcw, Shield, Crosshair, Eye } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/fleet")({
  component: FleetPage,
  head: () => ({ meta: [{ title: "Frotas — OGAME" }] }),
});

interface Mission {
  id: string;
  type: "Ataque" | "Transporte" | "Espionagem" | "Colonizar" | "Reciclar" | "Estacionar";
  origin: string;
  target: string;
  ships: number;
  arrival: string;
  progress: number;
  returning?: boolean;
}

const missions: Mission[] = [
  { id: "m1", type: "Ataque", origin: "[1:147:8]", target: "[2:241:11]", ships: 156, arrival: "00:42:18", progress: 64 },
  { id: "m2", type: "Espionagem", origin: "[1:147:8]", target: "[1:147:9]", ships: 8, arrival: "01:15:02", progress: 32 },
  { id: "m3", type: "Transporte", origin: "[1:147:8]", target: "[1:147:6]", ships: 24, arrival: "02:08:45", progress: 18, returning: true },
  { id: "m4", type: "Reciclar", origin: "[1:147:8]", target: "[1:147:5]", ships: 12, arrival: "00:18:33", progress: 78 },
];

const typeIcon = {
  Ataque: Crosshair, Transporte: Send, Espionagem: Eye, Colonizar: Plane, Reciclar: RotateCcw, Estacionar: Shield,
};
const typeColor = {
  Ataque: "destructive", Transporte: "primary", Espionagem: "accent",
  Colonizar: "crystal", Reciclar: "warning", Estacionar: "muted-foreground",
};

function FleetPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={Plane} title="Frotas" subtitle="Movimentos ativos da armada" code={`${missions.length} ATIVAS`} />

      {/* Slots */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="panel rounded-md p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Slots de Frota</div>
          <div className="text-2xl font-display font-bold mt-1 tabular-nums text-primary">4 / 9</div>
        </div>
        <div className="panel rounded-md p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Expedições</div>
          <div className="text-2xl font-display font-bold mt-1 tabular-nums text-accent">1 / 3</div>
        </div>
        <div className="panel rounded-md p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Naves Disponíveis</div>
          <div className="text-2xl font-display font-bold mt-1 tabular-nums text-crystal">412</div>
        </div>
        <div className="panel rounded-md p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Deutério Reservado</div>
          <div className="text-2xl font-display font-bold mt-1 tabular-nums text-deuterium">14.2k</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Missions */}
        <div className="panel rounded-md p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm uppercase tracking-widest">Movimentos Ativos</h2>
            <button className="text-[10px] font-mono uppercase tracking-wider text-primary hover:text-accent">+ Nova missão</button>
          </div>
          <div className="space-y-3">
            {missions.map((m) => {
              const Icon = typeIcon[m.type];
              return (
                <div key={m.id} className="bg-surface-elevated/40 rounded p-3 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-9 h-9 rounded bg-surface border border-border flex items-center justify-center text-${typeColor[m.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-display text-sm uppercase tracking-wider text-${typeColor[m.type]}`}>{m.type}</span>
                        {m.returning && <span className="text-[9px] font-mono uppercase bg-warning/20 text-warning px-1.5 py-0.5 rounded">retorno</span>}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        {m.origin} → <span className="text-foreground">{m.target}</span> · {m.ships} naves
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm tabular-nums text-foreground">{m.arrival}</div>
                      <div className="text-[9px] font-mono uppercase text-muted-foreground">chegada</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-background rounded-full overflow-hidden">
                    <div className={`h-full bg-${typeColor[m.type]} shimmer`} style={{ width: `${m.progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Send fleet */}
        <div className="panel rounded-md p-5">
          <h2 className="font-display text-sm uppercase tracking-widest mb-4">Enviar Frota</h2>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Coordenadas alvo</label>
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                <input defaultValue="1" className="bg-surface-elevated border border-border rounded px-2 py-1.5 text-sm font-mono text-center focus:outline-none focus:border-primary" />
                <input defaultValue="147" className="bg-surface-elevated border border-border rounded px-2 py-1.5 text-sm font-mono text-center focus:outline-none focus:border-primary" />
                <input defaultValue="9" className="bg-surface-elevated border border-border rounded px-2 py-1.5 text-sm font-mono text-center focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Tipo de missão</label>
              <select className="w-full mt-1 bg-surface-elevated border border-border rounded px-2 py-2 text-sm font-mono focus:outline-none focus:border-primary">
                <option>Ataque</option>
                <option>Espionagem</option>
                <option>Transporte</option>
                <option>Colonizar</option>
                <option>Reciclar</option>
                <option>Estacionar</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Velocidade</label>
              <input type="range" min="10" max="100" step="10" defaultValue="100" className="w-full mt-1 accent-primary" />
              <div className="flex justify-between text-[9px] font-mono text-muted-foreground"><span>10%</span><span>100%</span></div>
            </div>
            <button className="w-full py-2.5 bg-primary text-primary-foreground rounded font-display uppercase tracking-wider text-sm font-semibold hover:shadow-[0_0_16px_-4px_var(--primary)]">
              Lançar Frota →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
