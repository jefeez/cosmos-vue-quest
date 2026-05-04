import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Plane, Send, RotateCcw, Shield, Crosshair, Eye, Compass, Bomb,
  Anchor, Sparkles, Plus, X, ChevronRight, History, Swords,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FleetDispatchDialog } from "@/components/FleetDispatchDialog";
import { BattleSimulator } from "@/components/BattleSimulator";
import { useFleet, fleetStore, formatCountdown, missionProgress, type Mission, type MissionType } from "@/lib/fleet-store";
import { toast } from "sonner";

export const Route = createFileRoute("/fleet")({
  component: FleetPage,
  head: () => ({ meta: [{ title: "Frotas — OGAME" }] }),
});

const typeIcon: Record<MissionType, typeof Plane> = {
  Ataque: Crosshair, Transporte: Send, Espionagem: Eye, Colonizar: Compass,
  Reciclar: RotateCcw, Estacionar: Anchor, Expedição: Sparkles, Destruir: Bomb,
};
const typeColor: Record<MissionType, string> = {
  Ataque: "destructive", Transporte: "primary", Espionagem: "accent",
  Colonizar: "crystal", Reciclar: "warning", Estacionar: "muted-foreground",
  Expedição: "deuterium", Destruir: "destructive",
};

function FleetPage() {
  const { missions } = useFleet();
  const [tab, setTab] = useState<"active" | "returning" | "stationed" | "history">("active");
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [simOpen, setSimOpen] = useState(false);
  const [, force] = useState(0);

  // tick every second for countdowns
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const active = missions.filter((m) => m.status === "outbound");
  const returning = missions.filter((m) => m.status === "returning" || m.status === "recalled");
  const stationed = missions.filter((m) => m.status === "holding");
  const history = missions.filter((m) => m.status === "completed");

  const visible: Mission[] = { active, returning, stationed, history }[tab];

  const totalShips = missions.reduce((s, m) => s + m.ships.reduce((a, b) => a + b.count, 0), 0);
  const totalDeut = missions.reduce((s, m) => s + m.fuel, 0);

  const fmt = (n: number) => n.toLocaleString("pt-BR");

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={Plane} title="Frotas" subtitle="Comando central da armada" code={`${active.length} ATIVAS`} />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <Kpi label="Slots de Frota" value={`${active.length + returning.length + stationed.length} / 9`} tone="primary" />
        <Kpi label="Expedições" value={`${missions.filter(m => m.type === "Expedição").length} / 3`} tone="accent" />
        <Kpi label="Naves em voo" value={fmt(active.reduce((s, m) => s + m.ships.reduce((a, b) => a + b.count, 0), 0))} tone="crystal" />
        <Kpi label="Frota total" value={fmt(totalShips)} tone="foreground" />
        <Kpi label="Deut. reservado" value={fmt(totalDeut)} tone="deuterium" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Missions panel */}
        <div className="panel rounded-md lg:col-span-2 flex flex-col">
          {/* Tabs */}
          <div className="flex items-center justify-between px-5 pt-4">
            <div className="flex gap-1">
              {([
                ["active", "Ativas", active.length],
                ["returning", "Retornando", returning.length],
                ["stationed", "Estacionadas", stationed.length],
                ["history", "Histórico", history.length],
              ] as const).map(([k, label, n]) => (
                <button key={k} onClick={() => setTab(k)}
                  className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded ${
                    tab === k ? "bg-primary/15 text-primary border border-primary/40" : "text-muted-foreground hover:text-foreground border border-transparent"
                  }`}>
                  {label} <span className="opacity-60">({n})</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSimOpen(true)}
                className="px-3 py-1.5 border border-destructive/40 text-destructive rounded font-display uppercase tracking-wider text-[10px] font-semibold hover:bg-destructive/10 flex items-center gap-1"
              >
                <Swords className="w-3 h-3" /> Simular
              </button>
              <button
                onClick={() => setDispatchOpen(true)}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded font-display uppercase tracking-wider text-[10px] font-semibold hover:shadow-[0_0_16px_-4px_var(--primary)] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Nova missão
              </button>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {visible.length === 0 && (
              <div className="text-center py-12 text-muted-foreground font-mono text-xs uppercase tracking-wider">
                <History className="w-6 h-6 mx-auto mb-2 opacity-40" />
                Nenhuma missão nesta categoria.
              </div>
            )}
            {visible.map((m) => <MissionRow key={m.id} mission={m} />)}
          </div>
        </div>

        {/* Quick send */}
        <div className="panel rounded-md p-5 h-fit space-y-4">
          <h2 className="font-display text-sm uppercase tracking-widest">Lançamento Rápido</h2>
          <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
            Envie frotas com configuração detalhada — naves, destino, missão, velocidade e carga.
          </p>
          <button
            onClick={() => setDispatchOpen(true)}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded font-display uppercase tracking-wider text-sm font-semibold hover:shadow-[0_0_16px_-4px_var(--primary)] flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Abrir assistente
          </button>

          <div className="border-t border-border pt-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Atalhos</div>
            <div className="space-y-1.5">
              {[
                { l: "Espionar último alvo", icon: Eye },
                { l: "Reciclar destroços", icon: RotateCcw },
                { l: "Reforçar colônia", icon: Shield },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.l} onClick={() => setDispatchOpen(true)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-surface-elevated/40 border border-border rounded text-xs hover:border-primary group">
                    <span className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                      <Icon className="w-3 h-3" /> {s.l}
                    </span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Tipos de missão</div>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(typeIcon) as MissionType[]).map((t) => {
                const Icon = typeIcon[t];
                return (
                  <div key={t} className="flex items-center gap-1.5 text-[10px] font-mono uppercase">
                    <Icon className={`w-3 h-3 text-${typeColor[t]}`} />
                    <span className="text-muted-foreground">{t}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <FleetDispatchDialog open={dispatchOpen} onClose={() => setDispatchOpen(false)} />
      <BattleSimulator open={simOpen} onClose={() => setSimOpen(false)} />
    </div>
  );
}

function MissionRow({ mission }: { mission: Mission }) {
  const Icon = typeIcon[mission.type];
  const color = typeColor[mission.type];
  const progress = missionProgress(mission);
  const eta = mission.status === "returning" || mission.status === "recalled"
    ? formatCountdown(mission.returnAt)
    : formatCountdown(mission.arrivalAt);
  const totalShips = mission.ships.reduce((a, b) => a + b.count, 0);
  const totalCargo = mission.cargo.metal + mission.cargo.crystal + mission.cargo.deuterium;
  const fmt = (n: number) => n.toLocaleString("pt-BR");

  const canRecall = mission.status === "outbound" || mission.status === "holding";

  const handleRecall = () => {
    fleetStore.recall(mission.id);
    toast.warning(`Frota retornando — ${mission.type}`, { description: `Origem ${mission.origin}` });
  };

  return (
    <div className="bg-surface-elevated/40 rounded border border-border overflow-hidden">
      <div className="p-3">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-9 h-9 rounded bg-surface border border-border flex items-center justify-center text-${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-display text-sm uppercase tracking-wider text-${color}`}>{mission.type}</span>
              {mission.status === "returning" && <Tag color="warning">retorno</Tag>}
              {mission.status === "recalled" && <Tag color="destructive">recall</Tag>}
              {mission.status === "holding" && <Tag color="accent">estacionada</Tag>}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground truncate">
              {mission.origin} → <span className="text-foreground">{mission.target}</span> · {fmt(totalShips)} naves
              {totalCargo > 0 && <> · {fmt(totalCargo)} t</>}
              {mission.fuel > 0 && <> · <span className="text-deuterium">{fmt(mission.fuel)} D</span></>}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm tabular-nums text-foreground">{eta}</div>
            <div className="text-[9px] font-mono uppercase text-muted-foreground">
              {mission.status === "returning" || mission.status === "recalled" ? "retorno" : "chegada"}
            </div>
          </div>
        </div>

        <div className="h-1.5 bg-background rounded-full overflow-hidden">
          <div className={`h-full bg-${color} shimmer`} style={{ width: `${mission.status === "returning" ? 100 - progress : progress}%` }} />
        </div>

        {/* Composition */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex flex-wrap gap-1.5">
            {mission.ships.slice(0, 4).map((s) => (
              <span key={s.id} className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface border border-border text-muted-foreground">
                {s.name} <span className="text-foreground">{s.count}</span>
              </span>
            ))}
            {mission.ships.length > 4 && (
              <span className="text-[9px] font-mono uppercase text-muted-foreground">+{mission.ships.length - 4}</span>
            )}
          </div>
          <div className="flex gap-1">
            {canRecall && (
              <button onClick={handleRecall}
                className="text-[9px] font-mono uppercase px-2 py-1 rounded border border-border hover:border-warning hover:text-warning flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Recall
              </button>
            )}
            <button onClick={() => fleetStore.remove(mission.id)}
              className="text-[9px] font-mono uppercase px-2 py-1 rounded border border-border hover:border-destructive hover:text-destructive flex items-center gap-1">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="panel rounded-md p-4">
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-2xl font-display font-bold mt-1 tabular-nums text-${tone}`}>{value}</div>
    </div>
  );
}
function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  return <span className={`text-[9px] font-mono uppercase bg-${color}/20 text-${color} px-1.5 py-0.5 rounded`}>{children}</span>;
}
