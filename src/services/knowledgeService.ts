import { supabase } from "@/lib/supabaseClient";
import { enqueueOutbox } from "@/lib/outbox";

export interface KnowledgeEntry {
  id: string;
  topic: string;
  content: string;
  updatedAt: string;
}

interface KnowledgeEntryRow {
  id: string;
  topic: string;
  content: string;
  updated_at: string;
}

function toEntry(row: KnowledgeEntryRow): KnowledgeEntry {
  return { id: row.id, topic: row.topic, content: row.content, updatedAt: row.updated_at };
}

export async function fetchKnowledgeEntries(): Promise<KnowledgeEntry[]> {
  const { data, error } = await supabase
    .from("knowledge_entries")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as KnowledgeEntryRow[]).map(toEntry);
}

export async function addKnowledgeEntry(topic: string, content: string): Promise<KnowledgeEntry> {
  const payload = { topic, content };
  const { data, error } = await supabase.from("knowledge_entries").insert(payload).select("*").single();
  if (error) {
    await enqueueOutbox("knowledge_entries", payload);
    throw error;
  }
  return toEntry(data as KnowledgeEntryRow);
}

export async function deleteKnowledgeEntry(id: string): Promise<void> {
  const { error } = await supabase.from("knowledge_entries").delete().eq("id", id);
  if (error) throw error;
}
