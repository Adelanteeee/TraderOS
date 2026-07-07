import { useEffect, useState } from "react";
import { ShieldAlert, Calculator, ArrowRight } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { LinearProgress } from "@/components/Progress/Progress";
import { useAppStore } from "@/store/useAppStore";
import { fetchTodaysUsedRiskPct } from "@/services/journalService";

export function Risk() {
  const todaysRiskPct = useAppStore((s) => s.dashboard.todaysRiskPct);
  const setTodaysRiskPct = useAppStore((s) => s.setTodaysRiskPct);
  const setSuggestedRiskPct = useAppStore((s) => s.setSuggestedRiskPct);

  const [autoSynced, setAutoSynced] = useState(false);
  const [offline, setOffline] = useState(false);

  const [balance, setBalance] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [stopPoints, setStopPoints] = useState(50);
  const [pointValue, setPointValue] = useState(1);
  const [justSuggested, setJustSuggested] = useState(false);

  useEffect(() => {
    fetchTodaysUsedRiskPct()
      .then((pct) => {
        setTodaysRiskPct(Math.min(100, pct));
        setAutoSynced(true);
      })
      .catch(() => setOffline(true));
    // Re-check every couple of minutes so a new Journal entry updates this without a manual refresh.
    const id = setInterval(() => {
      fetchTodaysUsedRiskPct()
        .then((pct) => setTodaysRiskPct(Math.min(100, pct)))
        .catch(() => setOffline(true));
    }, 120000);
    return () => clearInterval(id);
  }, [setTodaysRiskPct]);

  const riskAmount = (balance * riskPct) / 100;
  const positionSize = stopPoints > 0 && pointValue > 0 ? riskAmount / (stopPoints * pointValue) : 0;

  const handleSuggestToJournal = () => {
    setSuggestedRiskPct(riskPct);
    setJustSuggested(true);
    setTimeout(() => setJustSuggested(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">ریسک</h2>
        <p className="text-sm text-text-muted mt-1">
          حجم معامله رو بر اساس ریسک مشخص محاسبه کن و سقف روزانه رو زیر نظر داشته باش.
        </p>
      </div>

      <Card eyebrow="Today" title="ریسک استفاده‌شده‌ی امروز">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-1.5">
            <ShieldAlert size={16} className="text-text-muted" />
            <span className="num text-2xl font-semibold text-text-primary">{todaysRiskPct.toFixed(1)}%</span>
            <span className="text-xs text-text-muted">از سقف مجاز</span>
          </div>
          <LinearProgress value={todaysRiskPct} max={100} tone="bear" />
          {autoSynced ? (
            <p className="text-xs text-text-muted">
              خودکار از مجموع «ریسک این معامله» توی معاملات امروز (Journal) محاسبه شده — هر چند دقیقه یک‌بار به‌روز می‌شه.
            </p>
          ) : offline ? (
            <p className="text-xs text-gold">
              Supabase وصل نیست — این عدد نمی‌تونه خودکار از Journal محاسبه بشه.
            </p>
          ) : (
            <p className="text-xs text-text-muted">در حال محاسبه از روی معاملات امروز...</p>
          )}
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
            <p className="text-xs text-text-muted">
              مقدار ریسک: <span className="num text-text-primary">{riskAmount.toFixed(2)}</span>
            </p>
            <p className="text-sm font-semibold text-text-primary mt-0.5">
              حجم پیشنهادی: <span className="num">{positionSize.toFixed(2)}</span> لات/واحد
            </p>
          </div>
        </div>

        <Button variant="secondary" size="sm" onClick={handleSuggestToJournal} className="self-start">
          <ArrowRight size={14} />
          {justSuggested ? "به ژورنال فرستاده شد ✓" : `استفاده از ${riskPct}% در ثبت معامله‌ی بعدی`}
        </Button>
        <p className="text-xs text-text-muted">
          این عدد وقتی رفتی توی ژورنال و معامله‌ی جدید ثبت کردی، به‌عنوان پیش‌فرض «ریسک این معامله» پر می‌شه.
        </p>
      </Card>
    </div>
  );
}
