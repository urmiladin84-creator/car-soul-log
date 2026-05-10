import { Drive, Fuel, Service } from "@/lib/storageService";
import { TimelineItem } from "@/components/diary/TimelineItem";
import { useMemo } from "react";

type Item =
  | { kind: "drive"; date: string; data: Drive }
  | { kind: "fuel"; date: string; data: Fuel }
  | { kind: "service"; date: string; data: Service };

export function TimelinePage({ drives, fuels, services }: { drives: Drive[]; fuels: Fuel[]; services: Service[] }) {
  const items = useMemo<Item[]>(() => {
    const all: Item[] = [
      ...drives.map((d) => ({ kind: "drive" as const, date: d.date, data: d })),
      ...fuels.map((f) => ({ kind: "fuel" as const, date: f.date, data: f })),
      ...services.map((s) => ({ kind: "service" as const, date: s.date, data: s })),
    ];
    return all.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [drives, fuels, services]);

  return (
    <div className="space-y-4 animate-rise">
      <header className="pt-2">
        <h1 className="text-2xl font-bold text-foreground">Car Life Timeline</h1>
        <p className="text-sm text-muted-foreground mt-1">Every chapter of your car's life</p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center mt-8">
          <div className="text-4xl mb-2">📖</div>
          <p className="text-sm text-muted-foreground">Your timeline will appear here as you log drives, fuel, and services.</p>
        </div>
      ) : (
        <div className="pt-2">
          {items.map((item, i) => (
            <TimelineItem key={item.kind + (item.data as { id: string }).id + i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
