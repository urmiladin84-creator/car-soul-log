import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import {
  Drive,
  Fuel,
  Service,
  getDrives,
  getFuels,
  getServices,
} from "@/lib/storageService";
import { BottomTabs, Tab } from "@/components/diary/BottomTabs";
import { FloatingActionButton } from "@/components/diary/FloatingActionButton";
import { HomePage } from "@/components/diary/HomePage";
import { DrivesPage } from "@/components/diary/DrivesPage";
import { TimelinePage } from "@/components/diary/TimelinePage";
import { StatsPage } from "@/components/diary/StatsPage";
import { SettingsPage } from "@/components/diary/SettingsPage";
import { AddDriveModal } from "@/components/diary/AddDriveModal";
import { AddFuelModal } from "@/components/diary/AddFuelModal";
import { AddServiceModal } from "@/components/diary/AddServiceModal";
import { DriveDetailModal } from "@/components/diary/DriveDetailModal";
import { Toaster } from "@/components/diary/Toaster";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Driving Diary" },
      { name: "description", content: "Offline-first car diary for drives, fuel, and service." },
      { name: "theme-color", content: "#0F172A" },
    ],
  }),
  component: Index,
});

function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [drives, setDrives] = useState<Drive[]>([]);
  const [fuels, setFuels] = useState<Fuel[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [showDrive, setShowDrive] = useState(false);
  const [showFuel, setShowFuel] = useState(false);
  const [showService, setShowService] = useState(false);
  const [openedDrive, setOpenedDrive] = useState<Drive | null>(null);

  const refresh = () => {
    setDrives(getDrives());
    setFuels(getFuels());
    setServices(getServices());
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <main className="mx-auto max-w-md px-4 pt-6 pb-28">
        {tab === "home" && (
          <HomePage
            drives={drives}
            fuels={fuels}
            services={services}
            onAddDrive={() => setShowDrive(true)}
            onAddFuel={() => setShowFuel(true)}
            onAddService={() => setShowService(true)}
            onOpenDrive={(d) => setOpenedDrive(d)}
          />
        )}
        {tab === "drives" && <DrivesPage drives={drives} onOpenDrive={(d) => setOpenedDrive(d)} />}
        {tab === "timeline" && <TimelinePage drives={drives} fuels={fuels} services={services} />}
        {tab === "stats" && <StatsPage drives={drives} fuels={fuels} services={services} />}
        {tab === "settings" && <SettingsPage onChanged={refresh} />}
      </main>

      <FloatingActionButton
        onAddDrive={() => setShowDrive(true)}
        onAddFuel={() => setShowFuel(true)}
        onAddService={() => setShowService(true)}
      />

      <BottomTabs active={tab} onChange={setTab} />

      <AddDriveModal open={showDrive} onClose={() => setShowDrive(false)} onSaved={refresh} />
      <AddFuelModal open={showFuel} onClose={() => setShowFuel(false)} onSaved={refresh} />
      <AddServiceModal open={showService} onClose={() => setShowService(false)} onSaved={refresh} />
      <DriveDetailModal
        drive={openedDrive}
        open={openedDrive !== null}
        onClose={() => setOpenedDrive(null)}
        onDeleted={refresh}
      />
    </div>
  );
}

function Index() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      <App />
    </ClientOnly>
  );
}
