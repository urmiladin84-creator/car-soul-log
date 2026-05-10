import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accent" | "ghost" | "danger" | "outline";
  children: ReactNode;
}

export function PrimaryButton({ variant = "accent", className = "", children, ...rest }: Props) {
  const base =
    "no-tap inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    accent: "bg-gradient-accent text-accent-foreground shadow-accent",
    ghost: "bg-muted text-foreground hover:bg-muted/70",
    danger: "bg-[var(--danger)] text-white",
    outline: "border border-border text-foreground hover:bg-muted",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
