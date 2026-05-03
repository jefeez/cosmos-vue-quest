import { createFileRoute } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BuildCard } from "@/components/BuildCard";
import { QueuePanel } from "@/components/QueuePanel";
import { facilities } from "@/lib/game-data";

export const Route = createFileRoute("/facilities")({
  component: FacilitiesPage,
  head: () => ({ meta: [{ title: "Instalações — OGAME" }] }),
});

function FacilitiesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={Wrench} title="Instalações" subtitle="Estruturas industriais avançadas" code="[1:147:8]" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facilities.map((b) => <BuildCard key={b.id} item={b} kind="facility" />)}
        </div>
        <QueuePanel filter={["building", "facility"]} title="Fila Planetária" />
      </div>
    </div>
  );
}
