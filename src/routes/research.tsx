import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BuildCard } from "@/components/BuildCard";
import { research } from "@/lib/game-data";

export const Route = createFileRoute("/research")({
  component: ResearchPage,
  head: () => ({ meta: [{ title: "Pesquisas — OGAME" }] }),
});

function ResearchPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={FlaskConical} title="Pesquisas" subtitle="Árvore tecnológica" code="LAB-Lv5" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {research.map((b) => <BuildCard key={b.id} item={b} actionLabel="Pesquisar" />)}
      </div>
    </div>
  );
}
