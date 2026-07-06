import { supabase } from "@/lib/supabaseClient";
import type { MindCheckin, MindNote } from "@/types";

interface MindCheckinRow {
  id: string;
  created_at: string;
  mood: number;
  sleep_quality: number;
  focus: number;
  stress: number;
  confidence: number;
  ready_to_trade: boolean;
  note: string;
}

interface MindNoteRow {
  id: string;
  created_at: string;
  title: string;
  content: string;
}

function toCheckin(row: MindCheckinRow): MindCheckin {
  return {
    id: row.id,
    createdAt: row.created_at,
    mood: row.mood,
    sleepQuality: row.sleep_quality,
    focus: row.focus,
    stress: row.stress,
    confidence: row.confidence,
    readyToTrade: row.ready_to_trade,
    note: row.note
  };
}

function toNote(row: MindNoteRow): MindNote {
  return { id: row.id, createdAt: row.created_at, title: row.title, content: row.content };
}

export async function fetchTodaysCheckin(): Promise<MindCheckin | null> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { data, error } = await supabase
    .from("mind_checkins")
    .select("*")
    .gte("created_at", startOfDay.toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? toCheckin(data as MindCheckinRow) : null;
}

export async function submitCheckin(
  input: Omit<MindCheckin, "id" | "createdAt">
): Promise<MindCheckin> {
  const { data, error } = await supabase
    .from("mind_checkins")
    .insert({
      mood: input.mood,
      sleep_quality: input.sleepQuality,
      focus: input.focus,
      stress: input.stress,
      confidence: input.confidence,
      ready_to_trade: input.readyToTrade,
      note: input.note
    })
    .select("*")
    .single();
  if (error) throw error;
  return toCheckin(data as MindCheckinRow);
}

export async function fetchNotes(): Promise<MindNote[]> {
  const { data, error } = await supabase
    .from("mind_notes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as MindNoteRow[]).map(toNote);
}

export async function addNote(title: string, content: string): Promise<MindNote> {
  const { data, error } = await supabase
    .from("mind_notes")
    .insert({ title, content })
    .select("*")
    .single();
  if (error) throw error;
  return toNote(data as MindNoteRow);
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from("mind_notes").delete().eq("id", id);
  if (error) throw error;
}

/** Mental Score = average of the five 1-5 sliders, rescaled to 0-100. */
export function computeMentalScore(input: {
  mood: number;
  sleepQuality: number;
  focus: number;
  stress: number; // higher stress should lower the score, so it's inverted below
  confidence: number;
}): number {
  const invertedStress = 6 - input.stress;
  const avg = (input.mood + input.sleepQuality + input.focus + invertedStress + input.confidence) / 5;
  return Math.round((avg / 5) * 100);
}
