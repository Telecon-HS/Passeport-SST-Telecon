import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { accounts } from "@/data/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldHalf, LogIn, AlertCircle, Info } from "lucide-react";
import { isPersistent } from "@/lib/storage";
import { TeleconLogo } from "@/components/shared/TeleconLogo";

export function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);
    const result = login(username, password);
    if (!result.ok) setError(result.error);
  }

  function quickFill(u: string) {
    setUsername(u);
    setPassword("Telecon2026");
    setError(null);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-tc-bg lg:flex-row">
      {/* Volet marque */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-tc-navy via-tc-navy to-tc-navy2 p-8 text-white lg:w-[46%] lg:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-tc-teal/20 blur-3xl" />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-tc-teal">
            <ShieldHalf className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-bold">Passeport SST</div>
            <div className="text-[11px] text-white/50">Telecon</div>
          </div>
        </div>

        <div className="relative my-10 max-w-md">
          <h1 className="font-display text-3xl font-extrabold leading-tight lg:text-4xl">
            La compétence SST, démontrée et traçable.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Formations, quiz, TQT, PSFCE et autorisations de travail réunis dans un dossier
            individuel — prêt pour un audit COR.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-white/70">
            {[
              "Chaque personne voit uniquement son périmètre",
              "Progression PSFCE conservée entre les sessions",
              "Journal des actions pour la traçabilité",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-tc-teal" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[11px] text-white/40">
          Prototype — données fictives. Ne pas utiliser avec de vraies données d'employés.
          <br />
          <span className="font-mono">Build {__APP_BUILD__}</span>
        </p>
      </div>

      {/* Volet connexion */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <TeleconLogo className="mb-6 h-7" />
          <h2 className="font-display text-2xl font-bold text-tc-navy">Connexion</h2>
          <p className="mt-1 text-sm text-slate-500">Accédez à votre espace selon votre rôle.</p>

          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="username" className="text-xs font-semibold text-slate-600">
                Identifiant
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="prenom.nom"
                autoComplete="username"
                className="mt-1.5 border-tc-border"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs font-semibold text-slate-600">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="••••••••"
                autoComplete="current-password"
                className="mt-1.5 border-tc-border"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-tc-red/25 bg-tc-red/[0.05] px-3 py-2 text-sm text-tc-red">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button onClick={submit} className="w-full bg-tc-navy hover:bg-tc-navy2">
              <LogIn className="mr-2 h-4 w-4" /> Se connecter
            </Button>
          </div>

          <div className="mt-8 rounded-xl border border-tc-border bg-white p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Info className="h-3.5 w-3.5" /> Comptes de démonstration
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Mot de passe commun : <span className="font-mono">Telecon2026</span>
            </p>
            <div className="mt-3 space-y-1">
              {accounts.map((a) => (
                <button
                  key={a.username}
                  onClick={() => quickFill(a.username)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs hover:bg-slate-50"
                >
                  <span className="font-mono text-slate-600">{a.username}</span>
                  <span className="text-slate-400">{a.role}</span>
                </button>
              ))}
            </div>
          </div>

          {!isPersistent() && (
            <p className="mt-4 text-[11px] leading-relaxed text-tc-orange">
              Stockage local indisponible dans ce contexte : vos modifications resteront en mémoire
              le temps de la session.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
