import { Drive, Fuel, Service } from "@/lib/storageService";
import { StatCard } from "@/components/diary/StatCard";
import { SectionHeader } from "@/components/diary/SectionHeader";
import { SimpleBarChart } from "@/components/diary/SimpleBarChart";
import { useMemo } from "react";

const monthKey = (d: string) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
};
const monthLabel = (k: string) => {
  const [, m] = k.split("-");
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(m) - 1];
};

export function StatsPage({ drives, fuels, services }: { drives: Drive[]; fuels: Fuel[]; services: Service[] }) {
  const totalKm = drives.reduce((s, d) => s + d.distance, 0);
  const longest = drives.reduce((m, d) => Math.max(m, d.distance), 0);
  const totalSpent = fuels.reduce((s, f) => s + f.total, 0) + services.reduce((s, x) => s + x.cost, 0);

  const last6 = useMemo(() => {
    const months: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    return months;
  }, []);

  const drivesByMonth = last6.map((k) => ({
    label: monthLabel(k),
    value: drives.filter((d) => monthKey(d.date) === k).length,
  }));

  const spendingByMonth = last6.map((k) => ({
    label: monthLabel(k),
    value:
      fuels.filter((f) => monthKey(f.date) === k).reduce((s, f) => s + f.total, 0) +
      services.filter((s2) => monthKey(s2.date) === k).reduce((s, x) => s + x.cost, 0),
  }));

  return (
    <div className="space-y-6 animate-rise">
      <header className="pt-2">
        <h1 className="text-2xl font-bold text-foreground">Statistics</h1>
        <p className="text-sm text-muted-foreground mt-1">Your driving in numbers</p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <StatCard label="Total KM" value={totalKm.toLocaleString()} />
        <StatCard label="Longest Drive" value={`${longest} km`} />
        <StatCard label="Total Spent" value={`Rp ${(totalSpent / 1000).toFixed(0)}k`} />
        <StatCard label="Drives" value={drives.length} />
      </section>

      <section className="rounded-2xl bg-gradient-card border border-border/40 p-4 shadow-card">
        <SectionHeader title="Drives per month" subtitle="Last 6 months" />
        <SimpleBarChart data={drivesByMonth} />
      </section>

      <section className="rounded-2xl bg-gradient-card border border-border/40 p-4 shadow-card">
        <SectionHeader title="Spending per month" subtitle="Fuel + service" />
        <SimpleBarChart data={spendingByMonth} formatValue={(v) => `${(v / 1000).toFixed(0)}k`} />
      </section>
    </div>
  );
}
