import { createFileRoute } from "@tanstack/react-router";
import { Shield, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { UnitCard } from "@/components/UnitCard";
import { QueuePanel } from "@/components/QueuePanel";
import { defenses } from "@/lib/game-data";

export const Route = createFileRoute("/defense")({
  component: DefensePage,
  head: () => ({ meta: [{ title: "Defesa — OGAME" }] }),
});

function DefensePage() {
  const totalDef = defenses.reduce((s, x) => s + x.count * (x.attack + x.shield), 0);
  const totalUnits = defenses.reduce((s, x) => s + x.count, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={Shield} title="Defesa" subtitle="Sistemas de proteção planetária" code="DEF-Active" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Kpi label="Unidades" value={totalUnits.toLocaleString("pt-BR")} color="text-accent" />
        <Kpi label="Poder defensivo" value={totalDef.toLocaleString("pt-BR")} color="text-crystal" />
        <Kpi label="Cúpula" value="Ativa" color="text-primary" />
        <Kpi label="Status" value="Estável" color="text-accent" />
      </div>

      <div className="mb-4 panel rounded-md p-3 flex items-center gap-3 border-l-4 border-l-warning">
        <div className="w-10 h-10 stripe-warning rounded-sm shrink-0" />
        <div className="text-xs flex-1">
          <div className="font-display uppercase tracking-wider text-warning flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Aviso Tático
          </div>
          <div className="text-muted-foreground font-mono">Estruturas defensivas têm 30% de chance de destruição em batalha.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {defenses.map((s) => <UnitCard key={s.id} item={s} kind="defense" />)}
        </div>
        <QueuePanel filter={["ship", "defense"]} title="Estaleiro" />
      </div>
    </div>
  );
}

function Kpi({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="panel rounded-md p-3">
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-xl font-display font-bold tabular-nums mt-0.5 ${color}`}>{value}</div>
    </div>
  );
}
