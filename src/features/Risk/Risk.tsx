import { useState } from "react";
import { ShieldAlert, Calculator } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { LinearProgress } from "@/components/Progress/Progress";
import { useAppStore } from "@/store/useAppStore";

export function Risk() {
  const todaysRiskPct = useAppStore((s) => s.dashboard.todaysRiskPct);
  const setTodaysRiskPct = useAppStore((s) => s.setTodaysRiskPct);

  const [balance, setBalance] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [stopPoints, setStopPoints] = useState(50);
  const [pointValue, setPointValue] = useState(1);

  const riskAmount = (balance * riskPct) / 100;
  const positionSize = stopPoints > 0 && pointValue > 0 ? riskAmount / (stopPoints * pointValue) : 0;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">ریسک</h2>
        <p className="text-sm text-text-muted mt-1">حجم معامله رو بر اساس ریسک مشخص محاسبه کن و سقف روزانه رو زیر نظر داشته باش.</p>
      </div>

      <Card eyebrow="Today" title="ریسک استفاده‌شده‌ی امروز">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-1.5">
            <ShieldAlert size={16} className="text-text-muted" />
            <span className="num text-2xl font-semibold text-text-primary">{todaysRiskPct}%</span>
            <span className="text-xs text-text-muted">از سقف مجاز</span>
          </div>
          <LinearProgress value={todaysRiskPct} max={100} tone="bear" />
          <input
            type="range"
            min={0}
            max={100}
            value={todaysRiskPct}
            onChange={(e) => setTodaysRiskPct(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <p className="text-xs text-text-muted">
            بعد از هر معامله دستی آپدیت کن؛ اتصال خودکار به تاریخچه‌ی معاملات در اسپرینت بعد اضافه می‌شه.
          </p>
        </div>
      </Card>

      <Card eyebrow="Calculator" title="محاسبه‌گر حجم معامله">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">موجودی حساب</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary num outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">ریسک (%)</label>
            <input
              type="number"
              step={0.1}
              value={riskPct}
              onChange={(e) => setRiskPct(Number(e.target.value))}
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary num outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">فاصله‌ی حد ضرر (پوینت)</label>
            <input
              type="number"
              value={stopPoints}
              onChange={(e) => setStopPoints(Number(e.target.value))}
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary num outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">ارزش هر پوینت</label>
            <input
              type="number"
              step={0.01}
              value={pointValue}
              onChange={(e) => setPointValue(Number(e.target.value))}
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary num outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3 rounded-xl bg-accent-soft p-4">
          <Calculator size={18} className="text-accent shrink-0" />
          <div>
            <p className="text-xs text-text-muted">مقدار ریسک: <span className="num text-text-primary">{riskAmount.toFixed(2)}</span></p>
            <p className="text-sm font-semibold text-text-primary mt-0.5">
              حجم پیشنهادی: <span className="num">{positionSize.toFixed(2)}</span> لات/واحد
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
