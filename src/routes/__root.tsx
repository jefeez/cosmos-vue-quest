import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { GameSidebar } from "@/components/GameSidebar";
import { ResourceBar } from "@/components/ResourceBar";
import { Toaster } from "@/components/ui/sonner";

const STANDALONE_ROUTES = ["/login", "/register", "/universes"];

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-display uppercase tracking-widest text-foreground">Setor não encontrado</h2>
        <p className="mt-2 text-sm text-muted-foreground">Coordenadas inválidas. Retornando à base.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded bg-primary px-5 py-2.5 text-sm font-display uppercase tracking-wider font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Voltar ao comando
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "OGAME — Comando Galáctico" },
      { name: "description", content: "Construa, pesquise, conquiste. Estratégia espacial em tempo real." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const standalone = STANDALONE_ROUTES.some((p) => path === p || path.startsWith(p + "/"));

  if (standalone) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground">
        <Outlet />
        <Toaster position="top-right" theme="dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <GameSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <ResourceBar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}
