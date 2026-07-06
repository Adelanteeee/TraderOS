import { useEffect, useMemo, useState } from "react";
import { BarChart3, Trophy, Activity, ListChecks } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { fetchJournalEntries } from "@/services/journalService";
import type { JournalEntry } from "@/services/journalService";

function average(nums: number[]) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function Statistics() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    fetchJournalEntries()
      .then(setEntries)
      .catch(() => setOffline(true));
  }, []);

  const stats = useMemo(() => {
    const total = entries.length;
    const avgScore = average(entries.map((e) => e.score));
    const wins = entries.filter((e) => e.score >= 50).length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    const emotionCounts = new Map<string, number>();
    entries.forEach((e) => {
      if (!e.emotion) return;
      emotionCounts.set(e.emotion, (emotionCounts.get(e.emotion) ?? 0) + 1);
    });
    const topEmotion = [...emotionCounts.entries()].sort((a, b) => b[1] - a[1])[0];

    const recent = [...entries].slice(0, 10).reverse();

    return { total, avgScore, winRate, topEmotion, recent };
  }, [entries]);

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">آمار</h2>
        <p className="text-sm text-text-muted mt-1">خلاصه‌ی عملکرد بر اساس معاملات ثبت‌شده در ژورنال.</p>
        {offline && (
          <p className="text-xs text-gold mt-1">Supabase وصل نیست — آمار فقط با داده‌ی محلی این نشست محاسبه می‌شه.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card eyebrow="Journal" title="تعداد معاملات">
          <div className="flex items-center gap-2 py-1">
            <ListChecks size={16} className="text-text-muted" />
            <span className="num text-2xl font-semibold text-text-primary">{stats.total}</span>
          </div>
        </Card>
        <Card eyebrow="Score" title="میانگین امتیاز">
          <div className="flex items-center gap-2 py-1">
            <BarChart3 size={16} className="text-text-muted" />
            <span className="num text-2xl font-semibold text-text-primary">{stats.avgScore.toFixed(1)}</span>
          </div>
        </Card>
        <Card eyebrow="Win Rate" title="نرخ موفقیت">
          <div className="flex items-center gap-2 py-1">
            <Trophy size={16} className="text-text-muted" />
            <span className="num text-2xl font-semibold text-text-primary">{stats.winRate.toFixed(0)}%</span>
          </div>
          <p className="text-xs text-text-muted">امتیاز ≥ ۵۰ به‌عنوان معامله‌ی موفق حساب می‌شه</p>
        </Card>
        <Card eyebrow="Emotion" title="پرتکرارترین احساس">
          <div className="flex items-center gap-2 py-1">
            <Activity size={16} className="text-text-muted" />
            <span className="text-lg font-semibold text-text-primary">
              {stats.topEmotion ? stats.topEmotion[0] : "—"}
            </span>
          </div>
        </Card>
      </div>

      <Card eyebrow="Trend" title="روند امتیاز — ۱۰ معامله‌ی اخیر">
        {stats.recent.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-6">هنوز داده‌ای برای نمایش نیست.</p>
        ) : (
          <div className="flex items-stretch gap-2 h-32 pt-2">
            {stats.recent.map((e) => (
              <div key={e.id} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div
                  className="w-full rounded-t-md bg-accent/80"
                  style={{ height: `${Math.max(4, e.score)}%` }}
                  title={`${e.trade}: ${e.score}`}
                />
                <span className="num text-[10px] text-text-muted">{e.score}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
