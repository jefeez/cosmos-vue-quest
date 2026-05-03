import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutDashboard, TrendingUp, Trophy, Users, Pickaxe, Gem, Droplet, Zap, Rocket, Shield, MessageSquare, Mail, Activity, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { QueuePanel } from "@/components/QueuePanel";
import { productionPerHour, ships, defenses } from "@/lib/game-data";
import { useResources, capacity, energy } from "@/lib/resources-store";

export const Route = createFileRoute("/")({
  component: Overview,
  head: () => ({ meta: [{ title: "Visão Geral — OGAME" }] }),
});

const fmt = (n: number) => n.toLocaleString("pt-BR");

function Overview() {
  const resources = useResources();
  const totalShips = ships.reduce((s, x) => s + x.count, 0);
  const totalAtk = ships.reduce((s, x) => s + x.count * x.attack, 0);
  const totalDef = defenses.reduce((s, x) => s + x.count, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={LayoutDashboard} title="Visão Geral" subtitle="Status do planeta // Tempo real" code="[1:147:8]" />

      {/* Top KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <KpiCard label="Pontos" value="1.24M" sub="↑ +12.4k hoje" icon={Trophy} color="accent" />
        <KpiCard label="Ranking" value="#247" sub="Top 1% do universo" icon={TrendingUp} color="primary" />
        <KpiCard label="Aliança" value="VOID" sub="14 membros • #18" icon={Users} color="crystal" />
        <KpiCard label="Atividade" value="ONLINE" sub="Sessão 02:14:33" icon={Activity} color="energy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Production overview */}
        <div className="panel rounded-md p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Produção & Armazéns
            </h2>
            <Link to="/buildings" className="text-[10px] font-mono uppercase tracking-wider text-primary hover:text-accent flex items-center gap-1">
              Otimizar <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            <ResourceRow icon={Pickaxe} label="Metal" value={resources.metal} cap={capacity.metal} prod={productionPerHour.metal} colorVar="--metal" />
            <ResourceRow icon={Gem} label="Cristal" value={resources.crystal} cap={capacity.crystal} prod={productionPerHour.crystal} colorVar="--crystal" />
            <ResourceRow icon={Droplet} label="Deutério" value={resources.deuterium} cap={capacity.deuterium} prod={productionPerHour.deuterium} colorVar="--deuterium" />
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-energy" />
                  <span className="text-xs font-display uppercase tracking-wider">Energia</span>
                </div>
                <span className={`font-mono text-xs tabular-nums ${resources.energy < 0 ? "text-destructive" : "text-energy"}`}>
                  {resources.energy > 0 ? "+" : ""}{fmt(resources.energy)} GW
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-surface-elevated/40 rounded px-2 py-1.5 flex justify-between">
                  <span className="text-muted-foreground uppercase">Produzido</span>
                  <span className="text-energy tabular-nums">{fmt(energy.produced)}</span>
                </div>
                <div className="bg-surface-elevated/40 rounded px-2 py-1.5 flex justify-between">
                  <span className="text-muted-foreground uppercase">Consumido</span>
                  <span className="text-warning tabular-nums">{fmt(energy.consumed)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Queue */}
        <QueuePanel title="Fila Ativa" />

        {/* Fleet & Defense */}
        <div className="panel rounded-md p-5">
          <h2 className="font-display text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" /> Frota Estacionada
          </h2>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <MiniStat label="Naves" value={fmt(totalShips)} color="text-accent" />
            <MiniStat label="Ataque" value={fmt(totalAtk)} color="text-destructive" />
            <MiniStat label="Slots" value="3 / 9" color="text-primary" />
          </div>
          <Link to="/fleet" className="block w-full text-center py-2 bg-surface-elevated/50 hover:bg-primary/15 border border-border hover:border-primary/40 rounded text-[11px] font-display uppercase tracking-wider text-primary transition-colors">
            Despachar Missão →
          </Link>
        </div>

        <div className="panel rounded-md p-5">
          <h2 className="font-display text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-crystal" /> Defesa Planetária
          </h2>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <MiniStat label="Unidades" value={fmt(totalDef)} color="text-crystal" />
            <MiniStat label="Cúpula" value="ON" color="text-accent" />
            <MiniStat label="Status" value="OK" color="text-accent" />
          </div>
          <Link to="/defense" className="block w-full text-center py-2 bg-surface-elevated/50 hover:bg-crystal/15 border border-border hover:border-crystal/40 rounded text-[11px] font-display uppercase tracking-wider text-crystal transition-colors">
            Reforçar Defesa →
          </Link>
        </div>

        {/* Events */}
        <div className="panel rounded-md p-5">
          <h2 className="font-display text-sm uppercase tracking-widest mb-3">Eventos da Frota</h2>
          <div className="space-y-2">
            {[
              { type: "Ataque", target: "[2:241:11]", time: "00:42:18", color: "destructive" },
              { type: "Espionagem", target: "[1:147:9]", time: "01:15:02", color: "accent" },
              { type: "Transporte", target: "[1:147:6]", time: "02:08:45", color: "primary" },
              { type: "Retorno", target: "Base", time: "03:22:11", color: "crystal" },
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between text-xs border-l-2 pl-3 py-1" style={{ borderColor: `var(--${e.color})` }}>
                <div>
                  <div className={`font-display uppercase tracking-wider text-${e.color}`}>{e.type}</div>
                  <div className="font-mono text-muted-foreground text-[10px]">→ {e.target}</div>
                </div>
                <div className="font-mono tabular-nums text-foreground">{e.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Comms */}
        <div className="panel rounded-md p-5 lg:col-span-2">
          <h2 className="font-display text-sm uppercase tracking-widest mb-3">Comunicações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { icon: Mail, kind: "Espionagem", who: "Recon-Δ", excerpt: "Coords [2:241:11] — 84M metal não defendido", color: "accent", new: true },
              { icon: MessageSquare, kind: "Aliança", who: "VOID/Krell", excerpt: "Ataque coordenado em 02:00. Confirmar presença.", color: "primary", new: true },
              { icon: Mail, kind: "Combate", who: "Sistema", excerpt: "Vitória em [3:108:4]. Destroços: 12k/8k.", color: "destructive", new: false },
              { icon: MessageSquare, kind: "Mercado", who: "Hub-7", excerpt: "Oferta: 50k cristal por 30k metal.", color: "crystal", new: false },
            ].map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className="bg-surface-elevated/40 rounded p-2.5 border border-border flex items-start gap-2.5 hover:border-primary/40 transition-colors cursor-pointer">
                  <div className={`w-7 h-7 rounded shrink-0 flex items-center justify-center bg-${m.color}/10 border border-${m.color}/30`}>
                    <Icon className={`w-3.5 h-3.5 text-${m.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-display uppercase tracking-wider text-${m.color}`}>{m.kind}</span>
                      {m.new && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                    </div>
                    <div className="font-mono text-[11px] text-foreground truncate">{m.who}</div>
                    <div className="text-[10px] text-muted-foreground line-clamp-1">{m.excerpt}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, icon: Icon, color = "primary" }: any) {
  return (
    <div className="panel rounded-md p-4 relative overflow-hidden group hover:border-primary/40 transition-colors">
      <div className="absolute -top-2 -right-2 w-20 h-20 opacity-[0.07] group-hover:opacity-20 transition-opacity">
        <Icon className="w-full h-full" />
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-2xl font-display font-bold mt-1 tabular-nums text-${color}`}>{value}</div>
      <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-surface-elevated/40 rounded px-2 py-1.5 text-center border border-border/60">
      <div className="text-[9px] font-mono uppercase text-muted-foreground tracking-wider">{label}</div>
      <div className={`font-mono text-xs font-bold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

function ResourceRow({ icon: Icon, label, value, cap, prod, colorVar }: any) {
  const pct = Math.min(100, (value / cap) * 100);
  const full = pct > 92;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" style={{ color: `var(${colorVar})` }} />
          <span className="text-xs font-display uppercase tracking-wider">{label}</span>
          <span className="text-[10px] font-mono text-accent tabular-nums">+{fmt(prod)}/h</span>
        </div>
        <span className={`font-mono text-xs tabular-nums ${full ? "text-destructive" : "text-foreground"}`}>
          {fmt(Math.floor(value))} <span className="text-muted-foreground">/ {fmt(cap)}</span>
        </span>
      </div>
      <div className="h-1.5 bg-background rounded-full overflow-hidden">
        <div
          className="h-full transition-all"
          style={{
            width: `${pct}%`,
            background: full ? "var(--danger)" : `linear-gradient(90deg, var(${colorVar}), var(--accent))`,
            boxShadow: `0 0 6px var(${colorVar})`,
          }}
        />
      </div>
    </div>
  );
}
