import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, TrendingUp, Clock, Trophy, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { buildings, productionPerHour } from "@/lib/game-data";

export const Route = createFileRoute("/")({
  component: Overview,
  head: () => ({ meta: [{ title: "Visão Geral — OGAME" }] }),
});

const fmt = (n: number) => n.toLocaleString("pt-BR");

function StatCard({ label, value, sub, icon: Icon, color = "primary" }: any) {
  return (
    <div className="panel rounded-md p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
        <Icon className="w-full h-full" />
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-2xl font-display font-bold mt-1 tabular-nums text-${color}`}>{value}</div>
      <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}

function Overview() {
  const inProgress = buildings.filter((b) => b.building);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={LayoutDashboard} title="Visão Geral" subtitle="Status do planeta // Tempo real" code="[1:147:8]" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Pontos" value="1.24M" sub="↑ +12.4k hoje" icon={Trophy} color="accent" />
        <StatCard label="Ranking" value="#247" sub="Top 1% do universo" icon={TrendingUp} color="primary" />
        <StatCard label="Produção/h" value={fmt(productionPerHour.metal + productionPerHour.crystal)} sub="Recursos brutos" icon={TrendingUp} color="metal" />
        <StatCard label="Aliança" value="VOID" sub="14 membros" icon={Users} color="crystal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Construções ativas */}
        <div className="panel rounded-md p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm uppercase tracking-widest text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Construções Ativas
            </h2>
            <span className="text-[10px] font-mono text-muted-foreground">{inProgress.length} em curso</span>
          </div>

          <div className="space-y-3">
            {inProgress.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.id} className="bg-surface-elevated/40 rounded p-3 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded bg-surface border border-border flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-sm uppercase tracking-wider">{b.name} <span className="text-primary">→ Lv {b.level + 1}</span></div>
                      <div className="text-[10px] font-mono text-muted-foreground">Restam {b.building!.remaining}</div>
                    </div>
                    <button className="text-[10px] font-mono uppercase text-destructive hover:text-destructive/80">Cancelar</button>
                  </div>
                  <div className="h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent shimmer" style={{ width: `${b.building!.progress}%` }} />
                  </div>
                </div>
              );
            })}

            {inProgress.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground font-mono">Nenhuma construção em andamento.</div>
            )}
          </div>
        </div>

        {/* Eventos */}
        <div className="panel rounded-md p-5">
          <h2 className="font-display text-sm uppercase tracking-widest mb-4">Eventos da Frota</h2>
          <div className="space-y-3">
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
      </div>
    </div>
  );
}
