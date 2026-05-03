import { createFileRoute } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { UnitCard } from "@/components/UnitCard";
import { QueuePanel } from "@/components/QueuePanel";
import { ships } from "@/lib/game-data";

export const Route = createFileRoute("/shipyard")({
  component: ShipyardPage,
  head: () => ({ meta: [{ title: "Hangar — OGAME" }] }),
});

function ShipyardPage() {
  const totalShips = ships.reduce((s, x) => s + x.count, 0);
  const totalAtk = ships.reduce((s, x) => s + x.count * x.attack, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={Rocket} title="Hangar" subtitle="Construção de naves" code="DOCK-06" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Kpi label="Total de naves" value={totalShips.toLocaleString("pt-BR")} color="text-accent" />
        <Kpi label="Poder de ataque" value={totalAtk.toLocaleString("pt-BR")} color="text-destructive" />
        <Kpi label="Slots de frota" value="3 / 9" color="text-primary" />
        <Kpi label="Estaleiro" value="Lv 6" color="text-crystal" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ships.map((s) => <UnitCard key={s.id} item={s} kind="ship" />)}
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
