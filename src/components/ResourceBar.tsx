import { Pickaxe, Gem, Droplet, Zap, MapPin, TrendingUp, AlertTriangle, Bell } from "lucide-react";
import { useResources, capacity, energy } from "@/lib/resources-store";
import { productionPerHour } from "@/lib/game-data";
import { useLocation } from "@/lib/location-store";

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return Math.floor(n).toString();
};

const formatExact = (n: number) => Math.floor(n).toLocaleString("pt-BR");

interface ResourceItemProps {
  icon: any;
  label: string;
  value: number;
  colorVar: string;
  prod: number;
  cap?: number;
}

const ResourceItem = ({ icon: Icon, label, value, colorVar, prod, cap }: ResourceItemProps) => {
  const pct = cap ? Math.min(100, (value / cap) * 100) : 0;
  const full = pct > 92;
  const warning = pct > 80 && !full;

  return (
    <div
      className="group relative flex-1 min-w-0 px-3.5 py-2.5 border-r border-border transition-colors hover:bg-surface-elevated/40"
      title={`${label}: ${formatExact(value)}${cap ? ` / ${formatExact(cap)}` : ""}`}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, var(${colorVar}), transparent)` }}
      />

      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 border relative overflow-hidden"
          style={{
            borderColor: `color-mix(in oklab, var(${colorVar}) 50%, transparent)`,
            background: `color-mix(in oklab, var(${colorVar}) 10%, transparent)`,
            boxShadow: `inset 0 0 12px -4px var(${colorVar})`,
          }}
        >
          <Icon className="w-4 h-4 relative z-10" style={{ color: `var(${colorVar})` }} strokeWidth={1.8} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-display">
              {label}
            </span>
            {full && <AlertTriangle className="w-2.5 h-2.5 text-destructive animate-pulse" />}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-mono text-sm font-bold tabular-nums leading-tight ${
                full ? "text-destructive" : warning ? "text-warning" : "text-foreground"
              }`}
            >
              {formatNumber(value)}
            </span>
            {cap && (
              <span className="text-[9px] font-mono text-muted-foreground/70 tabular-nums">
                /{formatNumber(cap)}
              </span>
            )}
          </div>
          {cap && (
            <div className="h-0.5 bg-background/80 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: full
                    ? "var(--danger)"
                    : warning
                    ? "var(--warning)"
                    : `var(${colorVar})`,
                  boxShadow: `0 0 6px var(${full ? "--danger" : colorVar})`,
                }}
              />
            </div>
          )}
          {prod !== 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-2 h-2" style={{ color: `var(${colorVar})` }} />
              <span className="text-[9px] font-mono tabular-nums text-muted-foreground">
                {prod > 0 ? "+" : ""}{formatNumber(prod)}/h
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function ResourceBar() {
  const resources = useResources();
  const { planet, kind } = useLocation();
  const energyBalance = resources.energy;
  const energyDeficit = energyBalance < 0;
  const energyPct = Math.min(100, (energy.consumed / energy.produced) * 100);

  return (
    <div className="bg-surface/85 backdrop-blur-md border-b border-border sticky top-0 z-30">
      <div className="flex items-stretch">
        <ResourceItem icon={Pickaxe} label="Metal"    value={resources.metal}     colorVar="--metal"     prod={productionPerHour.metal}     cap={capacity.metal} />
        <ResourceItem icon={Gem}     label="Cristal"  value={resources.crystal}   colorVar="--crystal"   prod={productionPerHour.crystal}   cap={capacity.crystal} />
        <ResourceItem icon={Droplet} label="Deutério" value={resources.deuterium} colorVar="--deuterium" prod={productionPerHour.deuterium} cap={capacity.deuterium} />

        {/* Energy */}
        <div
          className={`group relative flex-1 min-w-0 px-3.5 py-2.5 border-r border-border transition-colors hover:bg-surface-elevated/40 ${
            energyDeficit ? "bg-destructive/5" : ""
          }`}
          title={`Energia: ${formatExact(energy.consumed)} / ${formatExact(energy.produced)}`}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-60"
            style={{ background: "linear-gradient(90deg, transparent, var(--energy), transparent)" }}
          />
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 border"
              style={{
                borderColor: `color-mix(in oklab, var(--energy) 50%, transparent)`,
                background: `color-mix(in oklab, var(--energy) 10%, transparent)`,
                boxShadow: "inset 0 0 12px -4px var(--energy)",
              }}
            >
              <Zap className="w-4 h-4" style={{ color: "var(--energy)" }} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-display">Energia</span>
                {energyDeficit && <AlertTriangle className="w-2.5 h-2.5 text-destructive animate-pulse" />}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`font-mono text-sm font-bold tabular-nums leading-tight ${energyDeficit ? "text-destructive" : "text-energy"}`}>
                  {energyBalance > 0 ? "+" : ""}{formatNumber(energyBalance)}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground/70 tabular-nums">GW</span>
              </div>
              <div className="h-0.5 bg-background/80 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${energyPct}%`,
                    background: energyDeficit ? "var(--danger)" : "var(--energy)",
                    boxShadow: `0 0 6px var(${energyDeficit ? "--danger" : "--energy"})`,
                  }}
                />
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] font-mono tabular-nums text-muted-foreground">
                  {formatNumber(energy.consumed)}/{formatNumber(energy.produced)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2 px-3.5 shrink-0">
          {/* Notifications */}
          <button
            className="relative w-9 h-9 rounded-md border border-border bg-background/40 hover:bg-surface-elevated text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
            title="Notificações"
          >
            <Bell className="w-4 h-4" strokeWidth={1.8} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          </button>

          {/* Location chip */}
          <div className="hidden md:flex items-center gap-2.5 h-9 px-3 rounded-md border border-border bg-background/40">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <div className="leading-tight">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-display">
                {kind === "moon" ? "Lua" : "Planeta"}
              </div>
              <div className="font-mono text-[11px] text-foreground flex items-center gap-1.5">
                {kind === "moon" ? planet.moonName : planet.name}
                <span className="text-primary tabular-nums">{planet.coords}</span>
              </div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-deuterium pulse-glow ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
