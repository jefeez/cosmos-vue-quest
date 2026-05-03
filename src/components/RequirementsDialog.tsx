import type { Requirement } from "@/lib/game-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Lock, GitBranch } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  itemName: string;
  requirements: Requirement[];
  trigger: ReactNode;
  themeText?: string;
}

export function RequirementsDialog({ itemName, requirements, trigger, themeText = "text-primary" }: Props) {
  const allMet = requirements.every((r) => r.met);
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="panel border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider uppercase text-sm flex items-center gap-2">
            <GitBranch className={`w-4 h-4 ${themeText}`} />
            Requisitos · {itemName}
          </DialogTitle>
        </DialogHeader>

        <div className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded inline-flex items-center gap-1.5 w-fit ${
          allMet ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
        }`}>
          {allMet ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          {allMet ? "Pronto para desbloquear" : "Requisitos pendentes"}
        </div>

        <ol className="relative border-l border-border ml-2 mt-2 space-y-3">
          {requirements.map((r, i) => (
            <li key={r.id + i} className="ml-4">
              <span className={`absolute -left-[7px] flex items-center justify-center w-3.5 h-3.5 rounded-full ${
                r.met ? "bg-accent" : "bg-destructive"
              }`} />
              <div className="panel rounded-md p-2.5 flex items-center justify-between">
                <div>
                  <div className="font-display text-xs uppercase tracking-wider">{r.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    Nível requerido: <span className="text-foreground">{r.level}</span>
                  </div>
                </div>
                {r.met ? (
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
              </div>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
