import { Drive, Fuel, Service } from "@/lib/storageService";
import { useCurrency } from "@/hooks/useCurrency";

type Item =
  | { kind: "drive"; date: string; data: Drive }
  | { kind: "fuel"; date: string; data: Fuel }
  | { kind: "service"; date: string; data: Service };

export function TimelineItem({ item }: { item: Item }) {
  const { format } = useCurrency();
  const icon = item.kind === "drive" ? "🚗" : item.kind === "fuel" ? "⛽" : "🧰";
  const title =
    item.kind === "drive"
      ? `${item.data.start} → ${item.data.destination}`
      : item.kind === "fuel"
      ? `Fuel refill — ${item.data.liters}L`
      : `${item.data.serviceType} — ${item.data.workshop}`;
  const meta =
    item.kind === "drive"
      ? `${item.data.distance} km · ${item.data.purpose}`
      : item.kind === "fuel"
      ? format(item.data.total)
      : format(item.data.cost);

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center text-lg shadow-card">
          {icon}
        </div>
        <div className="w-px flex-1 bg-border mt-1" />
      </div>
      <div className="flex-1 pb-5">
        <div className="rounded-2xl bg-gradient-card border border-border/40 p-3.5 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {new Date(item.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{meta}</p>
        </div>
      </div>
    </div>
  );
}
