import { create } from "zustand";
import type { DashboardSnapshot } from "@/types";

interface AppState {
  dashboard: DashboardSnapshot;
  toggleChecklistItem: (done: boolean) => void;
  setMentalScore: (score: number) => void;
  setChecklistProgress: (done: number, total: number) => void;
  setTodaysRiskPct: (pct: number) => void;
  setTraderName: (name: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  dashboard: {
    traderName: "عادل",
    mentalScore: 92,
    marketTrend: "bullish",
    todaysRiskPct: 0,
    todaysGoalR: 2,
    checklistDone: 0,
    checklistTotal: 10
  },
  toggleChecklistItem: (done) =>
    set((state) => ({
      dashboard: {
        ...state.dashboard,
        checklistDone: Math.min(
          state.dashboard.checklistTotal,
          Math.max(0, state.dashboard.checklistDone + (done ? 1 : -1))
        )
      }
    })),
  setMentalScore: (score) =>
    set((state) => ({
      dashboard: { ...state.dashboard, mentalScore: score }
    })),
  setChecklistProgress: (done, total) =>
    set((state) => ({
      dashboard: { ...state.dashboard, checklistDone: done, checklistTotal: total }
    })),
  setTodaysRiskPct: (pct) =>
    set((state) => ({
      dashboard: { ...state.dashboard, todaysRiskPct: pct }
    })),
  setTraderName: (name) =>
    set((state) => ({
      dashboard: { ...state.dashboard, traderName: name }
    }))
}));
