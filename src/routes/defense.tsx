import { createFileRoute } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { UnitCard } from "@/components/UnitCard";
import { defenses } from "@/lib/game-data";

export const Route = createFileRoute("/defense")({
  component: DefensePage,
  head: () => ({ meta: [{ title: "Defesa — OGAME" }] }),
});

function DefensePage() {
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={Shield} title="Defesa" subtitle="Sistemas de proteção planetária" code="DEF-Active" />
      <div className="mb-4 panel rounded-md p-3 flex items-center gap-3 border-l-4 border-l-warning">
        <div className="w-2 h-8 stripe-warning rounded-sm" />
        <div className="text-xs">
          <div className="font-display uppercase tracking-wider text-warning">Aviso Tático</div>
          <div className="text-muted-foreground font-mono">Estruturas defensivas são destruídas em 30% por batalha.</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {defenses.map((s) => <UnitCard key={s.id} item={s} />)}
      </div>
    </div>
  );
}
