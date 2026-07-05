import { supabase } from "@/lib/supabaseClient";

export interface ChecklistItemRow {
  id: string;
  label: string;
  sort_order: number;
  done: boolean;
  updated_at: string;
}

export async function fetchChecklist() {
  const { data, error } = await supabase
    .from("checklist_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as ChecklistItemRow[];
}

export async function setChecklistItemDone(id: string, done: boolean) {
  const { error } = await supabase
    .from("checklist_items")
    .update({ done, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
