import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard, TrendingUp, Trophy, Users, Pickaxe, Gem, Droplet, Zap,
  Rocket, Shield, MessageSquare, Mail, Activity, ArrowUpRight, Crown, Swords,
  Building2, FlaskConical, Telescope, Radio, Calendar, Target, Sparkles, ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { QueuePanel } from "@/components/QueuePanel";
import { productionPerHour, ships, defenses } from "@/lib/game-data";
import { useResources, capacity, energy } from "@/lib/resources-store";

export const Route = createFileRoute("/")({
  component: Overview,
  head: () => ({ meta: [{ title: "Visão Geral — OGAME" }] }),
});

const fmt = (n: number) => Math.floor(n).toLocaleString("pt-BR");
const fmtShort = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return Math.floor(n).toString();
};

function Overview() {
  const resources = useResources();
  const totalShips = ships.reduce((s, x) => s + x.count, 0);
  const totalAtk = ships.reduce((s, x) => s + x.count * x.attack, 0);
  const totalDef = defenses.reduce((s, x) => s + x.count, 0);
  const totalShield = defenses.reduce((s, x) => s + x.count * x.shield, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <PageHeader icon={LayoutDashboard} title="Visão Geral" subtitle="Status do planeta // Tempo real" code="[1:147:8]" />

      {/* Hero KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Pontos" value="1.24M" sub="+12.4k hoje" icon={Trophy} theme="amber" trend="up" />
        <KpiCard label="Ranking" value="#247" sub="Top 1% do universo" icon={TrendingUp} theme="primary" trend="up" />
        <KpiCard label="Aliança" value="VOID" sub="14 membros • #18" icon={Users} theme="crystal" />
        <KpiCard label="Sessão" value="ONLINE" sub="02:14:33 ativo" icon={Activity} theme="deuterium" pulse />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Production overview */}
        <Panel className="lg:col-span-2" theme="amber">
          <PanelHeader
            icon={TrendingUp}
            title="Produção & Armazéns"
            theme="amber"
            action={<HeaderLink to="/buildings" label="Otimizar" />}
          />

          <div className="space-y-3">
            <ResourceRow icon={Pickaxe} label="Metal"    value={resources.metal}     cap={capacity.metal}     prod={productionPerHour.metal}     colorVar="--metal" />
            <ResourceRow icon={Gem}     label="Cristal"  value={resources.crystal}   cap={capacity.crystal}   prod={productionPerHour.crystal}   colorVar="--crystal" />
            <ResourceRow icon={Droplet} label="Deutério" value={resources.deuterium} cap={capacity.deuterium} prod={productionPerHour.deuterium} colorVar="--deuterium" />

            {/* Energy */}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-energy" />
                  <span className="text-xs font-display uppercase tracking-wider">Balanço Energético</span>
                </div>
                <span className={`font-mono text-sm font-bold tabular-nums ${resources.energy < 0 ? "text-destructive" : "text-energy"}`}>
                  {resources.energy > 0 ? "+" : ""}{fmt(resources.energy)} GW
                </span>
              </div>

              {/* Bidirectional bar */}
              <div className="relative h-2 bg-background rounded-full overflow-hidden mb-2">
                <div
                  className="absolute left-0 top-0 h-full bg-energy transition-all"
                  style={{ width: `${(energy.consumed / energy.produced) * 100}%`, boxShadow: "0 0 6px var(--energy)" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <MiniBox label="Produzido" value={fmt(energy.produced)} colorClass="text-energy" />
                <MiniBox label="Consumido" value={fmt(energy.consumed)} colorClass="text-warning" />
              </div>
            </div>
          </div>
        </Panel>

        {/* Queue */}
        <QueuePanel title="Fila Ativa" />

        {/* Fleet */}
        <Panel theme="crystal">
          <PanelHeader
            icon={Rocket}
            title="Frota Estacionada"
            theme="crystal"
            action={<HeaderLink to="/fleet" label="Despachar" theme="crystal" />}
          />
          <div className="grid grid-cols-3 gap-2 mb-3">
            <MiniStat label="Naves"   value={fmt(totalShips)} theme="crystal" icon={Rocket} />
            <MiniStat label="Ataque"  value={fmtShort(totalAtk)} theme="destructive" icon={Swords} />
            <MiniStat label="Slots"   value="3 / 9" theme="amber" icon={Target} />
          </div>
          <div className="space-y-1">
            {ships.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between text-[11px] font-mono py-1 border-b border-border/40 last:border-0">
                <span className="text-muted-foreground truncate">{s.name}</span>
                <span className="text-foreground tabular-nums">{fmt(s.count)}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Defense */}
        <Panel theme="destructive">
          <PanelHeader
            icon={Shield}
            title="Defesa Planetária"
            theme="destructive"
            action={<HeaderLink to="/defense" label="Reforçar" theme="destructive" />}
          />
          <div className="grid grid-cols-3 gap-2 mb-3">
            <MiniStat label="Unidades" value={fmt(totalDef)} theme="destructive" icon={Shield} />
            <MiniStat label="Escudo" value={fmtShort(totalShield)} theme="crystal" icon={Shield} />
            <MiniStat label="Cúpula" value="ON" theme="deuterium" icon={Sparkles} />
          </div>
          <div className="rounded-md bg-deuterium/10 border border-deuterium/30 p-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-deuterium pulse-glow" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-deuterium">
              Sistema operacional
            </span>
            <span className="ml-auto text-[10px] font-mono text-muted-foreground">100% INTEG.</span>
          </div>
        </Panel>

        {/* Events */}
        <Panel theme="amber">
          <PanelHeader icon={Calendar} title="Eventos da Frota" theme="amber" badge="4" />
          <div className="space-y-1.5">
            {[
              { type: "Ataque",      target: "[2:241:11]", time: "00:42:18", color: "destructive", icon: Swords },
              { type: "Espionagem",  target: "[1:147:9]",  time: "01:15:02", color: "accent",      icon: Telescope },
              { type: "Transporte",  target: "[1:147:6]",  time: "02:08:45", color: "primary",     icon: Rocket },
              { type: "Retorno",     target: "Base",       time: "03:22:11", color: "crystal",     icon: Rocket },
            ].map((e, i) => {
              const Icon = e.icon;
              return (
                <div key={i} className="flex items-center gap-2.5 py-1.5 px-2 rounded hover:bg-surface-elevated/40 transition-colors group">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border bg-${e.color}/10 border-${e.color}/30`}
                  >
                    <Icon className={`w-3.5 h-3.5 text-${e.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[10px] font-display uppercase tracking-wider text-${e.color}`}>{e.type}</div>
                    <div className="font-mono text-[10px] text-muted-foreground truncate">→ {e.target}</div>
                  </div>
                  <div className="font-mono text-xs tabular-nums text-foreground">{e.time}</div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Comms */}
        <Panel className="lg:col-span-2" theme="deuterium">
          <PanelHeader
            icon={Radio}
            title="Comunicações"
            theme="deuterium"
            badge="2 NOVAS"
            action={<HeaderLink to="/" label="Ver todas" theme="deuterium" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { icon: Mail, kind: "Espionagem", who: "Recon-Δ",      excerpt: "Coords [2:241:11] — 84M metal não defendido", color: "accent",      isNew: true,  time: "12m" },
              { icon: MessageSquare, kind: "Aliança", who: "VOID/Krell", excerpt: "Ataque coordenado em 02:00. Confirmar presença.", color: "primary",     isNew: true,  time: "47m" },
              { icon: Mail, kind: "Combate", who: "Sistema",          excerpt: "Vitória em [3:108:4]. Destroços: 12k/8k.",   color: "destructive", isNew: false, time: "2h" },
              { icon: MessageSquare, kind: "Mercado", who: "Hub-7",   excerpt: "Oferta: 50k cristal por 30k metal.",         color: "crystal",     isNew: false, time: "5h" },
            ].map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={i}
                  className={`relative bg-surface-elevated/40 rounded-md p-2.5 border ${m.isNew ? `border-${m.color}/40` : "border-border"} flex items-start gap-2.5 hover:border-${m.color}/60 hover:-translate-y-0.5 transition-all cursor-pointer`}
                >
                  {m.isNew && <div className={`absolute -top-px left-0 right-0 h-px bg-${m.color}`} />}
                  <div className={`w-8 h-8 rounded-md shrink-0 flex items-center justify-center bg-${m.color}/10 border border-${m.color}/30`}>
                    <Icon className={`w-4 h-4 text-${m.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-display uppercase tracking-wider text-${m.color}`}>{m.kind}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-muted-foreground">{m.time}</span>
                        {m.isNew && <span className={`w-1.5 h-1.5 rounded-full bg-${m.color} pulse-glow`} />}
                      </div>
                    </div>
                    <div className="font-mono text-[11px] text-foreground truncate">{m.who}</div>
                    <div className="text-[10px] text-muted-foreground line-clamp-1">{m.excerpt}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Quick links / Empire snapshot */}
        <Panel theme="primary">
          <PanelHeader icon={Crown} title="Império" theme="primary" />
          <div className="space-y-2">
            {[
              { icon: Building2, label: "Edifícios", value: "60 níveis", to: "/buildings", theme: "metal" },
              { icon: FlaskConical, label: "Pesquisas", value: "45 níveis", to: "/research", theme: "deuterium" },
              { icon: Rocket, label: "Hangar", value: `${fmt(totalShips)} naves`, to: "/shipyard", theme: "crystal" },
              { icon: Shield, label: "Defesa", value: `${fmt(totalDef)} und.`, to: "/defense", theme: "destructive" },
            ].map((q) => {
              const Icon = q.icon;
              return (
                <Link
                  key={q.to}
                  to={q.to}
                  className={`flex items-center gap-2.5 p-2 rounded-md bg-surface-elevated/40 border border-border hover:border-${q.theme}/40 hover:bg-surface-elevated/70 transition-colors group`}
                >
                  <div className={`w-7 h-7 rounded-md bg-${q.theme}/15 border border-${q.theme}/30 flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 text-${q.theme}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-display uppercase tracking-wider text-foreground">{q.label}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{q.value}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ----------- Components ----------- */

const themeColors: Record<string, { dot: string; text: string; bg: string; border: string; ring: string; glow: string }> = {
  primary:     { dot: "bg-primary",     text: "text-primary",     bg: "bg-primary/10",     border: "border-primary/30",     ring: "from-primary/40",     glow: "shadow-primary/20" },
  amber:       { dot: "bg-accent",      text: "text-accent",      bg: "bg-accent/10",      border: "border-accent/30",      ring: "from-accent/40",      glow: "shadow-accent/20" },
  crystal:     { dot: "bg-crystal",     text: "text-crystal",     bg: "bg-crystal/10",     border: "border-crystal/30",     ring: "from-crystal/40",     glow: "shadow-crystal/20" },
  deuterium:   { dot: "bg-deuterium",   text: "text-deuterium",   bg: "bg-deuterium/10",   border: "border-deuterium/30",   ring: "from-deuterium/40",   glow: "shadow-deuterium/20" },
  destructive: { dot: "bg-destructive", text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", ring: "from-destructive/40", glow: "shadow-destructive/20" },
};

function Panel({ children, className = "", theme = "primary" }: { children: React.ReactNode; className?: string; theme?: keyof typeof themeColors }) {
  const t = themeColors[theme];
  return (
    <div className={`panel rounded-lg overflow-hidden relative ${className}`}>
      <div className={`h-1 w-full bg-gradient-to-r ${t.ring} to-transparent`} />
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-radial from-current to-transparent opacity-10 blur-2xl pointer-events-none" />
      <div className="p-4 relative">{children}</div>
    </div>
  );
}

function PanelHeader({
  icon: Icon, title, theme = "primary", action, badge,
}: {
  icon: any; title: string; theme?: keyof typeof themeColors; action?: React.ReactNode; badge?: string;
}) {
  const t = themeColors[theme];
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-display text-xs uppercase tracking-widest flex items-center gap-2">
        <div className={`w-7 h-7 rounded-md ${t.bg} border ${t.border} flex items-center justify-center`}>
          <Icon className={`w-3.5 h-3.5 ${t.text}`} />
        </div>
        {title}
        {badge && (
          <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${t.bg} ${t.text} border ${t.border}`}>
            {badge}
          </span>
        )}
      </h2>
      {action}
    </div>
  );
}

function HeaderLink({ to, label, theme = "primary" }: { to: string; label: string; theme?: keyof typeof themeColors }) {
  const t = themeColors[theme];
  return (
    <Link to={to} className={`text-[10px] font-mono uppercase tracking-wider ${t.text} hover:opacity-80 flex items-center gap-1`}>
      {label} <ArrowUpRight className="w-3 h-3" />
    </Link>
  );
}

function KpiCard({
  label, value, sub, icon: Icon, theme = "primary", trend, pulse,
}: {
  label: string; value: string; sub?: string; icon: any; theme?: keyof typeof themeColors; trend?: "up" | "down"; pulse?: boolean;
}) {
  const t = themeColors[theme];
  return (
    <div className={`panel rounded-lg p-4 relative overflow-hidden group hover:-translate-y-0.5 transition-all ${t.border.replace("border-", "hover:border-")}`}>
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${t.ring} to-transparent`} />
      <div className="absolute -top-2 -right-2 w-20 h-20 opacity-[0.06] group-hover:opacity-20 transition-opacity">
        <Icon className="w-full h-full" />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
        {pulse && <div className={`w-1.5 h-1.5 rounded-full ${t.dot} pulse-glow`} />}
      </div>
      <div className={`text-2xl font-display font-bold mt-1 tabular-nums ${t.text}`}>{value}</div>
      {sub && (
        <div className="text-[10px] font-mono text-muted-foreground mt-0.5 flex items-center gap-1">
          {trend === "up" && <TrendingUp className="w-2.5 h-2.5 text-deuterium" />}
          {sub}
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, theme, icon: Icon }: { label: string; value: string; theme: keyof typeof themeColors; icon: any }) {
  const t = themeColors[theme];
  return (
    <div className={`rounded-md ${t.bg} border ${t.border} px-2 py-1.5`}>
      <div className="flex items-center justify-between mb-0.5">
        <Icon className={`w-3 h-3 ${t.text}`} />
        <span className="text-[8px] font-mono uppercase text-muted-foreground tracking-wider">{label}</span>
      </div>
      <div className={`font-mono text-xs font-bold tabular-nums ${t.text}`}>{value}</div>
    </div>
  );
}

function MiniBox({ label, value, colorClass }: { label: string; value: string; colorClass: string }) {
  return (
    <div className="bg-surface-elevated/40 rounded px-2 py-1.5 flex justify-between border border-border/50">
      <span className="text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className={`${colorClass} tabular-nums font-bold`}>{value}</span>
    </div>
  );
}

function ResourceRow({ icon: Icon, label, value, cap, prod, colorVar }: any) {
  const pct = Math.min(100, (value / cap) * 100);
  const full = pct > 92;
  const warn = pct > 80 && !full;
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center border"
            style={{
              borderColor: `color-mix(in oklab, var(${colorVar}) 50%, transparent)`,
              background: `color-mix(in oklab, var(${colorVar}) 12%, transparent)`,
            }}
          >
            <Icon className="w-3 h-3" style={{ color: `var(${colorVar})` }} />
          </div>
          <span className="text-xs font-display uppercase tracking-wider">{label}</span>
          <span className="text-[10px] font-mono tabular-nums" style={{ color: `var(${colorVar})` }}>
            +{fmt(prod)}/h
          </span>
        </div>
        <span className={`font-mono text-xs tabular-nums ${full ? "text-destructive" : warn ? "text-warning" : "text-foreground"}`}>
          {fmt(value)} <span className="text-muted-foreground/70">/ {fmtShort(cap)}</span>
        </span>
      </div>
      <div className="h-1.5 bg-background rounded-full overflow-hidden relative">
        <div
          className="h-full transition-all relative"
          style={{
            width: `${pct}%`,
            background: full ? "var(--danger)" : warn ? "var(--warning)" : `linear-gradient(90deg, var(${colorVar}), var(--accent))`,
            boxShadow: `0 0 6px var(${colorVar})`,
          }}
        />
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-[9px] font-mono text-muted-foreground/60">{pct.toFixed(0)}%</span>
        {full && <span className="text-[9px] font-mono text-destructive uppercase tracking-wider">cheio</span>}
        {warn && <span className="text-[9px] font-mono text-warning uppercase tracking-wider">quase cheio</span>}
      </div>
    </div>
  );
}
