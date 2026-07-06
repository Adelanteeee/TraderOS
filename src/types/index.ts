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
<<<<<<< HEAD

// ---- Sprint 2 ----

export interface MindCheckin {
  id: string;
  createdAt: string;
  mood: number; // 1-5
  sleepQuality: number; // 1-5
  focus: number; // 1-5
  stress: number; // 1-5
  confidence: number; // 1-5
  readyToTrade: boolean;
  note: string;
}

export interface MindNote {
  id: string;
  createdAt: string;
  title: string;
  content: string;
}

export interface MarketConcept {
  id: string;
  label: string;
  description: string;
  children?: MarketConcept[];
}

export interface AnalysisEntry {
  id: string;
  createdAt: string;
  instrument: string;
  timeframe: string;
  marketCycleStage: string;
  trend: string;
  bias: "bullish" | "bearish" | "neutral";
  notes: string;
}
=======
>>>>>>> ec022f78c02aacb19aeb3d08cec633ca7a759ea8
