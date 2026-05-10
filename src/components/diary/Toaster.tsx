import { useEffect, useState } from "react";

type Toast = { id: number; message: string };
let listeners: ((t: Toast) => void)[] = [];

export function toast(message: string) {
  listeners.forEach((l) => l({ id: Date.now() + Math.random(), message }));
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    const fn = (t: Toast) => {
      setItems((prev) => [...prev, t]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), 2200);
    };
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
      {items.map((t) => (
        <div
          key={t.id}
          className="animate-rise rounded-2xl bg-card px-5 py-3 text-sm font-medium text-foreground shadow-card border border-border/60"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
