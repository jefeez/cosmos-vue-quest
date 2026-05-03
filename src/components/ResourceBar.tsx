import { Pickaxe, Gem, Droplet, Zap } from "lucide-react";
import { useResources, capacity, energy } from "@/lib/resources-store";
import { productionPerHour } from "@/lib/game-data";
import { useLocation } from "@/lib/location-store";

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return Math.floor(n).toString();
};

const ResourceItem = ({
  icon: Icon, label, value, colorVar, prod, cap,
}: { icon: any; label: string; value: number; colorVar: string; prod: number; cap?: number }) => {
  const pct = cap ? Math.min(100, (value / cap) * 100) : 0;
  const full = pct > 92;
  return (
    <div className="flex-1 min-w-0 px-3 py-2 border-r border-border last:border-r-0 group hover:bg-surface-elevated/30 transition-colors">
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded flex items-center justify-center shrink-0 border"
          style={{ borderColor: `var(${colorVar})`, background: `color-mix(in oklab, var(${colorVar}) 12%, transparent)` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: `var(${colorVar})` }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-display">{label}</span>
            {prod !== 0 && (
              <span className={`text-[9px] font-mono tabular-nums ${prod > 0 ? "text-accent" : "text-destructive"}`}>
                {prod > 0 ? "+" : ""}{formatNumber(prod)}/h
              </span>
            )}
          </div>
          <div className="font-mono text-sm font-semibold tabular-nums text-foreground leading-tight">
            {formatNumber(value)}
            {cap && <span className="text-[9px] text-muted-foreground"> / {formatNumber(cap)}</span>}
          </div>
          {cap && (
            <div className="h-0.5 bg-background rounded-full mt-1 overflow-hidden">
              <div
                className="h-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: full ? "var(--danger)" : `var(${colorVar})`,
                  boxShadow: `0 0 4px var(${colorVar})`,
                }}
              />
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

  return (
    <div className="bg-surface/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-stretch">
        <ResourceItem icon={Pickaxe} label="Metal" value={resources.metal} colorVar="--metal" prod={productionPerHour.metal} cap={capacity.metal} />
        <ResourceItem icon={Gem} label="Cristal" value={resources.crystal} colorVar="--crystal" prod={productionPerHour.crystal} cap={capacity.crystal} />
        <ResourceItem icon={Droplet} label="Deutério" value={resources.deuterium} colorVar="--deuterium" prod={productionPerHour.deuterium} cap={capacity.deuterium} />

        {/* Energy is special */}
        <div className={`flex-1 min-w-0 px-3 py-2 border-r border-border ${energyDeficit ? "bg-destructive/5" : ""}`}>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded flex items-center justify-center shrink-0 border"
              style={{ borderColor: `var(--energy)`, background: "color-mix(in oklab, var(--energy) 12%, transparent)" }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: `var(--energy)` }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-display">Energia</span>
                <span className="text-[9px] font-mono text-muted-foreground tabular-nums">{formatNumber(energy.consumed)}/{formatNumber(energy.produced)}</span>
              </div>
              <div className={`font-mono text-sm font-semibold tabular-nums leading-tight ${energyDeficit ? "text-destructive" : "text-energy"}`}>
                {energyBalance > 0 ? "+" : ""}{formatNumber(energyBalance)}
              </div>
              <div className="h-0.5 bg-background rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${Math.min(100, (energy.consumed / energy.produced) * 100)}%`,
                    background: energyDeficit ? "var(--danger)" : "var(--energy)",
                    boxShadow: "0 0 4px var(--energy)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location chip */}
        <div className="px-4 flex items-center gap-3 shrink-0">
          <div className="hidden md:flex flex-col items-end leading-tight">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-display">{kind === "moon" ? "Lua" : "Planeta"}</span>
            <span className="font-mono text-xs text-foreground">{kind === "moon" ? planet.moonName : planet.name}</span>
            <span className="font-mono text-[10px] text-primary tabular-nums">{planet.coords}</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
        </div>
      </div>
    </div>
  );
}
