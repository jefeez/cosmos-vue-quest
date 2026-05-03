import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BuildCard } from "@/components/BuildCard";
import { QueuePanel } from "@/components/QueuePanel";
import { buildings } from "@/lib/game-data";

export const Route = createFileRoute("/buildings")({
  component: BuildingsPage,
  head: () => ({ meta: [{ title: "Edifícios — OGAME" }] }),
});

function BuildingsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={Building2} title="Edifícios" subtitle="Infraestrutura de produção" code="[1:147:8]" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buildings.map((b) => <BuildCard key={b.id} item={b} kind="building" />)}
        </div>
        <div className="space-y-4">
          <QueuePanel filter={["building", "facility"]} title="Fila Planetária" />
        </div>
      </div>
    </div>
  );
}
