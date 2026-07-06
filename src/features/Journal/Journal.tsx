import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, ImageIcon } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import {
  addJournalEntry,
  deleteJournalEntry,
  fetchJournalEntries,
  type JournalEntry
} from "@/services/journalService";

const schema = z.object({
  trade: z.string().min(1, "نام یا نماد معامله را وارد کن"),
  screenshotUrl: z.string().max(500).optional().default(""),
  reason: z.string().max(500).optional().default(""),
  emotion: z.string().max(200).optional().default(""),
  mistake: z.string().max(500).optional().default(""),
  lesson: z.string().max(500).optional().default(""),
  score: z.number().min(0).max(100)
});

type FormValues = z.infer<typeof schema>;

export function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [offline, setOffline] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      trade: "",
      screenshotUrl: "",
      reason: "",
      emotion: "",
      mistake: "",
      lesson: "",
      score: 70
    }
  });

  useEffect(() => {
    fetchJournalEntries()
      .then(setEntries)
      .catch(() => setOffline(true));
  }, []);

  const onSubmit = async (values: FormValues) => {
    const optimistic: JournalEntry = { id: `local-${Date.now()}`, createdAt: new Date().toISOString(), ...values };
    setEntries((prev) => [optimistic, ...prev]);
    reset();
    try {
      const saved = await addJournalEntry(values);
      setEntries((prev) => [saved, ...prev.filter((e) => e.id !== optimistic.id)]);
    } catch {
      setOffline(true);
    }
  };

  const handleDelete = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (!id.startsWith("local-")) {
      try {
        await deleteJournalEntry(id);
      } catch {
        setOffline(true);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">ژورنال</h2>
        <p className="text-sm text-text-muted mt-1">هر معامله رو ثبت کن: دلیل، احساس، اشتباه و درسی که گرفتی.</p>
      </div>

      <Card eyebrow="New" title="ثبت معامله">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">معامله (Trade)</label>
            <input
              {...register("trade")}
              placeholder="XAUUSD Long, EURUSD Short, ..."
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
            />
            {formState.errors.trade && (
              <span className="text-xs text-bear">{formState.errors.trade.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">لینک اسکرین‌شات (اختیاری)</label>
            <input
              {...register("screenshotUrl")}
              placeholder="https://..."
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">دلیل ورود</label>
            <input
              {...register("reason")}
              placeholder="چرا وارد شدی؟"
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">احساس</label>
            <input
              {...register("emotion")}
              placeholder="آروم، مضطرب، مطمئن، ..."
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs text-text-muted">اشتباه</label>
            <input
              {...register("mistake")}
              placeholder="اگه اشتباهی بود..."
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs text-text-muted">درس</label>
            <textarea
              {...register("lesson")}
              rows={2}
              placeholder="چی یاد گرفتی؟"
              className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted">امتیاز (۰ تا ۱۰۰)</label>
            <input
              type="number"
              min={0}
              max={100}
              {...register("score", { valueAsNumber: true })}
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-sm text-text-primary num outline-none focus:border-accent"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <Button type="submit">ثبت در ژورنال</Button>
            {offline && (
              <span className="text-xs text-gold">Supabase وصل نیست — فعلاً فقط محلی ذخیره می‌شه</span>
            )}
          </div>
        </form>
      </Card>

      <div className="flex flex-col gap-2">
        {entries.length === 0 && (
          <p className="text-sm text-text-muted text-center py-6">هنوز معامله‌ای ثبت نشده.</p>
        )}
        {entries.map((entry) => (
          <Card key={entry.id} className="py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-text-primary">{entry.trade}</span>
                  <span className="num text-xs text-text-muted bg-surface-elevated rounded-lg px-2 py-0.5">
                    امتیاز {entry.score}
                  </span>
                  {entry.screenshotUrl && (
                    <a
                      href={entry.screenshotUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover"
                    >
                      <ImageIcon size={12} /> اسکرین‌شات
                    </a>
                  )}
                </div>
                {entry.reason && <p className="text-sm text-text-secondary mt-2">دلیل: {entry.reason}</p>}
                {entry.emotion && <p className="text-sm text-text-secondary mt-1">احساس: {entry.emotion}</p>}
                {entry.mistake && <p className="text-sm text-bear mt-1">اشتباه: {entry.mistake}</p>}
                {entry.lesson && <p className="text-sm text-bull mt-1">درس: {entry.lesson}</p>}
                <p className="text-xs text-text-muted mt-2 num">
                  {new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(
                    new Date(entry.createdAt)
                  )}
                </p>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                className="shrink-0 text-text-muted hover:text-bear transition-colors p-1"
                aria-label="حذف"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
