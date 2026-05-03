import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Globe2, Users, Zap, Rocket, Trophy, Calendar, Search, Sparkles, ArrowRight, Check, Crown, Languages, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UNIVERSES, JOINED_UNIVERSE_IDS, universeProgress, type Universe } from "@/lib/universes-data";
import { toast } from "sonner";

export const Route = createFileRoute("/universes")({
  component: UniversesPage,
  head: () => ({ meta: [{ title: "Universos — OGAME" }] }),
});

const themeMap = {
  amber: { ring: "from-primary/40 to-primary/0", dot: "bg-primary", text: "text-primary", glow: "shadow-primary/30" },
  crystal: { ring: "from-crystal/40 to-crystal/0", dot: "bg-crystal", text: "text-crystal", glow: "shadow-crystal/30" },
  deuterium: { ring: "from-deuterium/40 to-deuterium/0", dot: "bg-deuterium", text: "text-deuterium", glow: "shadow-deuterium/30" },
  energy: { ring: "from-energy/40 to-energy/0", dot: "bg-energy", text: "text-energy", glow: "shadow-energy/30" },
  destructive: { ring: "from-destructive/40 to-destructive/0", dot: "bg-destructive", text: "text-destructive", glow: "shadow-destructive/30" },
} as const;

function UniversesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "joined" | "new" | "pvp">("all");

  const filtered = useMemo(() => {
    return UNIVERSES.filter((u) => {
      if (query && !u.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (filter === "joined" && !JOINED_UNIVERSE_IDS.has(u.id)) return false;
      if (filter === "new" && u.tag !== "Novo") return false;
      if (filter === "pvp" && u.pvp !== "PvP") return false;
      return true;
    });
  }, [query, filter]);

  const joined = filtered.filter((u) => JOINED_UNIVERSE_IDS.has(u.id));
  const others = filtered.filter((u) => !JOINED_UNIVERSE_IDS.has(u.id));

  return (
    <div className="min-h-screen relative">
      {/* BG */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 80% 0%, oklch(0.28 0.12 50 / 0.4), transparent 50%), radial-gradient(circle at 10% 100%, oklch(0.25 0.15 220 / 0.35), transparent 55%), linear-gradient(180deg, oklch(0.14 0.005 60), oklch(0.10 0.005 60))",
        }}
      />
      <div className="fixed inset-0 -z-10 scanline pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              // Comando central
            </div>
            <h1 className="text-4xl font-display font-bold flex items-center gap-3">
              <Globe2 className="w-8 h-8 text-primary" />
              Selecione um universo
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Cada universo é um servidor independente. Continue suas operações ou inicie uma nova jornada em outro setor.
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Trocar conta
          </button>
        </div>

        {/* Search & filters */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar universo…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-10 bg-surface/50"
            />
          </div>
          <div className="flex items-center gap-1 panel rounded-md p-1">
            {([
              { k: "all", l: "Todos" },
              { k: "joined", l: "Meus" },
              { k: "new", l: "Novos" },
              { k: "pvp", l: "PvP" },
            ] as const).map((f) => (
              <button
                key={f.k}
                onClick={() => setFilter(f.k)}
                className={`px-3 h-8 rounded text-[10px] font-mono uppercase tracking-widest transition-colors ${
                  filter === f.k
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <Filter className="w-3 h-3" />
            {filtered.length} resultados
          </div>
        </div>

        {/* Joined section */}
        {joined.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-4 h-4 text-accent" />
              <h2 className="text-display font-bold tracking-widest text-sm uppercase">Suas operações ativas</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {joined.length} universo(s)
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {joined.map((u) => (
                <UniverseCard key={u.id} universe={u} joined onEnter={() => enter(u, navigate, true)} />
              ))}
            </div>
          </section>
        )}

        {/* Others */}
        {others.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-display font-bold tracking-widest text-sm uppercase text-muted-foreground">
                Universos disponíveis
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {others.map((u) => (
                <UniverseCard key={u.id} universe={u} onEnter={() => enter(u, navigate, false)} />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            Nenhum universo corresponde aos filtros.
          </div>
        )}
      </div>
    </div>
  );
}

function enter(u: Universe, navigate: ReturnType<typeof useNavigate>, joined: boolean) {
  toast.success(`Conectando ao universo ${u.name}…`, {
    description: joined ? "Restaurando seu estado de jogo." : "Inicializando colônia natal.",
  });
  setTimeout(() => navigate({ to: "/" }), 600);
}

function UniverseCard({
  universe,
  joined,
  onEnter,
}: {
  universe: Universe;
  joined?: boolean;
  onEnter: () => void;
}) {
  const t = themeMap[universe.theme];
  const fillPct = Math.round((universe.players / universe.maxPlayers) * 100);
  const progress = universeProgress[universe.id];

  return (
    <div
      className={`group relative panel rounded-lg overflow-hidden transition-all hover:-translate-y-0.5 ${
        joined ? `ring-1 ring-primary/30 shadow-lg ${t.glow}` : "hover:border-primary/30"
      }`}
    >
      {/* Themed top accent */}
      <div className={`h-1 w-full bg-gradient-to-r ${t.ring}`} />

      {/* Glow orb */}
      <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-radial ${t.ring} opacity-40 blur-2xl pointer-events-none`} />

      <div className="p-5 relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`relative w-12 h-12 rounded-full ${t.dot} flex items-center justify-center shadow-lg ${t.glow}`}>
              <Globe2 className="w-6 h-6 text-background" />
              {joined && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-deuterium border-2 border-background flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-background" strokeWidth={3} />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-display font-bold">{universe.name}</h3>
                {universe.tag && (
                  <span
                    className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      universe.tag === "Novo"
                        ? "bg-deuterium/20 text-deuterium border border-deuterium/40"
                        : universe.tag === "Brutal"
                        ? "bg-destructive/20 text-destructive border border-destructive/40"
                        : "bg-warning/20 text-warning border border-warning/40"
                    }`}
                  >
                    {universe.tag}
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">
                {universe.galaxies} galáxias • <Languages className="inline w-3 h-3 -mt-0.5" /> {universe.language}
              </div>
            </div>
          </div>

          <span
            className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded border ${
              universe.pvp === "PvP"
                ? "bg-destructive/10 text-destructive border-destructive/30"
                : universe.pvp === "Pacífico"
                ? "bg-deuterium/10 text-deuterium border-deuterium/30"
                : "bg-warning/10 text-warning border-warning/30"
            }`}
          >
            {universe.pvp}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">{universe.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Stat icon={Zap} label="Eco" value={`x${universe.speed}`} />
          <Stat icon={Rocket} label="Frota" value={`x${universe.fleetSpeed}`} />
          <Stat icon={Calendar} label="Idade" value={universe.age} />
        </div>

        {/* Population bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
            <span className="flex items-center gap-1.5">
              <Users className="w-3 h-3" /> População
            </span>
            <span>
              {universe.players.toLocaleString("pt-BR")} / {universe.maxPlayers.toLocaleString("pt-BR")}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden">
            <div
              className={`h-full ${t.dot} transition-all`}
              style={{ width: `${Math.min(fillPct, 100)}%` }}
            />
          </div>
        </div>

        {joined && progress && (
          <div className="grid grid-cols-3 gap-2 mb-4 p-2.5 rounded-md bg-primary/5 border border-primary/20">
            <ProgressStat icon={Trophy} label="Rank" value={`#${progress.rank}`} />
            <ProgressStat label="Pontos" value={progress.points} />
            <ProgressStat label="Planetas" value={String(progress.planets)} />
          </div>
        )}

        <Button
          onClick={onEnter}
          className={`w-full h-10 font-display tracking-wider uppercase text-xs ${
            joined
              ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
              : "bg-surface-elevated hover:bg-primary/20 hover:text-primary border border-border hover:border-primary/40"
          }`}
        >
          {joined ? (
            <>
              Continuar comando <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Iniciar colonização <Rocket className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface-elevated/50 border border-border px-2.5 py-2">
      <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="text-sm font-display font-bold mt-0.5">{value}</div>
    </div>
  );
}

function ProgressStat({ icon: Icon, label, value }: { icon?: any; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </div>
      <div className="text-sm font-display font-bold text-primary">{value}</div>
    </div>
  );
}
