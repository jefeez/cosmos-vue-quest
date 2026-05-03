import { useMemo } from "react";
import { Moon, Recycle, Star } from "lucide-react";
import { planetTypeMeta, statusMeta, type PlanetSlot } from "@/lib/galaxy-data";

interface Props {
  slots: PlanetSlot[];
  galaxy: number;
  system: number;
  favorites: Set<string>;
  onSelect: (slot: PlanetSlot) => void;
}

const SIZE = 720; // svg viewport
const CX = SIZE / 2;
const CY = SIZE / 2;
const STAR_R = 34;
const ORBIT_MIN = 60;
const ORBIT_MAX = SIZE / 2 - 24;

export function SystemOrbitView({ slots, galaxy, system, favorites, onSelect }: Props) {
  // Distribute orbits evenly between min and max for 15 positions
  const orbits = useMemo(
    () => Array.from({ length: 15 }, (_, i) => ORBIT_MIN + ((ORBIT_MAX - ORBIT_MIN) * i) / 14),
    [],
  );

  // Deterministic angle per position+seed so it stays static across re-renders
  const angleFor = (pos: number) => {
    const seed = (galaxy * 31 + system * 7 + pos * 53) % 360;
    return seed;
  };

  return (
    <div className="panel rounded-md overflow-hidden relative">
      {/* Backdrop nebula */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, oklch(0.35 0.12 280 / 0.35), transparent 55%)," +
            "radial-gradient(ellipse at 75% 75%, oklch(0.4 0.14 30 / 0.3), transparent 55%)," +
            "radial-gradient(ellipse at 50% 50%, oklch(0.18 0.02 60 / 0.6), oklch(0.12 0.005 60) 80%)",
        }}
      />
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <Starfield />
      </div>

      <div className="relative w-full" style={{ aspectRatio: "1 / 1", maxHeight: 720 }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full block">
          {/* Orbit rings */}
          {orbits.map((r, i) => (
            <circle
              key={i}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="oklch(0.7 0.02 60 / 0.12)"
              strokeWidth={1}
              strokeDasharray="2 4"
            />
          ))}

          {/* Star (sun) */}
          <defs>
            <radialGradient id="sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(1 0.05 95)" />
              <stop offset="40%" stopColor="oklch(0.85 0.18 75)" />
              <stop offset="100%" stopColor="oklch(0.55 0.2 35)" />
            </radialGradient>
            <radialGradient id="sun-corona" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.85 0.18 75 / 0.6)" />
              <stop offset="100%" stopColor="oklch(0.85 0.18 75 / 0)" />
            </radialGradient>
          </defs>
          <circle cx={CX} cy={CY} r={STAR_R * 2.4} fill="url(#sun-corona)" className="sun-pulse" />
          <circle cx={CX} cy={CY} r={STAR_R} fill="url(#sun)" />
          <text
            x={CX}
            y={CY + STAR_R + 18}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ font: '600 10px "Orbitron", sans-serif', letterSpacing: 2 }}
          >
            G{galaxy} · S{system}
          </text>

          {/* Planets */}
          {slots.map((slot) => {
            const r = orbits[slot.pos - 1];
            const a = (angleFor(slot.pos) * Math.PI) / 180;
            const x = CX + Math.cos(a) * r;
            const y = CY + Math.sin(a) * r;
            const empty = !slot.planet;
            const meta = slot.type ? planetTypeMeta[slot.type] : null;
            const size = slot.size ?? 6;
            const sMeta = slot.status ? statusMeta[slot.status] : null;
            const favKey = `${galaxy}:${system}:${slot.pos}`;
            const isFav = favorites.has(favKey);
            const isSelf = slot.status === "self";

            return (
              <g
                key={slot.pos}
                transform={`translate(${x} ${y})`}
                className={empty ? "cursor-default" : "cursor-pointer"}
                onClick={() => !empty && onSelect(slot)}
              >
                {/* position marker */}
                <text
                  y={-size - 10}
                  textAnchor="middle"
                  className="fill-muted-foreground/50"
                  style={{ font: '500 8px "JetBrains Mono", monospace' }}
                >
                  {slot.pos.toString().padStart(2, "0")}
                </text>

                {empty ? (
                  <circle r={2} fill="oklch(0.5 0.01 60 / 0.35)" />
                ) : (
                  <>
                    {/* glow */}
                    <circle
                      r={size + 6}
                      fill={meta?.glow ?? "oklch(0.7 0.05 60 / 0.4)"}
                      style={{ filter: "blur(6px)" }}
                    />
                    {/* planet body */}
                    <foreignObject x={-size} y={-size} width={size * 2} height={size * 2}>
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "9999px",
                          background: meta?.gradient,
                          boxShadow:
                            "inset -3px -4px 8px oklch(0 0 0 / 0.55), inset 3px 3px 6px oklch(1 0 0 / 0.12)",
                        }}
                      />
                    </foreignObject>
                    {/* moon */}
                    {slot.moon && (
                      <circle
                        cx={size + 4}
                        cy={-size + 2}
                        r={2.5}
                        fill="oklch(0.85 0.005 60)"
                        stroke="oklch(0.4 0 0)"
                        strokeWidth={0.5}
                      />
                    )}
                    {/* debris ring */}
                    {slot.debris && (
                      <ellipse
                        cx={0}
                        cy={0}
                        rx={size + 6}
                        ry={size / 3 + 2}
                        fill="none"
                        stroke="oklch(0.78 0.18 75 / 0.55)"
                        strokeWidth={1}
                        strokeDasharray="1 2"
                      />
                    )}
                    {/* status ring */}
                    {(isSelf || isFav || sMeta) && (
                      <circle
                        r={size + 3}
                        fill="none"
                        strokeWidth={1.4}
                        stroke={
                          isSelf
                            ? "var(--primary)"
                            : isFav
                            ? "var(--warning)"
                            : "oklch(0.7 0.02 60 / 0.5)"
                        }
                      />
                    )}
                    {/* label */}
                    <text
                      y={size + 14}
                      textAnchor="middle"
                      className={isSelf ? "fill-primary" : "fill-foreground/80"}
                      style={{ font: '600 9px "Orbitron", sans-serif', letterSpacing: 1 }}
                    >
                      {(slot.planet ?? "").slice(0, 12)}
                    </text>
                    {slot.player && (
                      <text
                        y={size + 24}
                        textAnchor="middle"
                        className={sMeta?.color ?? "fill-muted-foreground"}
                        style={{ font: '500 8px "JetBrains Mono", monospace' }}
                      >
                        {slot.player.slice(0, 14)}
                      </text>
                    )}
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer legend */}
      <div className="relative px-4 py-3 border-t border-border bg-surface-elevated/40 flex flex-wrap gap-3 text-[10px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5"><Star className="w-3 h-3 text-warning" /> Favorito</span>
        <span className="flex items-center gap-1.5"><Moon className="w-3 h-3" /> Lua</span>
        <span className="flex items-center gap-1.5"><Recycle className="w-3 h-3 text-warning/80" /> Destroços</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Sua colônia</span>
        <span className="ml-auto opacity-70">Clique em um planeta para detalhes</span>
      </div>

      <style>{`
        @keyframes sun-pulse {
          0%, 100% { opacity: 0.75; transform-origin: center; }
          50%      { opacity: 1; }
        }
        .sun-pulse { animation: sun-pulse 4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
      `}</style>
    </div>
  );
}

function Starfield() {
  // Deterministic star field
  const stars = useMemo(() => {
    const arr: { x: number; y: number; r: number; o: number }[] = [];
    let s = 12345;
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let i = 0; i < 90; i++) {
      arr.push({ x: rnd() * 100, y: rnd() * 100, r: rnd() * 1.4 + 0.3, o: rnd() * 0.7 + 0.2 });
    }
    return arr;
  }, []);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      {stars.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.r * 0.15} fill="white" opacity={st.o}>
          <animate
            attributeName="opacity"
            values={`${st.o};${st.o * 0.3};${st.o}`}
            dur={`${2 + (i % 5)}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}
