import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { Checkbox } from "@/components/Checkbox/Checkbox";
import { ScaleInput } from "./ScaleInput";
import { RadialGauge } from "@/components/Progress/Progress";
import { useAppStore } from "@/store/useAppStore";
import {
  computeMentalScore,
  fetchTodaysCheckin,
  submitCheckin
} from "@/services/mindService";

const checkinSchema = z.object({
  mood: z.number().min(1).max(5),
  sleepQuality: z.number().min(1).max(5),
  focus: z.number().min(1).max(5),
  stress: z.number().min(1).max(5),
  confidence: z.number().min(1).max(5),
  readyToTrade: z.boolean(),
  note: z.string().max(500)
});

type CheckinFormValues = z.infer<typeof checkinSchema>;

const DEFAULTS: CheckinFormValues = {
  mood: 3,
  sleepQuality: 3,
  focus: 3,
  stress: 3,
  confidence: 3,
  readyToTrade: true,
  note: ""
};

export function CheckinForm() {
  const setMentalScore = useAppStore((s) => s.setMentalScore);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "offline">("idle");
  const [alreadyLogged, setAlreadyLogged] = useState(false);

  const { control, handleSubmit, watch, reset } = useForm<CheckinFormValues>({
    resolver: zodResolver(checkinSchema),
    defaultValues: DEFAULTS
  });

  const live = watch();
  const livePreviewScore = computeMentalScore(live);

  useEffect(() => {
    fetchTodaysCheckin()
      .then((existing) => {
        if (existing) {
          setAlreadyLogged(true);
          reset({
            mood: existing.mood,
            sleepQuality: existing.sleepQuality,
            focus: existing.focus,
            stress: existing.stress,
            confidence: existing.confidence,
            readyToTrade: existing.readyToTrade,
            note: existing.note
          });
          setMentalScore(computeMentalScore(existing));
        }
      })
      .catch(() => {
        // Supabase not configured yet — form still works locally.
        setStatus("offline");
      });
  }, [reset, setMentalScore]);

  const onSubmit = async (values: CheckinFormValues) => {
    setStatus("saving");
    const score = computeMentalScore(values);
    setMentalScore(score); // update Dashboard immediately regardless of network
    try {
      await submitCheckin(values);
      setStatus("saved");
      setAlreadyLogged(true);
    } catch {
      setStatus("offline");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
      <Card
        eyebrow="Mind"
        title="چک‌این روزانه"
        action={
          alreadyLogged && (
            <span className="text-xs text-bull bg-bull-soft px-2 py-1 rounded-lg">امروز ثبت شده</span>
          )
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="mood"
            control={control}
            render={({ field }) => <ScaleInput label="حال و هوا (Mood)" value={field.value} onChange={field.onChange} />}
          />
          <Controller
            name="sleepQuality"
            control={control}
            render={({ field }) => (
              <ScaleInput label="کیفیت خواب" value={field.value} onChange={field.onChange} />
            )}
          />
          <Controller
            name="focus"
            control={control}
            render={({ field }) => <ScaleInput label="تمرکز" value={field.value} onChange={field.onChange} />}
          />
          <Controller
            name="stress"
            control={control}
            render={({ field }) => (
              <ScaleInput label="استرس" value={field.value} onChange={field.onChange} invert />
            )}
          />
          <Controller
            name="confidence"
            control={control}
            render={({ field }) => (
              <ScaleInput label="اعتمادبه‌نفس" value={field.value} onChange={field.onChange} />
            )}
          />
          <Controller
            name="readyToTrade"
            control={control}
            render={({ field }) => (
              <Checkbox label="آماده‌ی معامله هستم" checked={field.value} onChange={field.onChange} />
            )}
          />
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                placeholder="یادداشت کوتاه (اختیاری)..."
                className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent resize-none"
              />
            )}
          />
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={status === "saving"}>
              {alreadyLogged ? "به‌روزرسانی چک‌این" : "ثبت چک‌این"}
            </Button>
            {status === "offline" && (
              <span className="text-xs text-gold">
                Supabase وصل نیست — فعلاً فقط روی داشبورد ذخیره شد
              </span>
            )}
            {status === "saved" && <span className="text-xs text-bull">ذخیره شد ✓</span>}
          </div>
        </form>
      </Card>
      <Card eyebrow="Preview" title="Mental Score" className="items-center justify-center">
        <RadialGauge value={livePreviewScore} tone="accent" label="پیش‌نمایش زنده" />
      </Card>
    </div>
  );
}
