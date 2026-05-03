import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Rocket, Mail, Lock, ArrowRight, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Acesso ao Comando — OGAME" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Credenciais incompletas", { description: "Informe email e senha." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Acesso concedido", { description: "Selecione um universo para continuar." });
      navigate({ to: "/universes" });
    }, 900);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — Hero */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-border">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, oklch(0.32 0.12 50 / 0.55), transparent 55%), radial-gradient(circle at 80% 80%, oklch(0.28 0.15 220 / 0.4), transparent 60%), linear-gradient(180deg, oklch(0.14 0.01 60), oklch(0.10 0.005 60))",
          }}
        />
        <div className="absolute inset-0 scanline pointer-events-none" />
        {/* Orbit rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-primary/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full border border-primary/10" />
        <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_40px_8px] shadow-primary/60" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
            <span className="text-primary font-display font-bold text-xl">Ω</span>
          </div>
          <div>
            <div className="text-display font-bold tracking-widest">OGAME</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Comando Galáctico v3.42</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-[10px] font-mono uppercase tracking-widest text-primary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-glow" />
            Sistema operacional
          </div>
          <h1 className="text-5xl font-display font-bold leading-tight mb-4">
            Construa.
            <br />
            Pesquise.
            <br />
            <span className="text-primary">Conquiste.</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Estratégia espacial em tempo real. Comande frotas, gerencie colônias e estabeleça domínio em universos persistentes.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3 max-w-md">
          {[
            { k: "Universos", v: "12" },
            { k: "Comandantes", v: "47k" },
            { k: "Batalhas/dia", v: "1.2M" },
          ].map((s) => (
            <div key={s.k} className="panel rounded-md p-3">
              <div className="text-xl font-display font-bold text-primary">{s.v}</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
              <span className="text-primary font-display font-bold text-lg">Ω</span>
            </div>
            <div className="text-display font-bold tracking-widest">OGAME</div>
          </div>

          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            // Identificação do comandante
          </div>
          <h2 className="text-3xl font-display font-bold mb-2">Acesso ao Comando</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Entre com suas credenciais para retomar suas operações.
          </p>

          <form onSubmit={submit} className="space-y-5">
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
                  className="pl-9 h-11 bg-surface/50 border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Senha
                </Label>
                <button type="button" className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline">
                  Esqueci
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 h-11 bg-surface/50 border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-display tracking-wider uppercase text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Autenticando
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" /> Iniciar sessão <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest">
                <span className="bg-background px-3 text-muted-foreground">Ou</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 font-mono text-xs uppercase tracking-wider border-border"
              onClick={() => {
                toast.success("Acesso convidado", { description: "Modo demonstração ativado." });
                navigate({ to: "/universes" });
              }}
            >
              <Shield className="w-4 h-4" /> Continuar como convidado
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Ainda não tem registro?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Criar conta de comandante
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
