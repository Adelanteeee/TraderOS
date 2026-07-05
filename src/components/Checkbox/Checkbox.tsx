import { Check } from "lucide-react";
import clsx from "clsx";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label
      className={clsx(
        "flex items-center gap-3 py-2 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          "h-5 w-5 shrink-0 rounded-md border flex items-center justify-center transition-colors",
          checked ? "bg-accent border-accent" : "border-border bg-surface-elevated"
        )}
      >
        {checked && <Check size={13} strokeWidth={3} className="text-white" />}
      </button>
      <span
        className={clsx(
          "text-sm text-text-secondary",
          checked && "text-text-primary line-through decoration-text-muted"
        )}
      >
        {label}
      </span>
    </label>
  );
}
