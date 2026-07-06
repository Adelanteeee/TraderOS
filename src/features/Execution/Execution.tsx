import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { Checkbox } from "@/components/Checkbox/Checkbox";
import { Button } from "@/components/Button/Button";
import { LinearProgress } from "@/components/Progress/Progress";
import { useAppStore } from "@/store/useAppStore";
import { DEFAULT_CHECKLIST } from "./checklistData";
import { fetchChecklist, resetChecklist, setChecklistItemDone } from "@/services/checklistService";

interface Item {
  id: string;
  label: string;
  done: boolean;
}

export function Execution() {
  const setChecklistProgress = useAppStore((s) => s.setChecklistProgress);
  const [items, setItems] = useState<Item[]>(
    DEFAULT_CHECKLIST.map((d) => ({ id: d.id, label: d.label, done: false }))
  );
  const [offline, setOffline] = useState(false);
  const [justExecuted, setJustExecuted] = useState(false);

  useEffect(() => {
    fetchChecklist()
      .then((rows) => setItems(rows.map((r) => ({ id: r.id, label: r.label, done: r.done }))))
      .catch(() => setOffline(true));
  }, []);

  useEffect(() => {
    const done = items.filter((i) => i.done).length;
    setChecklistProgress(done, items.length);
  }, [items, setChecklistProgress]);

  const toggle = (id: string, done: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done } : i)));
    setChecklistItemDone(id, done).catch(() => setOffline(true));
  };

  const doneCount = items.filter((i) => i.done).length;
  const allDone = items.length > 0 && doneCount === items.length;

  const handleExecute = () => {
    setJustExecuted(true);
    setItems((prev) => prev.map((i) => ({ ...i, done: false })));
    resetChecklist().catch(() => setOffline(true));
    setTimeout(() => setJustExecuted(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">اجرا</h2>
        <p className="text-sm text-text-muted mt-1">
          قبل از ورود به هر معامله، این چک‌لیست را کامل کن.
        </p>
      </div>

      <Card
        eyebrow="Execution"
        title="Trade Checklist"
        action={
          <span className="num text-xs text-text-muted">
            {doneCount}/{items.length}
          </span>
        }
      >
        <LinearProgress value={doneCount} max={items.length} tone="accent" />
        <div className="flex flex-col divide-y divide-border-soft mt-1">
          {items.map((item) => (
            <Checkbox
              key={item.id}
              label={item.label}
              checked={item.done}
              onChange={(done) => toggle(item.id, done)}
            />
          ))}
        </div>

        <Button
          onClick={handleExecute}
          disabled={!allDone}
          className="mt-2 w-full"
        >
          <Zap size={15} />
          {justExecuted ? "اجرا شد ✓" : "Execute Trade"}
        </Button>

        {offline && (
          <span className="text-xs text-gold">
            Supabase وصل نیست — چک‌لیست فعلاً فقط محلی ذخیره می‌شه
          </span>
        )}
      </Card>
    </div>
  );
}
