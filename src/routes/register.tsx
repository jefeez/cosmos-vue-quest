import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Rocket, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({ meta: [{ title: "Recrutamento — OGAME" }] }),
});

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const checks = [
    { ok: password.length >= 8, label: "8+ caracteres" },
    { ok: /[A-Z]/.test(password), label: "Letra maiúscula" },
    { ok: /\d/.test(password), label: "Número" },
    { ok: /[^A-Za-z0-9]/.test(password), label: "Símbolo" },
  ];
  const s = strength(password);
  const strengthLabels = ["—", "Fraca", "Razoável", "Boa", "Forte"];
  const strengthColors = ["bg-border", "bg-destructive", "bg-warning", "bg-crystal", "bg-deuterium"];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (!agree) {
      toast.error("Aceite o código de conduta para prosseguir");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Bem-vindo, comandante ${name}`, {
        description: "Escolha seu universo de origem.",
      });
      navigate({ to: "/universes" });
    }, 1100);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
              <span className="text-primary font-display font-bold text-lg">Ω</span>
            </div>
            <div className="text-display font-bold tracking-widest">OGAME</div>
          </div>

          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            // Recrutamento de comandante
          </div>
          <h2 className="text-3xl font-display font-bold mb-2">Crie seu codinome</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Estabeleça suas credenciais e receba seu primeiro planeta natal.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Codinome
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Almirante Krix"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-11 bg-surface/50 border-border"
                  maxLength={20}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="comandante@frota.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 bg-surface/50 border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 h-11 bg-surface/50 border-border"
                />
              </div>

              {/* Strength bar */}
              <div className="flex gap-1 pt-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < s ? strengthColors[s] : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <span>Força</span>
                <span>{strengthLabels[s]}</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {checks.map((c) => (
                  <div key={c.label} className="flex items-center gap-1.5 text-[11px]">
                    {c.ok ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-deuterium" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-muted-foreground/50" />
                    )}
                    <span className={c.ok ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border bg-surface accent-primary"
              />
              <span>
                Aceito o <a className="text-primary hover:underline">código de conduta</a> e os{" "}
                <a className="text-primary hover:underline">termos de combate</a> da Federação Galáctica.
              </span>
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-display tracking-wider uppercase text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Recrutando
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" /> Recrutar comandante <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Já é comandante?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Acessar comando
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-l border-border order-1 lg:order-2">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, oklch(0.35 0.18 50 / 0.6), transparent 55%), radial-gradient(circle at 20% 80%, oklch(0.28 0.18 25 / 0.45), transparent 60%), linear-gradient(180deg, oklch(0.14 0.01 60), oklch(0.10 0.005 60))",
          }}
        />
        <div className="absolute inset-0 scanline pointer-events-none" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.68 0.16 50 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(0.68 0.16 50 / 0.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(circle at center, black, transparent 70%)",
          }}
        />

        <div className="relative z-10 ml-auto text-right">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">// Comissionamento</div>
          <div className="text-display font-bold tracking-widest mt-1">FROTA #4 297</div>
        </div>

        <div className="relative z-10 max-w-md ml-auto text-right">
          <h1 className="text-5xl font-display font-bold leading-tight mb-4">
            Sua frota
            <br />
            espera pelo
            <br />
            <span className="text-primary">primeiro comando.</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            A cada hora, novos comandantes entram nos universos. Garanta as melhores coordenadas antes que sejam colonizadas.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 max-w-md ml-auto">
          {[
            { k: "Planeta inicial", v: "Forja Prime" },
            { k: "Recursos iniciais", v: "500/500/0" },
            { k: "Bônus recruta", v: "+50% prod." },
            { k: "Proteção", v: "7 dias" },
          ].map((s) => (
            <div key={s.k} className="panel rounded-md p-3">
              <div className="text-sm font-display font-bold text-primary">{s.v}</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
