import { createFileRoute } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { UnitCard } from "@/components/UnitCard";
import { ships } from "@/lib/game-data";

export const Route = createFileRoute("/shipyard")({
  component: ShipyardPage,
  head: () => ({ meta: [{ title: "Hangar — OGAME" }] }),
});

function ShipyardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={Rocket} title="Hangar" subtitle="Construção de naves" code="DOCK-06" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {ships.map((s) => <UnitCard key={s.id} item={s} />)}
      </div>
    </div>
  );
}
