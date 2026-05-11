import { useState } from "react";
import { ModalWrapper } from "./ModalWrapper";
import { PrimaryButton } from "./PrimaryButton";
import { addService } from "@/lib/storageService";
import { useCurrency } from "@/hooks/useCurrency";
import { toast } from "./Toaster";

const inputCls =
  "w-full rounded-xl bg-muted border border-border/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition";
const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide";

const SERVICE_TYPES = [
  "Oil change",
  "Tire rotation",
  "Brake service",
  "Battery",
  "General checkup",
  "Wash & detail",
  "Repair",
  "Other",
];

export function AddServiceModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const { info } = useCurrency();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [odometer, setOdometer] = useState("");
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [workshop, setWorkshop] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");

  const reset = () => {
    setDate(today);
    setOdometer("");
    setServiceType(SERVICE_TYPES[0]);
    setWorkshop("");
    setCost("");
    setNotes("");
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshop.trim() || !cost) {
      toast("Please fill workshop and cost");
      return;
    }
    addService({
      date,
      odometer: Number(odometer) || 0,
      serviceType,
      workshop: workshop.trim(),
      cost: Number(cost),
      notes: notes.trim() || undefined,
    });
    toast("Saved successfully");
    reset();
    onSaved?.();
    onClose();
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title="Add Service 🧰">
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className={labelCls}>Date</label>
          <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Odometer (km)</label>
          <input type="number" inputMode="numeric" className={inputCls} value={odometer} onChange={(e) => setOdometer(e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className={labelCls}>Service Type</label>
          <select className={inputCls} value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Workshop</label>
          <input className={inputCls} value={workshop} onChange={(e) => setWorkshop(e.target.value)} placeholder="AutoCare Garage" />
        </div>
        <div>
          <label className={labelCls}>Cost ({info.symbol})</label>
          <input type="number" inputMode="decimal" className={inputCls} value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className={labelCls}>Notes</label>
          <textarea className={inputCls + " min-h-[80px] resize-none"} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Replaced filter..." />
        </div>
        <div className="flex gap-3 pt-2">
          <PrimaryButton type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</PrimaryButton>
          <PrimaryButton type="submit" className="flex-1">Save Service</PrimaryButton>
        </div>
      </form>
    </ModalWrapper>
  );
}
