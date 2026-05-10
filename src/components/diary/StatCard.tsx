import { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  accent?: boolean;
}

export function StatCard({ label, value, hint, icon, accent }: Props) {
  return (
    <div
      className={`rounded-2xl p-4 shadow-card border border-border/40 ${
        accent ? "bg-gradient-accent text-accent-foreground" : "bg-gradient-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${accent ? "text-accent-foreground/80" : "text-muted-foreground"}`}>
          {label}
        </span>
        {icon && <span className={accent ? "text-accent-foreground/90" : "text-accent"}>{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-bold leading-tight tracking-tight">{value}</div>
      {hint && (
        <div className={`mt-1 text-xs ${accent ? "text-accent-foreground/75" : "text-muted-foreground"}`}>
          {hint}
        </div>
      )}
    </div>
  );
}
