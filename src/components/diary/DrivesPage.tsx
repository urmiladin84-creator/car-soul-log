import { Drive } from "@/lib/storageService";
import { DriveCard } from "@/components/diary/DriveCard";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export function DrivesPage({ drives, onOpenDrive }: { drives: Drive[]; onOpenDrive: (d: Drive) => void }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return drives;
    return drives.filter(
      (d) =>
        d.start.toLowerCase().includes(s) ||
        d.destination.toLowerCase().includes(s) ||
        d.purpose.toLowerCase().includes(s) ||
        d.notes?.toLowerCase().includes(s),
    );
  }, [drives, q]);

  return (
    <div className="space-y-4 animate-rise">
      <header className="pt-2">
        <h1 className="text-2xl font-bold text-foreground">Drives Diary</h1>
        <p className="text-sm text-muted-foreground mt-1">{drives.length} memorable trips</p>
      </header>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search drives..."
          className="w-full rounded-2xl bg-card border border-border/60 pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center mt-8">
          <div className="text-4xl mb-2">🛣️</div>
          <p className="text-sm text-muted-foreground">
            {drives.length === 0
              ? "Start your car journey by adding your first drive."
              : "No drives match your search."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((d) => (
            <DriveCard key={d.id} drive={d} onClick={() => onOpenDrive(d)} />
          ))}
        </div>
      )}
    </div>
  );
}
