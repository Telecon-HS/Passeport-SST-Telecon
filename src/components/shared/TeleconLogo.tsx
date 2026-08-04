import logo from "@/assets/telecon-logo.jpg";
import { cn } from "@/lib/utils";

/**
 * Logo Telecon. Le fichier fourni a un fond blanc : sur fond foncé, il est
 * présenté dans une pastille blanche plutôt que détouré à la volée.
 */
export function TeleconLogo({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  if (variant === "dark") {
    return (
      <span className={cn("inline-flex items-center rounded-md bg-white px-2 py-1.5", className)}>
        <img src={logo} alt="Telecon" className="h-4 w-auto" />
      </span>
    );
  }
  return <img src={logo} alt="Telecon" className={cn("h-6 w-auto", className)} />;
}
