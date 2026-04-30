import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BuildCard } from "@/components/BuildCard";
import { buildings } from "@/lib/game-data";

export const Route = createFileRoute("/buildings")({
  component: BuildingsPage,
  head: () => ({ meta: [{ title: "Edifícios — OGAME" }] }),
});

function BuildingsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={Building2} title="Edifícios" subtitle="Infraestrutura de produção" code="[1:147:8]" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {buildings.map((b) => <BuildCard key={b.id} item={b} />)}
      </div>
    </div>
  );
}
