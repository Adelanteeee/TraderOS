import { supabase } from "@/lib/supabaseClient";
import type { AnalysisEntry } from "@/types";

interface AnalysisEntryRow {
  id: string;
  created_at: string;
  instrument: string;
  timeframe: string;
  market_cycle_stage: string;
  trend: string;
  bias: "bullish" | "bearish" | "neutral";
  notes: string;
}

function toEntry(row: AnalysisEntryRow): AnalysisEntry {
  return {
    id: row.id,
    createdAt: row.created_at,
    instrument: row.instrument,
    timeframe: row.timeframe,
    marketCycleStage: row.market_cycle_stage,
    trend: row.trend,
    bias: row.bias,
    notes: row.notes
  };
}

export async function fetchAnalyses(): Promise<AnalysisEntry[]> {
  const { data, error } = await supabase
    .from("analysis_entries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as AnalysisEntryRow[]).map(toEntry);
}

export async function addAnalysis(
  input: Omit<AnalysisEntry, "id" | "createdAt">
): Promise<AnalysisEntry> {
  const { data, error } = await supabase
    .from("analysis_entries")
    .insert({
      instrument: input.instrument,
      timeframe: input.timeframe,
      market_cycle_stage: input.marketCycleStage,
      trend: input.trend,
      bias: input.bias,
      notes: input.notes
    })
    .select("*")
    .single();
  if (error) throw error;
  return toEntry(data as AnalysisEntryRow);
}

export async function deleteAnalysis(id: string): Promise<void> {
  const { error } = await supabase.from("analysis_entries").delete().eq("id", id);
  if (error) throw error;
}
