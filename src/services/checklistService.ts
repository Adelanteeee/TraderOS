import { supabase } from "@/lib/supabaseClient";
import { DEFAULT_CHECKLIST } from "@/features/Execution/checklistData";

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
  if (!data || data.length === 0) {
    return seedChecklist();
  }
  return data as ChecklistItemRow[];
}

async function seedChecklist() {
  const rows = DEFAULT_CHECKLIST.map((item) => ({
    id: item.id,
    label: item.label,
    sort_order: item.sortOrder,
    done: false
  }));
  const { data, error } = await supabase
    .from("checklist_items")
    .upsert(rows, { onConflict: "id" })
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

export async function resetChecklist() {
  const { error } = await supabase.from("checklist_items").update({ done: false }).neq("id", "");
  if (error) throw error;
}
