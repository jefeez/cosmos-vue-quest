import { createFileRoute, Link } from "@tanstack/react-router";
import { Moon, Radar, Sparkles, ArrowLeft, Telescope, Activity, Pickaxe, Gem, Droplet, Send, Eye, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BuildCard } from "@/components/BuildCard";
import { UnitCard } from "@/components/UnitCard";
import { moonBuildings, moonShips, moonDefenses, moonStats } from "@/lib/moon-data";
import { useLocation, locationStore } from "@/lib/location-store";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/moon")({
  component: MoonPage,
  head: () => ({ meta: [{ title: "Lua — OGAME" }] }),
});

type Tab = "overview" | "buildings" | "fleet" | "defense";

function MoonPage() {
  const { planet, kind } = useLocation();
  const [tab, setTab] = useState<Tab>("overview");

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

  const totalShips = moonShips.reduce((s, u) => s + u.count, 0);
  const totalDefense = moonDefenses.reduce((s, u) => s + u.count, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader icon={Moon} title={`Lua ${planet.moonName}`} subtitle="Comando lunar — operações e defesa" code={planet.coords} />

      {/* Hero */}
      <div className="panel rounded-md p-5 mb-4 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full opacity-40 pointer-events-none"
             style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.78 0.02 240), oklch(0.3 0.005 240) 65%, transparent 75%)" }} />
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full opacity-20 blur-2xl pointer-events-none"
             style={{ background: "radial-gradient(circle, var(--crystal), transparent 60%)" }} />

        <div className="relative grid grid-cols-2 md:grid-cols-5 gap-4">
          <Stat label="Diâmetro" value={`${planet.moonDiameter?.toLocaleString("pt-BR")} km`} />
          <Stat label="Campos" value={`${moonStats.usedFields} / ${moonStats.totalFields}`} />
          <Stat label="Temperatura" value={`${moonStats.tempMin}° / ${moonStats.tempMax}°`} />
          <Stat label="Frota Lunar" value={totalShips.toLocaleString("pt-BR")} accent />
          <Stat label="Defesa" value={totalDefense.toLocaleString("pt-BR")} accent />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-border">
        <TabBtn active={tab === "overview"} onClick={() => setTab("overview")} icon={Activity} label="Visão Geral" />
        <TabBtn active={tab === "buildings"} onClick={() => setTab("buildings")} icon={Sparkles} label="Edifícios" count={moonBuildings.length} />
        <TabBtn active={tab === "fleet"} onClick={() => setTab("fleet")} icon={Send} label="Frota" count={totalShips} />
        <TabBtn active={tab === "defense"} onClick={() => setTab("defense")} icon={Telescope} label="Defesa" count={totalDefense} />
      </div>

      {tab === "overview" && <OverviewTab onNavigate={setTab} />}

      {tab === "buildings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {moonBuildings.map((b) => <BuildCard key={b.id} item={b} />)}
        </div>
      )}

      {tab === "fleet" && (
        <>
          {moonShips.length === 0 ? (
            <EmptyState icon={Send} title="Nenhuma nave estacionada" desc="Envie uma frota para sua lua para guarnecê-la." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {moonShips.map((s) => <UnitCard key={s.id} item={s} />)}
            </div>
          )}
        </>
      )}

      {tab === "defense" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {moonDefenses.map((d) => <UnitCard key={d.id} item={d} />)}
        </div>
      )}
    </div>
  );
}

function OverviewTab({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const constructing = moonBuildings.find((b) => b.building);

  return (
    <div className="space-y-4">
      {/* Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Capability icon={Radar} title="Sensor Phalanx" desc="Espione frotas em movimento dentro do alcance." status="Ativo" tone="ok" />
        <Capability icon={Sparkles} title="Portal de Salto" desc="Teleporte de frotas entre suas luas." status="Construindo" tone="warn" />
        <Capability icon={Telescope} title="Vigilância Lunar" desc="Detecção passiva de incursões hostis." status="Online" tone="ok" />
      </div>

      {/* Construction + Resources side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 panel rounded-md p-4">
          <SectionTitle title="Construção em Andamento" />
          {constructing ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-crystal/10 border border-crystal/30 flex items-center justify-center shrink-0">
                <constructing.icon className="w-6 h-6 text-crystal" strokeWidth={1.6} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <div className="font-display text-sm uppercase tracking-wider text-foreground">{constructing.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Nível {constructing.level} → {constructing.level + 1}</div>
                  </div>
                  <div className="font-mono text-sm tabular-nums text-crystal">{constructing.building?.remaining}</div>
                </div>
                <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-crystal to-accent shimmer" style={{ width: `${constructing.building?.progress}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma construção ativa.</p>
          )}
        </div>

        <div className="panel rounded-md p-4">
          <SectionTitle title="Estoque Lunar" />
          <div className="space-y-2">
            <ResLine icon={Pickaxe} label="Metal" value="48.200" color="--metal" />
            <ResLine icon={Gem} label="Cristal" value="32.100" color="--crystal" />
            <ResLine icon={Droplet} label="Deutério" value="12.800" color="--deuterium" />
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className="panel rounded-md p-4">
        <SectionTitle title="Atividade Recente" />
        <div className="space-y-2">
          <LogLine icon={Eye} tone="accent" text="Phalanx detectou frota inimiga em [1:147:5]" time="00:14" />
          <LogLine icon={AlertCircle} tone="warning" text="Atividade lunar detectada por terceiros" time="01:42" />
          <LogLine icon={Send} tone="ok" text="Frota retornou da missão de transporte" time="03:08" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <QuickAction onClick={() => onNavigate("buildings")} icon={Sparkles} label="Edifícios" />
        <QuickAction onClick={() => onNavigate("fleet")} icon={Send} label="Frota" />
        <QuickAction onClick={() => onNavigate("defense")} icon={Telescope} label="Defesa" />
        <QuickAction icon={Radar} label="Phalanx" />
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label, count }: { active: boolean; onClick: () => void; icon: typeof Activity; label: string; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2.5 flex items-center gap-2 text-xs font-display uppercase tracking-wider transition-colors ${
        active ? "text-crystal" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      {count !== undefined && (
        <span className={`text-[9px] font-mono tabular-nums px-1.5 py-0.5 rounded ${active ? "bg-crystal/15 text-crystal" : "bg-surface-elevated text-muted-foreground"}`}>{count}</span>
      )}
      {active && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-crystal" />}
    </button>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      <div className={`font-display text-lg tracking-wide tabular-nums ${accent ? "text-crystal" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function Capability({ icon: Icon, title, desc, status, tone }: { icon: typeof Radar; title: string; desc: string; status: string; tone: "ok" | "warn" }) {
  return (
    <div className="panel rounded-md p-3 flex items-start gap-3">
      <div className="w-10 h-10 rounded bg-crystal/10 border border-crystal/30 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-crystal" strokeWidth={1.6} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-display text-xs uppercase tracking-wider text-foreground truncate">{title}</h4>
          <span className={`text-[9px] font-mono uppercase shrink-0 flex items-center gap-1 ${tone === "warn" ? "text-warning" : "text-accent"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tone === "warn" ? "bg-warning" : "bg-accent"} pulse-glow`} />
            {status}
          </span>
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

function ResLine({ icon: Icon, label, value, color }: { icon: typeof Pickaxe; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="w-3.5 h-3.5" style={{ color: `var(${color})` }} />
        <span className="uppercase tracking-wider text-[10px] font-mono">{label}</span>
      </div>
      <span className="font-mono tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function LogLine({ icon: Icon, tone, text, time }: { icon: typeof Eye; tone: "ok" | "warning" | "accent"; text: string; time: string }) {
  const color = tone === "warning" ? "text-warning" : tone === "accent" ? "text-accent" : "text-crystal";
  return (
    <div className="flex items-center gap-3 text-xs py-1.5 border-b border-border/40 last:border-0">
      <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
      <span className="flex-1 text-foreground/90">{text}</span>
      <span className="font-mono text-[10px] text-muted-foreground tabular-nums">há {time}</span>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: typeof Sparkles; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="panel rounded-md p-3 flex items-center gap-2.5 hover:border-crystal hover:text-crystal transition-colors group"
    >
      <Icon className="w-4 h-4 text-crystal" />
      <span className="text-xs font-display uppercase tracking-wider">{label}</span>
    </button>
  );
}

function EmptyState({ icon: Icon, title, desc }: { icon: typeof Send; title: string; desc: string }) {
  return (
    <div className="panel rounded-md p-8 text-center">
      <Icon className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
      <h3 className="font-display uppercase tracking-wider text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
