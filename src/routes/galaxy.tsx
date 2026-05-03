import { createFileRoute } from "@tanstack/react-router";
import { Globe2, Search, Crosshair, Eye, Send, ChevronLeft, ChevronRight, Star, Recycle, Filter, Moon, Orbit, List } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useMemo, useState } from "react";
import { generateSystem, statusMeta, type PlanetSlot, type PlayerStatus } from "@/lib/galaxy-data";
import { GalaxySlotDetail } from "@/components/GalaxySlotDetail";
import { FleetDispatchDialog } from "@/components/FleetDispatchDialog";
import { SystemOrbitView } from "@/components/SystemOrbitView";
import type { MissionType } from "@/lib/fleet-store";

export const Route = createFileRoute("/galaxy")({
  component: GalaxyPage,
  head: () => ({ meta: [{ title: "Galáxia — OGAME" }] }),
});

const FILTERS: { id: PlayerStatus | "all" | "moon" | "debris"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Ativos" },
  { id: "inactive", label: "Inativos" },
  { id: "noob", label: "Iniciantes" },
  { id: "strong", label: "Fortes" },
  { id: "moon", label: "Com lua" },
  { id: "debris", label: "Destroços" },
];

function GalaxyPage() {
  const [galaxy, setGalaxy] = useState(1);
  const [system, setSystem] = useState(147);
  const [selected, setSelected] = useState<PlanetSlot | null>(null);
  const [filter, setFilter] = useState<typeof FILTERS[number]["id"]>("all");
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [dispatchTarget, setDispatchTarget] = useState<{ g: number; s: number; p: number }>();
  const [dispatchMission, setDispatchMission] = useState<MissionType>("Ataque");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["1:147:9"]));
  const [view, setView] = useState<"orbit" | "list">("orbit");

  const slots = useMemo(() => generateSystem(galaxy, system), [galaxy, system]);

  const stats = useMemo(() => ({
    occupied: slots.filter((s) => s.player).length,
    moons: slots.filter((s) => s.moon).length,
    debris: slots.filter((s) => s.debris).length,
    inactive: slots.filter((s) => s.status === "inactive").length,
  }), [slots]);

  const visibleSlots = slots.filter((s) => {
    if (filter === "all") return true;
    if (filter === "moon") return !!s.moon;
    if (filter === "debris") return !!s.debris;
    return s.status === filter;
  });

  const toggleFav = (slot: PlanetSlot) => {
    const key = `${galaxy}:${system}:${slot.pos}`;
    setFavorites((f) => {
      const next = new Set(f);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const dispatch = (slot: PlanetSlot, mission: MissionType) => {
    setDispatchTarget({ g: galaxy, s: system, p: slot.pos });
    setDispatchMission(mission);
    setDispatchOpen(true);
    setSelected(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={Globe2} title="Galáxia" subtitle="Mapa estelar interativo" code={`G${galaxy}:S${system}`} />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <Kpi label="Ocupados" value={`${stats.occupied}/15`} />
        <Kpi label="Luas" value={stats.moons} accent="text-muted-foreground" />
        <Kpi label="Destroços" value={stats.debris} accent="text-warning" />
        <Kpi label="Inativos" value={stats.inactive} accent="text-deuterium" />
      </div>

      {/* Navigation */}
      <div className="panel rounded-md p-4 mb-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Galáxia</label>
          <button onClick={() => setGalaxy(Math.max(1, galaxy - 1))} className="px-2 py-1 bg-surface-elevated border border-border rounded text-xs hover:border-primary">
            <ChevronLeft className="w-3 h-3" />
          </button>
          <input type="number" value={galaxy} onChange={(e) => setGalaxy(+e.target.value)}
            className="w-14 bg-surface-elevated border border-border rounded px-2 py-1 text-sm font-mono text-center focus:outline-none focus:border-primary" />
          <button onClick={() => setGalaxy(galaxy + 1)} className="px-2 py-1 bg-surface-elevated border border-border rounded text-xs hover:border-primary">
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Sistema</label>
          <button onClick={() => setSystem(Math.max(1, system - 1))} className="px-2 py-1 bg-surface-elevated border border-border rounded text-xs hover:border-primary">
            <ChevronLeft className="w-3 h-3" />
          </button>
          <input type="number" value={system} onChange={(e) => setSystem(+e.target.value)}
            className="w-20 bg-surface-elevated border border-border rounded px-2 py-1 text-sm font-mono text-center focus:outline-none focus:border-primary" />
          <button onClick={() => setSystem(system + 1)} className="px-2 py-1 bg-surface-elevated border border-border rounded text-xs hover:border-primary">
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <button
          onClick={() => { setGalaxy(1); setSystem(147); }}
          className="px-3 py-1.5 bg-surface-elevated border border-border rounded text-[10px] font-display uppercase tracking-widest hover:border-primary flex items-center gap-1.5"
        >
          <Star className="w-3 h-3" /> Ir p/ casa
        </button>
        <button className="ml-auto px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-display uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" /> Buscar jogador
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Filter className="w-3 h-3 text-muted-foreground" />
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-2.5 py-1 rounded text-[10px] font-display uppercase tracking-widest border transition-colors ${
              filter === f.id
                ? "bg-primary/15 border-primary text-primary"
                : "bg-surface-elevated border-border text-muted-foreground hover:border-foreground/30"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto inline-flex rounded border border-border bg-surface-elevated overflow-hidden">
          <button
            onClick={() => setView("orbit")}
            className={`px-2.5 py-1 text-[10px] font-display uppercase tracking-widest flex items-center gap-1.5 ${
              view === "orbit" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Orbit className="w-3 h-3" /> Órbita
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-2.5 py-1 text-[10px] font-display uppercase tracking-widest flex items-center gap-1.5 border-l border-border ${
              view === "list" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="w-3 h-3" /> Lista
          </button>
        </div>
      </div>

      {view === "orbit" && (
        <SystemOrbitView
          slots={slots}
          galaxy={galaxy}
          system={system}
          favorites={favorites}
          onSelect={(s) => setSelected(s)}
        />
      )}

      {view === "list" && (
        <div className="panel rounded-md overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-surface-elevated/60 border-b border-border text-[10px] font-display uppercase tracking-widest text-muted-foreground">
          <div className="col-span-1">Pos</div>
          <div className="col-span-3">Planeta</div>
          <div className="col-span-3">Jogador</div>
          <div className="col-span-1">Aliança</div>
          <div className="col-span-1 text-right">Rank</div>
          <div className="col-span-1 text-center">Ativ.</div>
          <div className="col-span-2 text-right">Ações</div>
        </div>

        {visibleSlots.map((slot) => {
          const meta = slot.status ? statusMeta[slot.status] : null;
          const favKey = `${galaxy}:${system}:${slot.pos}`;
          const isFav = favorites.has(favKey);
          return (
            <div
              key={slot.pos}
              onClick={() => slot.player && setSelected(slot)}
              className={`grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-border/50 text-xs items-center transition-colors ${
                slot.player ? "cursor-pointer hover:bg-surface-elevated/50" : ""
              } ${slot.status === "self" ? "bg-primary/5" : ""}`}
            >
              <div className="col-span-1 font-mono text-muted-foreground flex items-center gap-1.5">
                {meta && <span className={`w-1.5 h-1.5 rounded-full ${meta.tone}`} />}
                {slot.pos.toString().padStart(2, "0")}
              </div>
              <div className="col-span-3 font-display tracking-wide flex items-center gap-1.5 min-w-0">
                {slot.planet ? (
                  <>
                    <span className={`truncate ${meta?.color}`}>{slot.planet}</span>
                    {slot.moon && <Moon className="w-3 h-3 text-muted-foreground/70 shrink-0" />}
                    {slot.debris && <Recycle className="w-3 h-3 text-warning/80 shrink-0" />}
                  </>
                ) : (
                  <span className="text-muted-foreground/40">— vazio —</span>
                )}
              </div>
              <div className={`col-span-3 font-mono truncate ${slot.player ? meta?.color : "text-muted-foreground/40"}`}>
                {slot.player || "—"}
              </div>
              <div className="col-span-1 font-mono text-[10px] text-muted-foreground truncate">
                {slot.alliance ?? ""}
              </div>
              <div className="col-span-1 text-right font-mono tabular-nums text-muted-foreground">
                {slot.rank ? `#${slot.rank}` : ""}
              </div>
              <div className="col-span-1 text-center font-mono text-[10px]">
                {slot.player && (slot.activity === 0
                  ? <span className="text-deuterium">●</span>
                  : <span className="text-muted-foreground">{slot.activity}m</span>)}
              </div>
              <div className="col-span-2 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                {slot.player && (
                  <button
                    onClick={() => toggleFav(slot)}
                    title="Favoritar"
                    className={`p-1.5 bg-surface-elevated border border-border rounded ${isFav ? "text-warning border-warning/40" : "hover:border-warning hover:text-warning"}`}
                  >
                    <Star className={`w-3 h-3 ${isFav ? "fill-current" : ""}`} />
                  </button>
                )}
                {slot.player && slot.status !== "self" && (
                  <>
                    <button onClick={() => dispatch(slot, "Espionagem")} title="Espionar" className="p-1.5 bg-surface-elevated border border-border rounded hover:border-accent hover:text-accent">
                      <Eye className="w-3 h-3" />
                    </button>
                    <button onClick={() => dispatch(slot, "Ataque")} title="Atacar" className="p-1.5 bg-surface-elevated border border-border rounded hover:border-destructive hover:text-destructive">
                      <Crosshair className="w-3 h-3" />
                    </button>
                    <button onClick={() => dispatch(slot, "Transporte")} title="Enviar" className="p-1.5 bg-surface-elevated border border-border rounded hover:border-primary hover:text-primary">
                      <Send className="w-3 h-3" />
                    </button>
                  </>
                )}
                {slot.debris && (
                  <button onClick={() => dispatch(slot, "Reciclar")} title="Reciclar" className="p-1.5 bg-surface-elevated border border-border rounded hover:border-warning hover:text-warning">
                    <Recycle className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {visibleSlots.length === 0 && (
          <div className="px-4 py-12 text-center text-xs text-muted-foreground font-mono">
            Nenhum slot corresponde ao filtro
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 panel rounded-md p-3 flex flex-wrap gap-4 text-[10px] font-mono text-muted-foreground">
        {(["active", "inactive", "vacation", "noob", "strong", "banned"] as PlayerStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${statusMeta[s].tone}`} />
            <span className={statusMeta[s].color}>{statusMeta[s].label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5"><Moon className="w-3 h-3" /> Possui lua</div>
        <div className="flex items-center gap-1.5"><Recycle className="w-3 h-3 text-warning" /> Campo de destroços</div>
      </div>

      <GalaxySlotDetail
        slot={selected}
        galaxy={galaxy}
        system={system}
        onClose={() => setSelected(null)}
        onDispatch={(slot, m) => dispatch(slot, m as MissionType)}
      />

      <FleetDispatchDialog
        open={dispatchOpen}
        onClose={() => setDispatchOpen(false)}
        defaultTarget={dispatchTarget}
        defaultMission={dispatchMission}
      />
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: React.ReactNode; accent?: string }) {
  return (
    <div className="panel rounded-md px-4 py-3">
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-0.5">{label}</div>
      <div className={`font-display text-xl tabular-nums ${accent ?? ""}`}>{value}</div>
    </div>
  );
}
