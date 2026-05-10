import { Drive, deleteDrive } from "@/lib/storageService";
import { ModalWrapper } from "./ModalWrapper";
import { PrimaryButton } from "./PrimaryButton";
import { useState } from "react";
import { toast } from "./Toaster";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";

export function DriveDetailModal({
  drive,
  open,
  onClose,
  onDeleted,
}: {
  drive: Drive | null;
  open: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  if (!drive) return null;

  const handleDelete = () => {
    deleteDrive(drive.id);
    toast("Drive deleted");
    setConfirming(false);
    onDeleted?.();
    onClose();
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title={`${drive.mood} Drive`}>
      <div className="space-y-4">
        {drive.photo && (
          <img src={drive.photo} alt="" className="w-full h-48 object-cover rounded-2xl" />
        )}
        <div className="rounded-2xl bg-gradient-card border border-border/40 p-4">
          <div className="flex items-center gap-2 text-base font-bold text-foreground">
            <span className="truncate">{drive.start}</span>
            <span className="text-accent">→</span>
            <span className="truncate">{drive.destination}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><Calendar size={14} className="text-accent" /> {new Date(drive.date).toLocaleDateString()}</div>
            <div className="flex items-center gap-2"><MapPin size={14} className="text-accent" /> {drive.distance} km</div>
            {drive.duration && <div className="flex items-center gap-2"><Clock size={14} className="text-accent" /> {drive.duration}</div>}
            <div className="flex items-center gap-2"><Tag size={14} className="text-accent" /> {drive.purpose}</div>
          </div>
        </div>
        {drive.notes && (
          <div className="rounded-2xl bg-muted/50 p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Notes</div>
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{drive.notes}</p>
          </div>
        )}
        {confirming ? (
          <div className="rounded-2xl bg-[var(--danger)]/10 border border-[var(--danger)]/40 p-4 space-y-3">
            <p className="text-sm text-foreground">Delete this drive? This cannot be undone.</p>
            <div className="flex gap-2">
              <PrimaryButton type="button" variant="ghost" className="flex-1" onClick={() => setConfirming(false)}>Cancel</PrimaryButton>
              <PrimaryButton type="button" variant="danger" className="flex-1" onClick={handleDelete}>Delete</PrimaryButton>
            </div>
          </div>
        ) : (
          <PrimaryButton type="button" variant="outline" className="w-full" onClick={() => setConfirming(true)}>
            Delete drive
          </PrimaryButton>
        )}
      </div>
    </ModalWrapper>
  );
}
