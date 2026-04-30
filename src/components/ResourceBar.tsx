import { useEffect, useState } from "react";
import { initialResources, productionPerHour, type Resources } from "@/lib/game-data";

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return Math.floor(n).toString();
};

const ResourceItem = ({
  label, value, colorVar, prod,
}: { label: string; value: number; colorVar: string; prod: number }) => (
  <div className="flex items-center gap-3 px-4 py-2 border-r border-border last:border-r-0">
    <span
      className="w-2.5 h-2.5 rounded-full shrink-0"
      style={{ backgroundColor: `var(${colorVar})`, boxShadow: `0 0 8px var(${colorVar})` }}
    />
    <div className="flex flex-col leading-tight">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">{label}</span>
      <span className="font-mono text-sm font-semibold tabular-nums">{formatNumber(value)}</span>
    </div>
    {prod > 0 && (
      <span className="text-[10px] font-mono text-muted-foreground tabular-nums hidden lg:inline">
        +{formatNumber(prod)}/h
      </span>
    )}
  </div>
);

export function ResourceBar() {
  const [resources, setResources] = useState<Resources>(initialResources);

  useEffect(() => {
    const interval = setInterval(() => {
      setResources((r) => ({
        metal: r.metal + productionPerHour.metal / 3600,
        crystal: r.crystal + productionPerHour.crystal / 3600,
        deuterium: r.deuterium + productionPerHour.deuterium / 3600,
        energy: r.energy,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center bg-surface/80 backdrop-blur-sm border-b border-border">
      <ResourceItem label="Metal" value={resources.metal} colorVar="--metal" prod={productionPerHour.metal} />
      <ResourceItem label="Cristal" value={resources.crystal} colorVar="--crystal" prod={productionPerHour.crystal} />
      <ResourceItem label="Deutério" value={resources.deuterium} colorVar="--deuterium" prod={productionPerHour.deuterium} />
      <ResourceItem label="Energia" value={resources.energy} colorVar="--energy" prod={0} />
      <div className="ml-auto px-4 py-2 flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-display tracking-widest">PLANETA</span>
          <span className="font-mono text-foreground">[1:147:8]</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
      </div>
    </div>
  );
}
