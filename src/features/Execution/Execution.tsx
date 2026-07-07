import { useEffect, useState } from "react";
import { Zap, Check, Info } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { LinearProgress } from "@/components/Progress/Progress";
import { useAppStore } from "@/store/useAppStore";
import { DEFAULT_CHECKLIST } from "./checklistData";
import { fetchChecklist, resetChecklist, setChecklistItemDone } from "@/services/checklistService";

interface Item {
  id: string;
  label: string;
  description: string;
  done: boolean;
}

const DESCRIPTION_BY_ID = new Map(DEFAULT_CHECKLIST.map((d) => [d.id, d.description]));

function withDescription(id: string, label: string, done: boolean): Item {
  return { id, label, done, description: DESCRIPTION_BY_ID.get(id) ?? "" };
}

export function Execution() {
  const setChecklistProgress = useAppStore((s) => s.setChecklistProgress);
  const [items, setItems] = useState<Item[]>(
    DEFAULT_CHECKLIST.map((d) => withDescription(d.id, d.label, false))
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [justExecuted, setJustExecuted] = useState(false);

  useEffect(() => {
    fetchChecklist()
      .then((rows) => setItems(rows.map((r) => withDescription(r.id, r.label, r.done))))
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
          قبل از ورود به هر معامله، این چک‌لیست را کامل کن. برای توضیح هر مرحله روی آیکن اطلاعات بزن.
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
            <div key={item.id}>
              <div className="flex items-center gap-2 py-1">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={item.done}
                  onClick={() => toggle(item.id, !item.done)}
                  className={clsx(
                    "h-5 w-5 shrink-0 rounded-md border flex items-center justify-center transition-colors",
                    item.done ? "bg-accent border-accent" : "border-border bg-surface-elevated"
                  )}
                >
                  {item.done && <Check size={13} strokeWidth={3} className="text-white" />}
                </button>
                <button
                  type="button"
                  onClick={() => toggle(item.id, !item.done)}
                  className={clsx(
                    "flex-1 text-right text-sm py-1",
                    item.done ? "text-text-primary line-through decoration-text-muted" : "text-text-secondary"
                  )}
                >
                  {item.label}
                </button>
                {item.description && (
                  <button
                    type="button"
                    onClick={() => setOpenId((cur) => (cur === item.id ? null : item.id))}
                    className={clsx(
                      "shrink-0 p-1 rounded-lg transition-colors",
                      openId === item.id ? "text-accent" : "text-text-muted hover:text-text-secondary"
                    )}
                    aria-label={`توضیح ${item.label}`}
                  >
                    <Info size={15} />
                  </button>
                )}
              </div>
              <AnimatePresence initial={false}>
                {openId === item.id && item.description && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-text-muted bg-surface-elevated rounded-lg p-2.5 mb-2 mr-7">
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <Button onClick={handleExecute} disabled={!allDone} className="mt-2 w-full">
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
