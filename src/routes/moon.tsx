import { createFileRoute, Link } from "@tanstack/react-router";
import { Moon, Radar, Sparkles, ArrowLeft, Telescope } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BuildCard } from "@/components/BuildCard";
import { UnitCard } from "@/components/UnitCard";
import { moonBuildings, moonShips, moonDefenses, moonStats } from "@/lib/moon-data";
import { useLocation, locationStore } from "@/lib/location-store";
import { useEffect } from "react";

export const Route = createFileRoute("/moon")({
  component: MoonPage,
  head: () => ({ meta: [{ title: "Lua — OGAME" }] }),
});

function MoonPage() {
  const { planet, kind } = useLocation();

  // Auto-switch to moon view when entering this page
  useEffect(() => {
    if (planet.hasMoon && kind !== "moon") locationStore.setKind("moon");
  }, [planet.hasMoon, kind]);

  if (!planet.hasMoon) {
    return (
      <div className="max-w-3xl mx-auto">
        <PageHeader icon={Moon} title="Lua" subtitle="Sem satélite natural" code={planet.coords} />
        <div className="panel rounded-md p-8 text-center">
          <Moon className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="font-display uppercase tracking-wider text-foreground mb-1">Nenhuma lua detectada</h3>
          <p className="text-sm text-muted-foreground mb-4">
            O planeta <span className="text-primary">{planet.name}</span> não possui uma lua. Lance um ataque com recicladores para criar destroços e formar uma.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border rounded text-xs font-display uppercase tracking-wider hover:border-primary">
            <ArrowLeft className="w-3 h-3" /> Voltar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader icon={Moon} title={`Lua ${planet.moonName}`} subtitle="Operações lunares e defesa avançada" code={planet.coords} />

      {/* Moon overview */}
      <div className="panel rounded-md p-5 mb-5 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-30"
             style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.78 0.02 240), oklch(0.3 0.005 240) 70%, transparent)" }} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          <Stat label="Diâmetro" value={`${planet.moonDiameter?.toLocaleString("pt-BR")} km`} />
          <Stat label="Campos" value={`${moonStats.usedFields} / ${moonStats.totalFields}`} />
          <Stat label="Temperatura" value={`${moonStats.tempMin}° / ${moonStats.tempMax}°`} />
          <Stat label="Phalanx" value="Alcance 4 sist." accent />
        </div>
      </div>

      {/* Lunar capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <Capability icon={Radar} title="Sensor Phalanx" desc="Espione frotas em movimento dentro do alcance." status="Ativo" />
        <Capability icon={Sparkles} title="Portal de Salto" desc="Teleporte de frotas entre suas luas." status="Construindo" />
        <Capability icon={Telescope} title="Vigilância Lunar" desc="Detecção passiva de incursões hostis." status="Online" />
      </div>

      <SectionTitle title="Edifícios Lunares" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {moonBuildings.map((b) => <BuildCard key={b.id} item={b} />)}
      </div>

      <SectionTitle title="Frota Estacionada" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {moonShips.map((s) => <UnitCard key={s.id} item={s} />)}
      </div>

      <SectionTitle title="Defesa Lunar" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {moonDefenses.map((d) => <UnitCard key={d.id} item={d} />)}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      <div className={`font-display text-lg tracking-wide tabular-nums ${accent ? "text-accent" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function Capability({ icon: Icon, title, desc, status }: { icon: typeof Radar; title: string; desc: string; status: string }) {
  return (
    <div className="panel rounded-md p-3 flex items-start gap-3">
      <div className="w-10 h-10 rounded bg-crystal/10 border border-crystal/30 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-crystal" strokeWidth={1.6} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-display text-xs uppercase tracking-wider text-foreground truncate">{title}</h4>
          <span className="text-[9px] font-mono uppercase text-accent shrink-0">{status}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{desc}</p>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-xs font-display uppercase tracking-widest text-foreground">{title}</h2>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
