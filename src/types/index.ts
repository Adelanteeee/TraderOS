import type { LucideIcon } from "lucide-react";

export type NavKey =
  | "dashboard"
  | "mind"
  | "market"
  | "analysis"
  | "execution"
  | "risk"
  | "journal"
  | "statistics"
  | "knowledge"
  | "settings";

export interface NavItem {
  key: NavKey;
  label: string;
  path: string;
  icon: LucideIcon;
}

export type MarketTrend = "bullish" | "bearish" | "ranging";

export interface DashboardSnapshot {
  traderName: string;
  mentalScore: number; // 0-100
  marketTrend: MarketTrend;
  todaysRiskPct: number; // 0-100, used risk budget
  todaysGoalR: number; // target R multiple
  checklistDone: number;
  checklistTotal: number;
}
