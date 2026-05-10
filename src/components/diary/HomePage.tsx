import { Drive, Fuel, Service } from "@/lib/storageService";
import { StatCard } from "@/components/diary/StatCard";
import { SectionHeader } from "@/components/diary/SectionHeader";
import { PrimaryButton } from "@/components/diary/PrimaryButton";
import { Car, Fuel as FuelIcon, Gauge, Wrench, MapPin } from "lucide-react";

interface Props {
  drives: Drive[];
  fuels: Fuel[];
  services: Service[];
  onAddDrive: () => void;
  onAddFuel: () => void;
  onAddService: () => void;
  onOpenDrive: (d: Drive) => void;
}

export function HomePage({ drives, fuels, services, onAddDrive, onAddFuel, onAddService, onOpenDrive }: Props) {
  const totalKm = drives.reduce((s, d) => s + d.distance, 0);
  const totalFuel = fuels.reduce((s, f) => s + f.total, 0);
  const totalService = services.reduce((s, x) => s + x.cost, 0);
  const last = drives[0];

  return (
    <div className="space-y-6 animate-rise">
      <header className="pt-2">
        <p className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">My Driving Diary</p>
        <h1 className="text-3xl font-bold text-foreground mt-1 leading-tight">Your car journey</h1>
        <p className="text-sm text-muted-foreground mt-1">Every drive tells a story.</p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <StatCard label="Total Drives" value={drives.length} icon={<Car size={16} />} />
        <StatCard label="KM Driven" value={totalKm.toLocaleString()} hint="kilometers" icon={<Gauge size={16} />} />
        <StatCard label="Fuel Spent" value={`Rp ${(totalFuel / 1000).toFixed(0)}k`} icon={<FuelIcon size={16} />} />
        <StatCard label="Service Spent" value={`Rp ${(totalService / 1000).toFixed(0)}k`} icon={<Wrench size={16} />} />
      </section>

      <section>
        <SectionHeader title="Last Drive" subtitle={last ? "Your most recent journey" : "No drives yet"} />
        {last ? (
          <button
            onClick={() => onOpenDrive(last)}
            className="no-tap w-full text-left rounded-2xl bg-gradient-accent p-5 shadow-accent text-accent-foreground active:scale-[0.99] transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide opacity-80">{last.purpose}</span>
              <span className="text-3xl">{last.mood}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-lg font-bold">
              <span className="truncate">{last.start}</span>
              <span>→</span>
              <span className="truncate">{last.destination}</span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs opacity-90">
              <span className="inline-flex items-center gap-1"><MapPin size={12} /> {last.distance} km</span>
              <span>{new Date(last.date).toLocaleDateString()}</span>
            </div>
          </button>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center">
            <div className="text-3xl mb-2">🚗</div>
            <p className="text-sm text-muted-foreground">Start your car journey by adding your first drive.</p>
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-1 gap-2.5">
          <PrimaryButton onClick={onAddDrive} className="w-full justify-start">
            <Car size={18} /> Add Drive
          </PrimaryButton>
          <div className="grid grid-cols-2 gap-2.5">
            <PrimaryButton variant="ghost" onClick={onAddFuel}>
              <FuelIcon size={18} /> Add Fuel
            </PrimaryButton>
            <PrimaryButton variant="ghost" onClick={onAddService}>
              <Wrench size={18} /> Add Service
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
