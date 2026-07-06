import { supabase } from "@/lib/supabaseClient";

export interface JournalEntry {
  id: string;
  createdAt: string;
  trade: string;
  screenshotUrl: string;
  reason: string;
  emotion: string;
  mistake: string;
  lesson: string;
  score: number;
}

interface JournalEntryRow {
  id: string;
  created_at: string;
  trade: string;
  screenshot_url: string | null;
  reason: string;
  emotion: string;
  mistake: string;
  lesson: string;
  score: number;
}

function toEntry(row: JournalEntryRow): JournalEntry {
  return {
    id: row.id,
    createdAt: row.created_at,
    trade: row.trade,
    screenshotUrl: row.screenshot_url ?? "",
    reason: row.reason,
    emotion: row.emotion,
    mistake: row.mistake,
    lesson: row.lesson,
    score: row.score
  };
}

export async function fetchJournalEntries(): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as JournalEntryRow[]).map(toEntry);
}

export async function addJournalEntry(
  input: Omit<JournalEntry, "id" | "createdAt">
): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      trade: input.trade,
      screenshot_url: input.screenshotUrl || null,
      reason: input.reason,
      emotion: input.emotion,
      mistake: input.mistake,
      lesson: input.lesson,
      score: input.score
    })
    .select("*")
    .single();
  if (error) throw error;
  return toEntry(data as JournalEntryRow);
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const { error } = await supabase.from("journal_entries").delete().eq("id", id);
  if (error) throw error;
}
