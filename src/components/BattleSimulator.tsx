import { useEffect, useMemo, useRef, useState } from "react";
import { X, Play, Pause, RotateCcw, FastForward, Crosshair, Shield, Zap, Swords, Pickaxe, Gem, Plus, Minus, Sparkles, Trophy, Skull } from "lucide-react";
import { simulate, UNIT_DB, type SimResult, type Combatant, type RoundSnapshot } from "@/lib/battle-sim";

interface Props { open: boolean; onClose: () => void; }

const ATT_PRESETS: { id: string; label: string }[] = [
  { id: "light-fighter", label: "Caça Leve" },
  { id: "heavy-fighter", label: "Caça Pesado" },
  { id: "cruiser", label: "Cruzador" },
  { id: "battleship", label: "Nave de Batalha" },
  { id: "bomber", label: "Bombardeiro" },
  { id: "destroyer", label: "Destruidor" },
];
const DEF_PRESETS: { id: string; label: string }[] = [
  { id: "rocket-launcher", label: "Lança-Mísseis" },
  { id: "light-laser", label: "Laser Leve" },
  { id: "heavy-laser", label: "Laser Pesado" },
  { id: "gauss", label: "Gauss" },
  { id: "plasma", label: "Plasma" },
];

const fmt = (n: number) => n.toLocaleString("pt-BR");

export function BattleSimulator({ open, onClose }: Props) {
  const [attacker, setAttacker] = useState<Record<string, number>>({
    "light-fighter": 120, "cruiser": 24, "battleship": 8,
  });
  const [defender, setDefender] = useState<Record<string, number>>({
    "rocket-launcher": 60, "light-laser": 30, "heavy-laser": 10, "gauss": 2,
  });

  const result = useMemo<SimResult>(() => {
    const att: Combatant[] = Object.entries(attacker).filter(([, v]) => v > 0).map(([unitId, count]) => ({ unitId, count }));
    const def: Combatant[] = Object.entries(defender).filter(([, v]) => v > 0).map(([unitId, count]) => ({ unitId, count }));
    return simulate({ name: "Atacante", units: att }, { name: "Defensor", units: def });
  }, [attacker, defender]);

  const [round, setRound] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const lastRound = result.rounds.length;

  // restart on input change
  useEffect(() => { setRound(0); setPlaying(false); }, [attacker, defender]);

  useEffect(() => {
    if (!playing) return;
    if (round >= lastRound) { setPlaying(false); return; }
    const t = setTimeout(() => setRound((r) => Math.min(lastRound, r + 1)), speed);
    return () => clearTimeout(t);
  }, [playing, round, speed, lastRound]);

  if (!open) return null;

  const current: RoundSnapshot | null = round > 0 ? result.rounds[round - 1] : null;
  const attHpPct = current?.attackerHpPct ?? 100;
  const defHpPct = current?.defenderHpPct ?? 100;
  const finished = round >= lastRound && lastRound > 0;
  const winner = finished ? result.winner : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-background/85 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-7xl h-[94vh] panel rounded-lg border border-border flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "linear-gradient(180deg, oklch(0.18 0.01 260 / 0.97), oklch(0.13 0.005 260 / 0.97))" }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded bg-destructive/15 border border-destructive/40 flex items-center justify-center shadow-[0_0_18px_-4px] shadow-destructive/40">
            <Swords className="w-4 h-4 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm tracking-widest uppercase text-foreground">Simulador de Batalha</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Combate em tempo real · {lastRound} rodadas previstas
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded hover:bg-surface-elevated flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] min-h-0">
          {/* Attacker setup */}
          <ForceSetup
            title="Atacante"
            tone="destructive"
            presets={ATT_PRESETS}
            values={attacker}
            onChange={setAttacker}
          />

          {/* Battlefield */}
          <div className="border-x border-border flex flex-col min-h-0">
            <BattleField
              attacker={attacker}
              defender={defender}
              current={current}
              attHpPct={attHpPct}
              defHpPct={defHpPct}
              round={round}
              totalRounds={lastRound}
              winner={winner}
            />

            {/* Controls */}
            <div className="border-t border-border px-4 py-3 flex items-center gap-2 shrink-0 bg-background/40">
              <button
                onClick={() => { if (round >= lastRound) setRound(0); setPlaying((p) => !p); }}
                className="h-9 px-4 rounded bg-primary text-primary-foreground font-display uppercase tracking-widest text-[11px] flex items-center gap-2 hover:shadow-[0_0_18px_-4px_var(--primary)]"
              >
                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {playing ? "Pausar" : finished ? "Replay" : "Iniciar"}
              </button>
              <button
                onClick={() => { setRound(0); setPlaying(false); }}
                className="h-9 w-9 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40"
                title="Reiniciar"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setRound(lastRound)}
                className="h-9 w-9 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40"
                title="Pular"
              >
                <FastForward className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1 ml-2">
                {[1500, 900, 450, 200].map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`h-7 px-2 rounded text-[10px] font-mono uppercase tracking-widest border ${
                      speed === s ? "bg-primary/15 text-primary border-primary/40" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {["1x", "2x", "4x", "8x"][i]}
                  </button>
                ))}
              </div>
              <div className="flex-1" />
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground tabular-nums">
                Rodada <span className="text-foreground">{round}</span> / {lastRound}
              </div>
            </div>
          </div>

          {/* Defender setup */}
          <ForceSetup
            title="Defensor"
            tone="deuterium"
            presets={DEF_PRESETS}
            values={defender}
            onChange={setDefender}
          />
        </div>

        {/* Live report */}
        <div className="border-t border-border max-h-[28%] overflow-y-auto bg-background/30 shrink-0">
          <LiveReport result={result} round={round} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Force setup column ---------------- */

function ForceSetup({
  title, tone, presets, values, onChange,
}: {
  title: string;
  tone: "destructive" | "deuterium";
  presets: { id: string; label: string }[];
  values: Record<string, number>;
  onChange: (v: Record<string, number>) => void;
}) {
  const accent = tone === "destructive" ? "text-destructive" : "text-deuterium";
  const dotBg = tone === "destructive" ? "bg-destructive" : "bg-deuterium";
  const set = (id: string, v: number) => onChange({ ...values, [id]: Math.max(0, v) });
  const total = Object.values(values).reduce((a, b) => a + b, 0);
  return (
    <div className="overflow-y-auto p-3 space-y-2">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className={`text-[10px] font-display uppercase tracking-widest ${accent} flex items-center gap-2`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotBg}`} />
          {title}
        </div>
        <span className="text-[10px] font-mono tabular-nums text-muted-foreground">{fmt(total)}</span>
      </div>
      {presets.map((p) => {
        const v = values[p.id] ?? 0;
        const stats = UNIT_DB[p.id];
        return (
          <div key={p.id} className="panel rounded border border-border p-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-display tracking-wide truncate">{p.label}</span>
              <span className="text-[10px] font-mono tabular-nums text-muted-foreground">{fmt(v)}</span>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <button onClick={() => set(p.id, v - 10)} className="w-6 h-6 rounded border border-border hover:border-foreground/40 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
              <input
                type="range" min={0} max={500} value={Math.min(500, v)}
                onChange={(e) => set(p.id, Number(e.target.value))}
                className="flex-1 accent-primary h-1"
              />
              <button onClick={() => set(p.id, v + 10)} className="w-6 h-6 rounded border border-border hover:border-foreground/40 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
            </div>
            {stats && (
              <div className="grid grid-cols-3 gap-1 mt-1.5 text-[9px] font-mono">
                <Stat icon={Crosshair} v={stats.weapon} cls="text-destructive" />
                <Stat icon={Shield} v={stats.shield} cls="text-deuterium" />
                <Stat icon={Zap} v={stats.hull} cls="text-energy" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Stat({ icon: Icon, v, cls }: { icon: typeof Crosshair; v: number; cls: string }) {
  return (
    <div className="flex items-center gap-1 panel rounded px-1 py-0.5 border border-border/60">
      <Icon className={`w-2.5 h-2.5 ${cls}`} />
      <span className="tabular-nums text-muted-foreground">{fmt(v)}</span>
    </div>
  );
}

/* ---------------- Battlefield viewport ---------------- */

function BattleField({
  attacker, defender, current, attHpPct, defHpPct, round, totalRounds, winner,
}: {
  attacker: Record<string, number>;
  defender: Record<string, number>;
  current: RoundSnapshot | null;
  attHpPct: number;
  defHpPct: number;
  round: number;
  totalRounds: number;
  winner: "attacker" | "defender" | "draw" | null;
}) {
  // Build sprites (max 36 each side for perf)
  const attSprites = spritesFor(current?.attackerRemaining ?? entriesAsCombat(attacker), "att");
  const defSprites = spritesFor(current?.defenderRemaining ?? entriesAsCombat(defender), "def");

  const tracerKey = `${round}-${current?.attackerDamage}-${current?.defenderDamage}`;

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Starfield */}
      <div className="absolute inset-0" style={{
        background:
          "radial-gradient(ellipse at center, oklch(0.20 0.02 260) 0%, oklch(0.10 0.01 260) 100%)",
      }} />
      <div className="absolute inset-0 opacity-50">
        <Starfield />
      </div>

      {/* HP bars */}
      <div className="absolute top-3 left-3 right-3 flex items-center gap-3 z-10">
        <HpBar label="Atacante" pct={attHpPct} tone="destructive" />
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground bg-background/60 border border-border rounded px-2 py-1">
          R{round}/{totalRounds}
        </div>
        <HpBar label="Defensor" pct={defHpPct} tone="deuterium" reverse />
      </div>

      {/* Sides */}
      <div className="absolute inset-0 grid grid-cols-2">
        <SideField sprites={attSprites} side="left" />
        <SideField sprites={defSprites} side="right" />
      </div>

      {/* Tracers */}
      {current && (
        <svg key={tracerKey} className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {Array.from({ length: 14 }).map((_, i) => {
            const fromAtt = i % 2 === 0;
            const y1 = 25 + (i * 37) % 70;
            const y2 = 20 + ((i * 53) % 75);
            return (
              <line
                key={i}
                x1={fromAtt ? "12%" : "88%"} y1={`${y1}%`}
                x2={fromAtt ? "88%" : "12%"} y2={`${y2}%`}
                stroke={fromAtt ? "var(--destructive)" : "var(--deuterium)"}
                strokeWidth="1.2"
                strokeOpacity="0.7"
                style={{
                  animation: `tracer 0.6s ease-out ${i * 0.04}s both`,
                  filter: "drop-shadow(0 0 4px currentColor)",
                }}
              />
            );
          })}
          <style>{`
            @keyframes tracer {
              0% { stroke-dasharray: 0 100; opacity: 0; }
              30% { opacity: 1; }
              100% { stroke-dasharray: 100 0; opacity: 0; }
            }
          `}</style>
        </svg>
      )}

      {/* Result overlay */}
      {winner && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-20 animate-fade-in">
          <div className={`panel rounded-lg border-2 px-8 py-6 text-center ${
            winner === "attacker" ? "border-destructive/60" : winner === "defender" ? "border-deuterium/60" : "border-border"
          }`}>
            {winner === "attacker" ? <Trophy className="w-10 h-10 mx-auto text-destructive mb-2" /> :
             winner === "defender" ? <Shield className="w-10 h-10 mx-auto text-deuterium mb-2" /> :
             <Skull className="w-10 h-10 mx-auto text-muted-foreground mb-2" />}
            <div className="font-display text-2xl tracking-widest uppercase">
              {winner === "attacker" ? "Vitória do atacante" : winner === "defender" ? "Defesa bem sucedida" : "Empate"}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-2">
              Combate finalizado em {totalRounds} rodadas
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HpBar({ label, pct, tone, reverse }: { label: string; pct: number; tone: "destructive" | "deuterium"; reverse?: boolean }) {
  const color = tone === "destructive" ? "var(--destructive)" : "var(--deuterium)";
  return (
    <div className={`flex-1 panel rounded border border-border px-2 py-1.5 ${reverse ? "text-right" : ""}`} style={{ background: "color-mix(in oklab, " + color + " 6%, transparent)" }}>
      <div className={`flex items-center gap-2 ${reverse ? "flex-row-reverse" : ""}`}>
        <span className="text-[9px] font-display uppercase tracking-widest" style={{ color }}>{label}</span>
        <span className="text-[10px] font-mono tabular-nums text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 bg-background/80 rounded-full mt-1 overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 8px ${color}`,
            marginLeft: reverse ? "auto" : 0,
          }}
        />
      </div>
    </div>
  );
}

function entriesAsCombat(map: Record<string, number>): Combatant[] {
  return Object.entries(map).filter(([, v]) => v > 0).map(([unitId, count]) => ({ unitId, count }));
}

interface Sprite { id: string; unitId: string; x: number; y: number; size: number; tone: "att" | "def"; }
function spritesFor(units: Combatant[], tone: "att" | "def"): Sprite[] {
  const sprites: Sprite[] = [];
  let idx = 0;
  for (const u of units) {
    const stats = UNIT_DB[u.unitId];
    if (!stats) continue;
    const dots = Math.min(u.count, 12); // visual cap
    const size = Math.max(8, Math.min(22, Math.round(Math.log2(stats.hull + 1) * 1.6)));
    for (let i = 0; i < dots; i++) {
      // deterministic placement
      const seed = (idx * 9301 + 49297 + i * 233) % 233280;
      const rand = (seed: number) => ((seed * 1103515245 + 12345) % 2147483647) / 2147483647;
      const r = rand(seed);
      const r2 = rand(seed + 7);
      sprites.push({
        id: `${tone}-${u.unitId}-${idx}-${i}`,
        unitId: u.unitId,
        x: 10 + r * 80,
        y: 10 + r2 * 80,
        size,
        tone,
      });
      idx++;
    }
  }
  return sprites;
}

function SideField({ sprites, side }: { sprites: Sprite[]; side: "left" | "right" }) {
  return (
    <div className="relative h-full">
      {sprites.map((s) => {
        const color = s.tone === "att" ? "var(--destructive)" : "var(--deuterium)";
        return (
          <div
            key={s.id}
            className="absolute rounded-sm animate-fade-in"
            style={{
              left: `${side === "left" ? s.x : 100 - s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size * 0.6,
              background: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color} 30%, black))`,
              border: `1px solid color-mix(in oklab, ${color} 60%, white)`,
              boxShadow: `0 0 10px -2px ${color}`,
              transform: side === "right" ? "scaleX(-1)" : undefined,
              transition: "all 400ms ease-out",
            }}
            title={UNIT_DB[s.unitId]?.name}
          />
        );
      })}
    </div>
  );
}

function Starfield() {
  // deterministic stars
  const stars = useMemo(() => {
    const out: { x: number; y: number; s: number; o: number }[] = [];
    let seed = 12345;
    const r = () => { seed = (seed * 1103515245 + 12345) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 80; i++) out.push({ x: r() * 100, y: r() * 100, s: r() * 1.4 + 0.3, o: r() * 0.6 + 0.2 });
    return out;
  }, []);
  return (
    <svg className="w-full h-full">
      {stars.map((s, i) => (
        <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.s} fill="white" opacity={s.o} />
      ))}
    </svg>
  );
}

/* ---------------- Live report (rolling log + tally) ---------------- */

function LiveReport({ result, round }: { result: SimResult; round: number }) {
  const visibleRounds = result.rounds.slice(0, round);
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }); }, [round]);

  const finished = round >= result.rounds.length && result.rounds.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-0">
      <div ref={logRef} className="p-3 max-h-48 overflow-y-auto space-y-1.5">
        <div className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" /> Relatório em tempo real
        </div>
        {visibleRounds.length === 0 && (
          <div className="text-[11px] font-mono text-muted-foreground/60">Aguardando início do combate...</div>
        )}
        {visibleRounds.map((r) => (
          <div key={r.round} className="text-[11px] font-mono text-foreground/90 animate-fade-in panel rounded border border-border/60 px-2 py-1.5 flex items-center gap-2">
            <span className="text-[9px] font-display uppercase tracking-widest text-muted-foreground bg-background/60 rounded px-1.5 py-0.5">R{r.round}</span>
            <span className="text-destructive">↗ {fmt(r.attackerShots)} tiros · {fmt(r.attackerDamage)} dmg</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-deuterium">{fmt(r.defenderShots)} tiros · {fmt(r.defenderDamage)} dmg ↘</span>
            <span className="ml-auto text-muted-foreground tabular-nums">{r.attackerHpPct}% / {r.defenderHpPct}%</span>
          </div>
        ))}
        {finished && (
          <div className={`text-[11px] font-display uppercase tracking-widest mt-2 px-2 py-1.5 rounded border ${
            result.winner === "attacker" ? "border-destructive/40 text-destructive bg-destructive/5" :
            result.winner === "defender" ? "border-deuterium/40 text-deuterium bg-deuterium/5" :
            "border-border text-muted-foreground"
          }`}>
            {result.winner === "attacker" ? "Atacante venceu" : result.winner === "defender" ? "Defensor venceu" : "Empate"}
          </div>
        )}
      </div>

      <div className="border-l border-border p-3 space-y-2 bg-background/20">
        <div className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Resumo</div>
        <Tally label="Perdas atac." value={result.attackerLossesValue} cls="text-destructive" />
        <Tally label="Perdas def." value={result.defenderLossesValue} cls="text-deuterium" />
        <div className="pt-1 border-t border-border">
          <div className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1">Destroços</div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="flex items-center gap-1.5 panel rounded px-2 py-1 border border-border">
              <Pickaxe className="w-3 h-3 text-metal" />
              <span className="text-[11px] font-mono tabular-nums">{fmt(result.debris.metal)}</span>
            </div>
            <div className="flex items-center gap-1.5 panel rounded px-2 py-1 border border-border">
              <Gem className="w-3 h-3 text-crystal" />
              <span className="text-[11px] font-mono tabular-nums">{fmt(result.debris.crystal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tally({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] font-mono">
      <span className="text-muted-foreground">{label}</span>
      <span className={`tabular-nums ${cls}`}>{fmt(value)}</span>
    </div>
  );
}
