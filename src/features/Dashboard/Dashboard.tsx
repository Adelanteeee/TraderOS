import { TrendingUp, TrendingDown, Minus, ShieldAlert, Target, ListChecks } from "lucide-react";
import { Card } from "@/components/Card/Card";
import { RadialGauge, LinearProgress } from "@/components/Progress/Progress";
import { useAppStore } from "@/store/useAppStore";
import type { MarketTrend } from "@/types";
import clsx from "clsx";

const TREND_META: Record<MarketTrend, { label: string; icon: typeof TrendingUp; tone: "bull" | "bear" | "gold" }> = {
  bullish: { label: "Bullish", icon: TrendingUp, tone: "bull" },
  bearish: { label: "Bearish", icon: TrendingDown, tone: "bear" },
  ranging: { label: "Ranging", icon: Minus, tone: "gold" }
};

export function Dashboard() {
  const dashboard = useAppStore((s) => s.dashboard);
  const trend = TREND_META[dashboard.marketTrend];
  const TrendIcon = trend.icon;

  return (
    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card eyebrow="Mind" title="Mental Score" className="items-center">
        <RadialGauge value={dashboard.mentalScore} tone="accent" label="آماده ذهنی" />
      </Card>

      <Card eyebrow="Market" title="Trend">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-4">
          <div
            className={clsx(
              "flex h-14 w-14 items-center justify-center rounded-2xl",
              trend.tone === "bull" && "bg-bull-soft text-bull",
              trend.tone === "bear" && "bg-bear-soft text-bear",
              trend.tone === "gold" && "bg-gold-soft text-gold"
            )}
          >
            <TrendIcon size={26} strokeWidth={1.8} />
          </div>
          <p className="num text-lg font-semibold text-text-primary">{trend.label}</p>
        </div>
      </Card>

      <Card eyebrow="Risk" title="Today's Risk">
        <div className="flex flex-1 flex-col justify-center gap-3 py-2">
          <div className="flex items-baseline gap-1.5">
            <ShieldAlert size={16} className="text-text-muted" />
            <span className="num text-2xl font-semibold text-text-primary">
              {dashboard.todaysRiskPct}%
            </span>
            <span className="text-xs text-text-muted">از سقف مجاز</span>
          </div>
          <LinearProgress value={dashboard.todaysRiskPct} max={100} tone="bear" />
        </div>
      </Card>

      <Card eyebrow="Goal" title="Today's Goal">
        <div className="flex flex-1 flex-col justify-center gap-2 py-2">
          <div className="flex items-baseline gap-1.5">
            <Target size={16} className="text-text-muted" />
            <span className="num text-2xl font-semibold text-text-primary">
              {dashboard.todaysGoalR}R
            </span>
          </div>
          <p className="text-xs text-text-muted">هدف سود روزانه بر اساس ریسک</p>
        </div>
      </Card>

      <Card
        eyebrow="Execution"
        title="Trade Checklist"
        className="sm:col-span-2 lg:col-span-4"
      >
        <div className="flex flex-col gap-3 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-secondary">
              <ListChecks size={16} />
              <span className="num text-sm">
                {dashboard.checklistDone}/{dashboard.checklistTotal}
              </span>
            </div>
            <span className="text-xs text-text-muted">قبل از ورود به معامله کامل کن</span>
          </div>
          <LinearProgress value={dashboard.checklistDone} max={dashboard.checklistTotal} tone="accent" />
        </div>
      </Card>
    </div>
  );
}
