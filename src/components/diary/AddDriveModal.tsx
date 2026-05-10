import { useState } from "react";
import { ModalWrapper } from "./ModalWrapper";
import { PrimaryButton } from "./PrimaryButton";
import { EmojiMoodPicker } from "./EmojiMoodPicker";
import { addDrive, Purpose } from "@/lib/storageService";
import { toast } from "./Toaster";
import { Camera } from "lucide-react";

const PURPOSES: Purpose[] = ["Commute", "Road Trip", "Family Trip", "Night Drive", "Work", "Errands", "Other"];

const inputCls =
  "w-full rounded-xl bg-muted border border-border/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition";
const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide";

export function AddDriveModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("Commute");
  const [mood, setMood] = useState("😊");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();

  const reset = () => {
    setDate(today);
    setStart("");
    setDestination("");
    setDistance("");
    setDuration("");
    setPurpose("Commute");
    setMood("😊");
    setNotes("");
    setPhoto(undefined);
  };

  const handlePhoto = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!start.trim() || !destination.trim() || !distance) {
      toast("Please fill route and distance");
      return;
    }
    addDrive({
      date,
      start: start.trim(),
      destination: destination.trim(),
      distance: Number(distance),
      duration: duration.trim() || undefined,
      purpose,
      mood,
      notes: notes.trim() || undefined,
      photo,
    });
    toast("Saved successfully");
    reset();
    onSaved?.();
    onClose();
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title="Add Drive 🚗">
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className={labelCls}>Date</label>
          <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Start</label>
            <input className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} placeholder="Home" />
          </div>
          <div>
            <label className={labelCls}>Destination</label>
            <input className={inputCls} value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Office" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Distance (km)</label>
            <input type="number" inputMode="decimal" step="0.1" className={inputCls} value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className={labelCls}>Duration</label>
            <input className={inputCls} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="45 min" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Purpose</label>
          <select className={inputCls} value={purpose} onChange={(e) => setPurpose(e.target.value as Purpose)}>
            {PURPOSES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Mood</label>
          <EmojiMoodPicker value={mood} onChange={setMood} />
        </div>
        <div>
          <label className={labelCls}>Notes</label>
          <textarea
            className={inputCls + " min-h-[80px] resize-none"}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Sunset on the highway..."
          />
        </div>
        <div>
          <label className={labelCls}>Photo</label>
          <label className="flex items-center gap-3 rounded-xl border border-dashed border-border/80 bg-muted/40 px-4 py-3 cursor-pointer no-tap">
            <Camera size={18} className="text-accent" />
            <span className="text-sm text-muted-foreground">{photo ? "Change photo" : "Add photo"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhoto(e.target.files?.[0])} />
          </label>
          {photo && <img src={photo} alt="" className="mt-2 h-32 w-full rounded-xl object-cover" />}
        </div>
        <div className="flex gap-3 pt-2">
          <PrimaryButton type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</PrimaryButton>
          <PrimaryButton type="submit" className="flex-1">Save Drive</PrimaryButton>
        </div>
      </form>
    </ModalWrapper>
  );
}
