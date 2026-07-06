export interface ChecklistDefault {
  id: string;
  label: string;
  sortOrder: number;
}

// Matches the original checklist exactly:
// Timeframe → Momentum → Market Cycle → Position → Structure →
// Thrust → Pullback → Liquidity → Entry Edge → RR → Execute Trade
export const DEFAULT_CHECKLIST: ChecklistDefault[] = [
  { id: "timeframe", label: "Timeframe", sortOrder: 0 },
  { id: "momentum", label: "Momentum", sortOrder: 1 },
  { id: "market-cycle", label: "Market Cycle", sortOrder: 2 },
  { id: "position", label: "Position", sortOrder: 3 },
  { id: "structure", label: "Structure", sortOrder: 4 },
  { id: "thrust", label: "Thrust", sortOrder: 5 },
  { id: "pullback", label: "Pullback", sortOrder: 6 },
  { id: "liquidity", label: "Liquidity", sortOrder: 7 },
  { id: "entry-edge", label: "Entry Edge", sortOrder: 8 },
  { id: "rr", label: "RR", sortOrder: 9 }
];
