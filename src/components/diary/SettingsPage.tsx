import { useRef, useState } from "react";
import { APP_VERSION, exportAll, importAll, resetAll } from "@/lib/storageService";
import { PrimaryButton } from "@/components/diary/PrimaryButton";
import { toast } from "@/components/diary/Toaster";
import { Download, Upload, Trash2 } from "lucide-react";

export function SettingsPage({ onChanged }: { onChanged: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-driving-diary-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Exported successfully");
  };

  const handleImport = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        importAll(data);
        onChanged();
        toast("Imported successfully");
      } catch {
        toast("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetAll();
    setConfirming(false);
    onChanged();
    toast("All data reset");
  };

  return (
    <div className="space-y-5 animate-rise">
      <header className="pt-2">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your diary data</p>
      </header>

      <div className="space-y-3">
        <PrimaryButton variant="ghost" onClick={handleExport} className="w-full justify-start">
          <Download size={18} className="text-accent" /> Export data (JSON)
        </PrimaryButton>

        <PrimaryButton variant="ghost" onClick={() => fileRef.current?.click()} className="w-full justify-start">
          <Upload size={18} className="text-accent" /> Import data
        </PrimaryButton>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => handleImport(e.target.files?.[0])}
        />

        {confirming ? (
          <div className="rounded-2xl bg-[var(--danger)]/10 border border-[var(--danger)]/40 p-4 space-y-3">
            <p className="text-sm text-foreground">Reset ALL data? This cannot be undone.</p>
            <div className="flex gap-2">
              <PrimaryButton variant="ghost" className="flex-1" onClick={() => setConfirming(false)}>Cancel</PrimaryButton>
              <PrimaryButton variant="danger" className="flex-1" onClick={handleReset}>Reset</PrimaryButton>
            </div>
          </div>
        ) : (
          <PrimaryButton variant="outline" onClick={() => setConfirming(true)} className="w-full justify-start">
            <Trash2 size={18} className="text-[var(--danger)]" /> Reset all data
          </PrimaryButton>
        )}
      </div>

      <div className="rounded-2xl bg-card/60 border border-border/40 p-4 text-center">
        <p className="text-xs text-muted-foreground">My Driving Diary</p>
        <p className="text-sm font-semibold text-foreground mt-1">v{APP_VERSION}</p>
        <p className="text-[10px] text-muted-foreground mt-2">Offline-first · Your data stays on your device</p>
      </div>
    </div>
  );
}
