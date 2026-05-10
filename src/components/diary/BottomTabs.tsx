import { Home, Car, Clock, BarChart3, Settings } from "lucide-react";

export type Tab = "home" | "drives" | "timeline" | "stats" | "settings";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "drives", label: "Drives", icon: Car },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function BottomTabs({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-card/95 backdrop-blur-lg safe-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`no-tap flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition ${
                isActive ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
