import { useState } from "react";
import { Plus, Car, Fuel, Wrench, X } from "lucide-react";

interface Props {
  onAddDrive: () => void;
  onAddFuel: () => void;
  onAddService: () => void;
}

export function FloatingActionButton({ onAddDrive, onAddFuel, onAddService }: Props) {
  const [open, setOpen] = useState(false);

  const action = (label: string, icon: React.ReactNode, onClick: () => void, delay: string) => (
    <button
      onClick={() => { setOpen(false); onClick(); }}
      style={{ animationDelay: delay }}
      className="no-tap animate-rise flex items-center gap-3 rounded-full bg-card border border-border/60 pl-4 pr-5 py-3 shadow-card text-sm font-semibold text-foreground active:scale-95 transition"
    >
      <span className="text-accent">{icon}</span>
      {label}
    </button>
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm animate-pop"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-3 safe-bottom">
        {open && (
          <>
            {action("Add Service", <Wrench size={18} />, onAddService, "0ms")}
            {action("Add Fuel", <Fuel size={18} />, onAddFuel, "40ms")}
            {action("Add Drive", <Car size={18} />, onAddDrive, "80ms")}
          </>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className="no-tap h-14 w-14 rounded-full bg-gradient-accent shadow-accent flex items-center justify-center text-accent-foreground active:scale-90 transition"
          aria-label="Quick add"
        >
          {open ? <X size={26} /> : <Plus size={26} />}
        </button>
      </div>
    </>
  );
}
