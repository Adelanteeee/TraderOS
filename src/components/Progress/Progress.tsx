import { motion } from "framer-motion";
import clsx from "clsx";

interface RadialGaugeProps {
  value: number; // 0-100
  size?: number;
  label?: string;
  tone?: "accent" | "bull" | "bear" | "gold";
  suffix?: string;
}

const TONE_COLOR: Record<NonNullable<RadialGaugeProps["tone"]>, string> = {
  accent: "#4C7EFF",
  bull: "#3FB950",
  bear: "#E5484D",
  gold: "#E8A33D"
};

const TICKS = 40;
const TICK_ARC_DEGREES = 270; // instrument-dial sweep, not a full circle

export function RadialGauge({ value, size = 120, label, tone = "accent", suffix = "%" }: RadialGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const color = TONE_COLOR[tone];
  const radius = size / 2;
  const tickRadius = radius - 6;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[135deg]">
          {Array.from({ length: TICKS }).map((_, i) => {
            const angle = (i / (TICKS - 1)) * TICK_ARC_DEGREES;
            const rad = (angle * Math.PI) / 180;
            const active = i / (TICKS - 1) <= clamped / 100;
            const x1 = radius + Math.cos(rad) * (tickRadius - 4);
            const y1 = radius + Math.sin(rad) * (tickRadius - 4);
            const x2 = radius + Math.cos(rad) * tickRadius;
            const y2 = radius + Math.sin(rad) * tickRadius;
            return (
              <motion.line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={active ? color : "#242730"}
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.008 }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="num text-2xl font-semibold text-text-primary">
            {Math.round(clamped)}
            <span className="text-sm text-text-muted">{suffix}</span>
          </span>
        </div>
      </div>
      {label && <p className={clsx("text-xs text-text-muted uppercase tracking-wide")}>{label}</p>}
    </div>
  );
}

interface LinearProgressProps {
  value: number;
  max: number;
  tone?: "accent" | "bull" | "bear" | "gold";
}

export function LinearProgress({ value, max, tone = "accent" }: LinearProgressProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const color = TONE_COLOR[tone];
  return (
    <div className="h-1.5 w-full rounded-full bg-surface-elevated overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}
