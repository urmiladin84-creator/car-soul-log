import { Drive } from "@/lib/storageService";
import { MapPin } from "lucide-react";

interface Props {
  drive: Drive;
  onClick?: () => void;
}

export function DriveCard({ drive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="no-tap w-full text-left rounded-2xl bg-gradient-card border border-border/40 shadow-card p-4 active:scale-[0.99] transition"
    >
      <div className="flex items-start gap-3">
        {drive.photo ? (
          <img
            src={drive.photo}
            alt=""
            className="h-16 w-16 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
            {drive.mood || "🚗"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-foreground font-semibold text-sm">
            <span className="truncate">{drive.start}</span>
            <span className="text-accent">→</span>
            <span className="truncate">{drive.destination}</span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{new Date(drive.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} /> {drive.distance} km
            </span>
            <span className="px-2 py-0.5 rounded-full bg-muted text-[10px]">{drive.purpose}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
