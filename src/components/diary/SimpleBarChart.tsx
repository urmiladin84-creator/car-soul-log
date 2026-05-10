interface Props {
  data: { label: string; value: number }[];
  formatValue?: (v: number) => string;
}

export function SimpleBarChart({ data, formatValue }: Props) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-2.5">
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={d.label} className="flex items-center gap-3">
            <span className="w-12 text-xs text-muted-foreground shrink-0">{d.label}</span>
            <div className="flex-1 h-7 rounded-lg bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-accent rounded-lg flex items-center justify-end px-2 text-[10px] font-semibold text-accent-foreground transition-all"
                style={{ width: `${Math.max(pct, d.value > 0 ? 8 : 0)}%` }}
              >
                {d.value > 0 && (formatValue ? formatValue(d.value) : d.value)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
