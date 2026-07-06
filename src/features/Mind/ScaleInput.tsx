import clsx from "clsx";

interface ScaleInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  invert?: boolean; // when true, 5 is drawn as "worse" visually (e.g. Stress)
}

export function ScaleInput({ label, value, onChange, invert }: ScaleInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-text-secondary">{label}</p>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${label}: ${n}`}
              className={clsx(
                "h-9 flex-1 rounded-lg border text-xs num transition-colors",
                active
                  ? invert
                    ? "bg-bear/80 border-bear text-white"
                    : "bg-accent/80 border-accent text-white"
                  : "border-border bg-surface-elevated text-text-muted hover:text-text-secondary"
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
