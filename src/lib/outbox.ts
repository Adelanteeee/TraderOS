import { getDB, type OutboxItem } from "@/lib/db";
import { supabase } from "@/lib/supabaseClient";

export async function enqueueOutbox(table: OutboxItem["table"], payload: Record<string, unknown>) {
  const db = await getDB();
  const item: OutboxItem = {
    id: `outbox-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    table,
    payload,
    createdAt: Date.now()
  };
  await db.put("outbox", item);
  return item;
}

export async function listOutbox(): Promise<OutboxItem[]> {
  const db = await getDB();
  const items = await db.getAll("outbox");
  return items.sort((a, b) => a.createdAt - b.createdAt);
}

export async function removeFromOutbox(id: string) {
  const db = await getDB();
  await db.delete("outbox", id);
}

/**
 * Replays every queued write against Supabase, oldest first. Items that
 * still fail (e.g. still offline) are left in the queue for the next
 * attempt. Safe to call repeatedly — it's a no-op when the queue is empty.
 */
export async function flushOutbox(): Promise<{ synced: number; remaining: number }> {
  const pending = await listOutbox();
  let synced = 0;

  for (const item of pending) {
    try {
      const { error } = await supabase.from(item.table).insert(item.payload);
      if (error) throw error;
      await removeFromOutbox(item.id);
      synced++;
    } catch {
      // Still offline or Supabase still unreachable — leave it queued and stop;
      // items are replayed in order, so a later item shouldn't jump ahead.
      break;
    }
  }

  const remaining = (await listOutbox()).length;
  return { synced, remaining };
}
