interface Props {
  value: string;
  onChange: (v: string) => void;
}

const MOODS = ["😍", "😎", "😊", "😌", "🤩", "😴", "😤", "🥲", "🤔", "🌧️"];

export function EmojiMoodPicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOODS.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`no-tap h-11 w-11 rounded-xl text-2xl flex items-center justify-center transition active:scale-90 ${
            value === m ? "bg-accent/20 ring-2 ring-accent" : "bg-muted hover:bg-muted/70"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
