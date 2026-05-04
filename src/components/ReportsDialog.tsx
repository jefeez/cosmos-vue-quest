import { useMemo, useState } from "react";
import { Crosshair, Eye, Truck, Send, Recycle, Compass, Sparkles, Star, Trash2, Check, Filter, Search, X, Pickaxe, Gem, Droplet, Zap, AlertTriangle, ShieldAlert } from "lucide-react";
import {
  useReports, reportsStore, timeAgo, reportTypeMeta,
  type Report, type ReportType, type BattleReport, type EspionageReport,
  type TransportReport, type DeployReport, type HarvestReport, type ExpeditionReport, type ColonizeReport,
} from "@/lib/reports-store";

const typeIcon: Record<ReportType, typeof Crosshair> = {
  battle: Crosshair, espionage: Eye, transport: Truck, deploy: Send,
  harvest: Recycle, expedition: Compass, colonize: Sparkles,
};

const themeClass: Record<string, { text: string; bg: string; border: string; dot: string; glow: string }> = {
  destructive: { text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/40", dot: "bg-destructive", glow: "shadow-destructive/30" },
  deuterium:   { text: "text-deuterium",   bg: "bg-deuterium/10",   border: "border-deuterium/40",   dot: "bg-deuterium",   glow: "shadow-deuterium/30" },
  crystal:     { text: "text-crystal",     bg: "bg-crystal/10",     border: "border-crystal/40",     dot: "bg-crystal",     glow: "shadow-crystal/30" },
  amber:       { text: "text-primary",     bg: "bg-primary/10",     border: "border-primary/40",     dot: "bg-primary",     glow: "shadow-primary/30" },
  energy:      { text: "text-energy",      bg: "bg-energy/10",      border: "border-energy/40",      dot: "bg-energy",      glow: "shadow-energy/30" },
  metal:       { text: "text-metal",       bg: "bg-metal/10",       border: "border-metal/40",       dot: "bg-metal",       glow: "shadow-metal/30" },
  primary:     { text: "text-accent",      bg: "bg-accent/10",      border: "border-accent/40",      dot: "bg-accent",      glow: "shadow-accent/30" },
};

const fmt = (n: number) => n.toLocaleString("pt-BR");

interface Props { open: boolean; onClose: () => void; }

export function ReportsDialog({ open, onClose }: Props) {
  const { reports } = useReports();
  const [filter, setFilter] = useState<ReportType | "all" | "unread" | "starred">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(reports[0]?.id ?? null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let list = reports;
    if (filter === "unread") list = list.filter((r) => !r.read);
    else if (filter === "starred") list = list.filter((r) => r.starred);
    else if (filter !== "all") list = list.filter((r) => r.type === filter);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.target.includes(q) || (r.targetName ?? "").toLowerCase().includes(q));
    }
    return list;
  }, [reports, filter, query]);

  const selected = reports.find((r) => r.id === selectedId) ?? filtered[0] ?? null;
  const unreadCount = reports.filter((r) => !r.read).length;

  if (!open) return null;

  const toggleCheck = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id); else next.add(id);
    setChecked(next);
  };

  const FILTER_OPTS: { id: typeof filter; label: string; count?: number }[] = [
    { id: "all", label: "Tudo", count: reports.length },
    { id: "unread", label: "Não lidos", count: unreadCount },
    { id: "starred", label: "★ Marcados", count: reports.filter((r) => r.starred).length },
    { id: "battle", label: "Combate" },
    { id: "espionage", label: "Espionagem" },
    { id: "transport", label: "Transporte" },
    { id: "deploy", label: "Deploy" },
    { id: "harvest", label: "Reciclagem" },
    { id: "expedition", label: "Expedição" },
    { id: "colonize", label: "Colônia" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-6xl h-[92vh] panel rounded-lg border border-border flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "linear-gradient(180deg, oklch(0.20 0.01 60 / 0.96), oklch(0.16 0.005 60 / 0.96))" }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded bg-primary/15 border border-primary/40 flex items-center justify-center">
            <Filter className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm tracking-widest uppercase text-foreground">Central de Relatórios</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {reports.length} registros · {unreadCount} não lidos
            </div>
          </div>
          <button
            onClick={() => reportsStore.markAllRead()}
            className="h-8 px-3 rounded border border-border text-[10px] font-display uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary/40 flex items-center gap-1.5"
          >
            <Check className="w-3 h-3" /> Marcar tudo
          </button>
          {checked.size > 0 && (
            <button
              onClick={() => { reportsStore.removeMany(Array.from(checked)); setChecked(new Set()); }}
              className="h-8 px-3 rounded border border-destructive/40 text-[10px] font-display uppercase tracking-widest text-destructive hover:bg-destructive/10 flex items-center gap-1.5"
            >
              <Trash2 className="w-3 h-3" /> Apagar ({checked.size})
            </button>
          )}
          <button onClick={onClose} className="w-8 h-8 rounded hover:bg-surface-elevated flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters bar */}
        <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 overflow-x-auto shrink-0">
          <div className="relative shrink-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="h-7 pl-7 pr-2 rounded bg-background/60 border border-border text-[11px] font-mono w-44 focus:outline-none focus:border-primary/40"
            />
          </div>
          {FILTER_OPTS.map((opt) => {
            const active = filter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setFilter(opt.id)}
                className={`shrink-0 h-7 px-2.5 rounded text-[10px] font-display uppercase tracking-widest border transition-colors ${
                  active ? "bg-primary/15 text-primary border-primary/40" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {opt.label}{opt.count !== undefined && <span className="ml-1 opacity-60">({opt.count})</span>}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[340px_1fr] min-h-0">
          {/* List */}
          <div className="border-r border-border overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest">
                Nenhum relatório
              </div>
            ) : filtered.map((r) => {
              const meta = reportTypeMeta[r.type];
              const t = themeClass[meta.theme];
              const Icon = typeIcon[r.type];
              const active = selected?.id === r.id;
              const isChecked = checked.has(r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => { setSelectedId(r.id); if (!r.read) reportsStore.markRead(r.id); }}
                  className={`w-full text-left px-3 py-2.5 border-b border-border/60 flex items-start gap-2.5 transition-colors ${
                    active ? `${t.bg}` : "hover:bg-surface-elevated/60"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-sm border border-border flex items-center justify-center shrink-0 mt-0.5"
                    onClick={(e) => { e.stopPropagation(); toggleCheck(r.id); }}
                  >
                    {isChecked && <Check className="w-2.5 h-2.5 text-primary" />}
                  </span>
                  <div className={`w-7 h-7 rounded ${t.bg} ${t.border} border flex items-center justify-center shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${t.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {!r.read && <span className={`w-1.5 h-1.5 rounded-full ${t.dot} shrink-0`} />}
                      <span className={`text-xs font-display tracking-wide truncate ${r.read ? "text-muted-foreground" : "text-foreground font-semibold"}`}>
                        {r.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{r.target}</span>
                      <span className="text-[9px] font-mono text-muted-foreground/60">·</span>
                      <span className="text-[9px] font-mono text-muted-foreground">{timeAgo(r.timestamp)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); reportsStore.toggleStar(r.id); }}
                    className="shrink-0"
                  >
                    <Star className={`w-3.5 h-3.5 ${r.starred ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
                  </button>
                </button>
              );
            })}
          </div>

          {/* Detail */}
          <div className="overflow-y-auto">
            {selected ? <ReportDetail report={selected} /> : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground font-mono uppercase tracking-widest">
                Selecione um relatório
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportDetail({ report }: { report: Report }) {
  const meta = reportTypeMeta[report.type];
  const t = themeClass[meta.theme];
  const Icon = typeIcon[report.type];
  return (
    <div className="p-4 space-y-4">
      {/* Hero */}
      <div className={`relative rounded-lg border ${t.border} ${t.bg} p-4 overflow-hidden`}>
        <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full ${t.dot} opacity-10 blur-2xl`} />
        <div className="relative flex items-start gap-3">
          <div className={`w-12 h-12 rounded ${t.bg} border ${t.border} flex items-center justify-center shadow-lg ${t.glow}`}>
            <Icon className={`w-6 h-6 ${t.text}`} />
          </div>
          <div className="flex-1">
            <div className={`text-[10px] font-mono uppercase tracking-widest ${t.text}`}>{meta.label}</div>
            <div className="font-display text-lg tracking-wide text-foreground">{report.title}</div>
            <div className="mt-1 flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              <span>{report.origin} → {report.target}</span>
              <span>·</span>
              <span>{new Date(report.timestamp).toLocaleString("pt-BR")}</span>
            </div>
          </div>
          <button
            onClick={() => reportsStore.toggleStar(report.id)}
            className="w-8 h-8 rounded border border-border hover:border-primary/40 flex items-center justify-center"
          >
            <Star className={`w-3.5 h-3.5 ${report.starred ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
          <button
            onClick={() => reportsStore.remove(report.id)}
            className="w-8 h-8 rounded border border-border hover:border-destructive/40 hover:text-destructive flex items-center justify-center text-muted-foreground"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body by type */}
      {report.type === "battle" && <BattleBody r={report} />}
      {report.type === "espionage" && <EspionageBody r={report} />}
      {report.type === "transport" && <TransportBody r={report} />}
      {report.type === "deploy" && <DeployBody r={report} />}
      {report.type === "harvest" && <HarvestBody r={report} />}
      {report.type === "expedition" && <ExpeditionBody r={report} />}
      {report.type === "colonize" && <ColonizeBody r={report} />}
    </div>
  );
}

function ResourceRow({ res }: { res: { metal?: number; crystal?: number; deuterium?: number; energy?: number } }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {res.metal !== undefined && <ResPill icon={Pickaxe} value={res.metal} className="text-metal" />}
      {res.crystal !== undefined && <ResPill icon={Gem} value={res.crystal} className="text-crystal" />}
      {res.deuterium !== undefined && <ResPill icon={Droplet} value={res.deuterium} className="text-deuterium" />}
      {res.energy !== undefined && <ResPill icon={Zap} value={res.energy} className="text-energy" />}
    </div>
  );
}

function ResPill({ icon: Icon, value, className }: { icon: typeof Pickaxe; value: number; className: string }) {
  return (
    <div className="flex items-center gap-1.5 panel rounded px-2 py-1.5 border border-border">
      <Icon className={`w-3 h-3 ${className}`} />
      <span className="font-mono tabular-nums text-xs">{fmt(value)}</span>
    </div>
  );
}

function Section({ title, children, tone }: { title: string; children: React.ReactNode; tone?: "destructive" | "default" | "success" }) {
  const border = tone === "destructive" ? "border-destructive/30" : tone === "success" ? "border-deuterium/30" : "border-border";
  const text = tone === "destructive" ? "text-destructive" : tone === "success" ? "text-deuterium" : "text-muted-foreground";
  return (
    <div className={`panel rounded-md border ${border} p-3`}>
      <div className={`text-[10px] font-display uppercase tracking-widest ${text} mb-2`}>{title}</div>
      {children}
    </div>
  );
}

function BattleBody({ r }: { r: BattleReport }) {
  const winColor = r.result === "victory" ? "text-deuterium" : r.result === "defeat" ? "text-destructive" : "text-muted-foreground";
  const winLabel = r.result === "victory" ? "VITÓRIA" : r.result === "defeat" ? "DERROTA" : "EMPATE";
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <div className="panel rounded p-3 text-center border border-border">
          <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Resultado</div>
          <div className={`font-display text-lg tracking-widest ${winColor} mt-1`}>{winLabel}</div>
        </div>
        <div className="panel rounded p-3 text-center border border-border">
          <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Rodadas</div>
          <div className="font-display text-lg tracking-widest mt-1">{r.rounds}</div>
        </div>
        <div className="panel rounded p-3 text-center border border-border">
          <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Lua</div>
          <div className="font-display text-lg tracking-widest mt-1">{r.moonChance ? `${r.moonChance}%` : "—"}</div>
        </div>
      </div>

      <Section title={`Perdas — Atacante (${r.attacker})`} tone="destructive">
        <ResourceRow res={r.attackerLosses} />
      </Section>
      <Section title={`Perdas — Defensor (${r.defender})`} tone="destructive">
        <ResourceRow res={r.defenderLosses} />
      </Section>
      <Section title="Saque obtido" tone="success">
        <ResourceRow res={r.loot} />
      </Section>
      <Section title="Campo de destroços">
        <ResourceRow res={r.debris} />
      </Section>
    </>
  );
}

function EspionageBody({ r }: { r: EspionageReport }) {
  const counterTone = r.counterChance >= 50 ? "destructive" : r.counterChance >= 25 ? "default" : "success";
  return (
    <>
      <div className={`panel rounded p-3 flex items-center gap-3 border ${
        counterTone === "destructive" ? "border-destructive/40 bg-destructive/5" : counterTone === "success" ? "border-deuterium/30" : "border-border"
      }`}>
        {counterTone === "destructive" ? <ShieldAlert className="w-5 h-5 text-destructive" /> : <Eye className="w-5 h-5 text-deuterium" />}
        <div className="flex-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Atividade alvo: há {r.activity}m</div>
          <div className="text-xs font-display tracking-wide">Chance de contraespionagem: <span className={counterTone === "destructive" ? "text-destructive" : "text-foreground"}>{r.counterChance}%</span></div>
        </div>
      </div>
      <Section title="Recursos detectados" tone="success">
        <ResourceRow res={r.resources} />
      </Section>
      <Section title="Frota">
        {r.fleet ? <DataList items={r.fleet.map((f) => ({ label: f.name, value: fmt(f.count) }))} /> : <Empty />}
      </Section>
      <Section title="Defesa">
        {r.defense ? <DataList items={r.defense.map((f) => ({ label: f.name, value: fmt(f.count) }))} /> : <Empty />}
      </Section>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Section title="Edifícios">
          {r.buildings ? <DataList items={r.buildings.map((b) => ({ label: b.name, value: `Lv ${b.level}` }))} /> : <Empty />}
        </Section>
        <Section title="Pesquisas">
          {r.research ? <DataList items={r.research.map((b) => ({ label: b.name, value: `Lv ${b.level}` }))} /> : <Empty />}
        </Section>
      </div>
    </>
  );
}

function TransportBody({ r }: { r: TransportReport }) {
  return (
    <>
      <Section title={r.direction === "delivered" ? "Carga entregue" : "Carga recebida"} tone="success">
        <ResourceRow res={r.cargo} />
      </Section>
      <Section title="Frota envolvida">
        <DataList items={r.ships.map((s) => ({ label: s.name, value: fmt(s.count) }))} />
      </Section>
    </>
  );
}

function DeployBody({ r }: { r: DeployReport }) {
  return (
    <>
      <Section title="Frota estacionada">
        <DataList items={r.ships.map((s) => ({ label: s.name, value: fmt(s.count) }))} />
      </Section>
      <Section title="Carga transportada">
        <ResourceRow res={r.cargo} />
      </Section>
    </>
  );
}

function HarvestBody({ r }: { r: HarvestReport }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div className="panel rounded p-3 text-center border border-border">
          <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Recicladores</div>
          <div className="font-display text-lg mt-1">{r.recyclers}</div>
        </div>
        <div className="panel rounded p-3 text-center border border-border">
          <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Capacidade</div>
          <div className="font-display text-lg mt-1">{fmt(r.capacity)}</div>
        </div>
      </div>
      <Section title="Recursos coletados" tone="success">
        <ResourceRow res={r.collected} />
      </Section>
      <Section title="Restante no campo">
        <ResourceRow res={r.remaining} />
      </Section>
    </>
  );
}

function ExpeditionBody({ r }: { r: ExpeditionReport }) {
  const negative = r.outcome === "pirates" || r.outcome === "aliens" || r.outcome === "nothing";
  return (
    <>
      <div className={`panel rounded p-3 border ${negative ? "border-destructive/30 bg-destructive/5" : "border-deuterium/30"}`}>
        <div className="flex items-start gap-2">
          {negative ? <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" /> : <Sparkles className="w-4 h-4 text-deuterium mt-0.5" />}
          <p className="text-xs leading-relaxed text-foreground">{r.message}</p>
        </div>
      </div>
      {r.gain && (
        <Section title="Recompensa" tone="success">
          <ResourceRow res={r.gain} />
          {r.gain.ships && <div className="mt-2"><DataList items={r.gain.ships.map((s) => ({ label: s.name, value: fmt(s.count) }))} /></div>}
        </Section>
      )}
    </>
  );
}

function ColonizeBody({ r }: { r: ColonizeReport }) {
  return (
    <>
      <div className={`panel rounded p-3 border ${r.success ? "border-deuterium/30" : "border-destructive/30"}`}>
        <div className={`text-xs font-display tracking-wide ${r.success ? "text-deuterium" : "text-destructive"}`}>
          {r.success ? "Colonização bem-sucedida" : "Falha na colonização"}
        </div>
      </div>
      {r.success && (
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Campos" value={String(r.fields)} />
          <Stat label="Diâmetro" value={`${fmt(r.diameter)} km`} />
          <Stat label="Temperatura" value={`${r.temperature.min}° a ${r.temperature.max}°`} />
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel rounded p-3 text-center border border-border">
      <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-sm mt-1">{value}</div>
    </div>
  );
}

function DataList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="space-y-1">
      {items.map((it, i) => (
        <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
          <span className="text-muted-foreground">{it.label}</span>
          <span className="font-mono tabular-nums">{it.value}</span>
        </div>
      ))}
    </div>
  );
}

function Empty() {
  return <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">Sem dados</div>;
}
