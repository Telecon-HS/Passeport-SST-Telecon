import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border p-0.5",
        variant === "dark" ? "border-white/20 bg-white/5" : "border-tc-border bg-slate-50"
      )}
    >
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-bold uppercase transition-colors",
            lang === l
              ? "bg-tc-navy text-white"
              : variant === "dark"
              ? "text-white/60 hover:text-white"
              : "text-slate-500 hover:text-tc-navy"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
