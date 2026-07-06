HEAD
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrendingUp, TrendingDown, Minus, Trash2 } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { flattenMarketConcepts } from "@/features/Market/marketTaxonomy";
import { addAnalysis, deleteAnalysis, fetchAnalyses } from "@/services/analysisService";
import type { AnalysisEntry } from "@/types";

const TIMEFRAMES = ["M15", "H1", "H4", "D1", "W1"];
const TRENDS = ["Bullish", "Bearish", "Ranging"];
const BIAS_META = {
  bullish: { label: "Bullish", icon: TrendingUp, tone: "text-bull bg-bull-soft" },
  bearish: { label: "Bearish", icon: TrendingDown, tone: "text-bear bg-bear-soft" },
  neutral: { label: "Neutral", icon: Minus, tone: "text-gold bg-gold-soft" }
} as const;

const schema = z.object({
  instrument: z.string().min(1, "نام نماد را وارد کن"),
  timeframe: z.string().min(1),
  marketCycleStage: z.string().min(1),
  trend: z.string().min(1),
  bias: z.enum(["bullish", "bearish", "neutral"]),
  notes: z.string().max(1000)
});

type FormValues = z.infer<typeof schema>;

const marketStages = flattenMarketConcepts();

export function Analysis() {
  const [entries, setEntries] = useState<AnalysisEntry[]>([]);
  const [offline, setOffline] = useState(false);

  const { control, register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      instrument: "",
      timeframe: "H4",
      marketCycleStage: marketStages[0]?.id ?? "",
      trend: "Bullish",
      bias: "bullish",
      notes: ""
    }
  });

  useEffect(() => {
    fetchAnalyses()
      .then(setEntries)
      .catch(() => setOffline(true));
  }, []);

  const onSubmit = async (values: FormValues) => {
    const optimistic: AnalysisEntry = { id: `local-${Date.now()}`, createdAt: new Date().toISOString(), ...values };
    setEntries((prev) => [optimistic, ...prev]);
    reset();
    try {
      const saved = await addAnalysis(values);
      setEntries((prev) => [saved, ...prev.filter((e) => e.id !== optimistic.id)]);
    } catch {
      setOffline(true);
    }
  };

  const handleDelete = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (!id.startsWith("local-")) {
      try {
        await deleteAnalysis(id);
      } catch {
        setOffline(true);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">تحلیل</h2>
        <p className="text-sm text-text-muted mt-1">
          تحلیل بالا به پایین ثبت کن: نماد، تایم‌فریم، مرحله‌ی چرخه‌ی بازار و جهت‌گیری.
        </p>
      </div>

      <Card eyebrow="New" title="تحلیل جدید">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">نماد</label>
            <input
              {...register("instrument")}
              placeholder="XAUUSD, EURUSD, ..."
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
            />
            {formState.errors.instrument && (
              <span className="text-xs text-bear">{formState.errors.instrument.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">تایم‌فریم</label>
            <select
              {...register("timeframe")}
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary outline-none focus:border-accent"
            >
              {TIMEFRAMES.map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">مرحله‌ی چرخه‌ی بازار</label>
            <select
              {...register("marketCycleStage")}
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary outline-none focus:border-accent"
            >
              {marketStages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">روند</label>
            <select
              {...register("trend")}
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary outline-none focus:border-accent"
            >
              {TRENDS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs text-text-muted">جهت‌گیری (Bias)</label>
            <Controller
              name="bias"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  {(Object.keys(BIAS_META) as (keyof typeof BIAS_META)[]).map((key) => {
                    const meta = BIAS_META[key];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => field.onChange(key)}
                        className={clsx(
                          "flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs transition-colors",
                          field.value === key
                            ? clsx(meta.tone, "border-transparent")
                            : "border-border text-text-muted hover:text-text-secondary"
                        )}
                      >
                        <Icon size={14} />
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs text-text-muted">یادداشت</label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="دلیل تحلیل، سطوح کلیدی، سناریو..."
              className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <Button type="submit">ثبت تحلیل</Button>
            {offline && (
              <span className="text-xs text-gold">Supabase وصل نیست — فعلاً فقط محلی ذخیره می‌شه</span>
            )}
          </div>
        </form>
      </Card>

      <div className="flex flex-col gap-2">
        {entries.length === 0 && (
          <p className="text-sm text-text-muted text-center py-6">هنوز تحلیلی ثبت نشده.</p>
        )}
        {entries.map((entry) => {
          const meta = BIAS_META[entry.bias];
          const Icon = meta.icon;
          const stageLabel = marketStages.find((s) => s.id === entry.marketCycleStage)?.label ?? entry.marketCycleStage;
          return (
            <Card key={entry.id} className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-text-primary">{entry.instrument}</span>
                    <span className="text-xs text-text-muted num">{entry.timeframe}</span>
                    <span className={clsx("flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs", meta.tone)}>
                      <Icon size={12} />
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1.5">
                    {stageLabel} · {entry.trend}
                  </p>
                  {entry.notes && <p className="text-sm text-text-secondary mt-2 whitespace-pre-wrap">{entry.notes}</p>}
                  <p className="text-xs text-text-muted mt-2 num">
                    {new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(
                      new Date(entry.createdAt)
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="shrink-0 text-text-muted hover:text-bear transition-colors p-1"
                  aria-label="حذف تحلیل"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </Card>
          );
        })}

