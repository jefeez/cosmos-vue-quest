import { createFileRoute } from "@tanstack/react-router";
import { Globe2, Search, Crosshair, Eye, Send } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";

export const Route = createFileRoute("/galaxy")({
  component: GalaxyPage,
  head: () => ({ meta: [{ title: "Galáxia — OGAME" }] }),
});

interface Slot {
  pos: number;
  player?: string;
  planet?: string;
  rank?: number;
  status?: "active" | "inactive" | "vacation" | "self";
  moon?: boolean;
  debris?: { metal: number; crystal: number };
}

const generateSystem = (): Slot[] => {
  const slots: Slot[] = [];
  const data: Record<number, Partial<Slot>> = {
    3: { player: "Vortex", planet: "Nebulon", rank: 142, status: "active" },
    5: { player: "Kazon", planet: "Helios IX", rank: 89, status: "inactive", debris: { metal: 12000, crystal: 4500 } },
    7: { player: "Drax", planet: "Cinder", rank: 412, status: "vacation", moon: true },
    8: { player: "Krix (você)", planet: "Forja", rank: 247, status: "self", moon: true },
    9: { player: "Nyx", planet: "Vesper", rank: 67, status: "active" },
    12: { player: "Volk", planet: "Atrium", rank: 1024, status: "active" },
  };
  for (let i = 1; i <= 15; i++) {
    slots.push({ pos: i, ...(data[i] || {}) });
  }
  return slots;
};

const statusColor = {
  active: "text-foreground",
  inactive: "text-muted-foreground italic",
  vacation: "text-crystal",
  self: "text-primary font-bold",
};

function GalaxyPage() {
  const [galaxy, setGalaxy] = useState(1);
  const [system, setSystem] = useState(147);
  const slots = generateSystem();

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader icon={Globe2} title="Galáxia" subtitle="Mapa estelar interativo" code={`G${galaxy}:S${system}`} />

      {/* Navigation */}
      <div className="panel rounded-md p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Galáxia</label>
          <input type="number" value={galaxy} onChange={(e) => setGalaxy(+e.target.value)}
            className="w-16 bg-surface-elevated border border-border rounded px-2 py-1 text-sm font-mono text-center focus:outline-none focus:border-primary" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Sistema</label>
          <input type="number" value={system} onChange={(e) => setSystem(+e.target.value)}
            className="w-20 bg-surface-elevated border border-border rounded px-2 py-1 text-sm font-mono text-center focus:outline-none focus:border-primary" />
        </div>
        <button onClick={() => setSystem(system - 1)} className="px-3 py-1 bg-surface-elevated border border-border rounded text-xs font-mono hover:border-primary">◀ Anterior</button>
        <button onClick={() => setSystem(system + 1)} className="px-3 py-1 bg-surface-elevated border border-border rounded text-xs font-mono hover:border-primary">Próximo ▶</button>
        <button className="ml-auto px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-display uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" /> Buscar
        </button>
      </div>

      {/* System grid */}
      <div className="panel rounded-md overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-surface-elevated/60 border-b border-border text-[10px] font-display uppercase tracking-widest text-muted-foreground">
          <div className="col-span-1">Pos</div>
          <div className="col-span-3">Planeta</div>
          <div className="col-span-3">Jogador</div>
          <div className="col-span-1 text-right">Rank</div>
          <div className="col-span-2">Destroços</div>
          <div className="col-span-2 text-right">Ações</div>
        </div>

        {slots.map((slot) => (
          <div key={slot.pos}
            className={`grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-border/50 text-xs items-center transition-colors hover:bg-surface-elevated/40 ${slot.status === "self" ? "bg-primary/5" : ""}`}>
            <div className="col-span-1 font-mono text-muted-foreground">{slot.pos.toString().padStart(2, "0")}</div>
            <div className="col-span-3 font-display tracking-wide flex items-center gap-1.5">
              {slot.planet ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-crystal/70" />
                  <span className={statusColor[slot.status!]}>{slot.planet}</span>
                  {slot.moon && <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60" title="Lua" />}
                </>
              ) : <span className="text-muted-foreground/40">— vazio —</span>}
            </div>
            <div className={`col-span-3 font-mono ${slot.player ? statusColor[slot.status!] : "text-muted-foreground/40"}`}>
              {slot.player || "—"}
            </div>
            <div className="col-span-1 text-right font-mono tabular-nums text-muted-foreground">{slot.rank || ""}</div>
            <div className="col-span-2 font-mono text-[11px] tabular-nums">
              {slot.debris ? (
                <span className="text-warning">M:{slot.debris.metal/1000}k · C:{slot.debris.crystal/1000}k</span>
              ) : ""}
            </div>
            <div className="col-span-2 flex justify-end gap-1.5">
              {slot.player && slot.status !== "self" && (
                <>
                  <button title="Espionar" className="p-1.5 bg-surface-elevated border border-border rounded hover:border-accent hover:text-accent"><Eye className="w-3 h-3" /></button>
                  <button title="Atacar" className="p-1.5 bg-surface-elevated border border-border rounded hover:border-destructive hover:text-destructive"><Crosshair className="w-3 h-3" /></button>
                  <button title="Enviar" className="p-1.5 bg-surface-elevated border border-border rounded hover:border-primary hover:text-primary"><Send className="w-3 h-3" /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
