import { useMemo, useState } from "react";
import { ModalWrapper } from "./ModalWrapper";
import { PrimaryButton } from "./PrimaryButton";
import { addFuel } from "@/lib/storageService";
import { useCurrency } from "@/hooks/useCurrency";
import { toast } from "./Toaster";

const inputCls =
  "w-full rounded-xl bg-muted border border-border/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition";
const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide";

const FUEL_TYPES = ["Pertalite", "Pertamax", "Pertamax Turbo", "Diesel", "Premium", "Other"];

export function AddFuelModal({
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
  const [odometer, setOdometer] = useState("");
  const [liters, setLiters] = useState("");
  const [price, setPrice] = useState("");
  const [fuelType, setFuelType] = useState(FUEL_TYPES[0]);

  const total = useMemo(() => {
    const l = parseFloat(liters);
    const p = parseFloat(price);
    if (!l || !p) return 0;
    return +(l * p).toFixed(2);
  }, [liters, price]);

  const reset = () => {
    setDate(today);
    setOdometer("");
    setLiters("");
    setPrice("");
    setFuelType(FUEL_TYPES[0]);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liters || !price) {
      toast("Please enter liters and price");
      return;
    }
    addFuel({
      date,
      odometer: Number(odometer) || 0,
      liters: Number(liters),
      pricePerLiter: Number(price),
      fuelType,
    });
    toast("Saved successfully");
    reset();
    onSaved?.();
    onClose();
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title="Add Fuel ⛽">
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className={labelCls}>Date</label>
          <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Odometer (km)</label>
          <input type="number" inputMode="numeric" className={inputCls} value={odometer} onChange={(e) => setOdometer(e.target.value)} placeholder="0" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Liters</label>
            <input type="number" inputMode="decimal" step="0.01" className={inputCls} value={liters} onChange={(e) => setLiters(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className={labelCls}>Price / liter</label>
            <input type="number" inputMode="decimal" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Fuel Type</label>
          <select className={inputCls} value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
            {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="rounded-xl bg-gradient-accent p-4 text-accent-foreground">
          <div className="text-xs uppercase tracking-wide opacity-80">Total cost</div>
          <div className="text-2xl font-bold mt-1">Rp {total.toLocaleString()}</div>
        </div>
        <div className="flex gap-3 pt-2">
          <PrimaryButton type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</PrimaryButton>
          <PrimaryButton type="submit" className="flex-1">Save Fuel</PrimaryButton>
        </div>
      </form>
    </ModalWrapper>
  );
}
