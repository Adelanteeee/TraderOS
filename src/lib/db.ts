import { openDB, type DBSchema, type IDBPDatabase } from "idb";

export interface OutboxItem {
  id: string;
  table: "journal_entries" | "analysis_entries" | "mind_checkins" | "mind_notes" | "knowledge_entries";
  payload: Record<string, unknown>;
  createdAt: number;
}

interface TraderOSDB extends DBSchema {
  outbox: {
    key: string;
    value: OutboxItem;
  };
}

const DB_NAME = "trader-os";
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<TraderOSDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<TraderOSDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("outbox")) {
          db.createObjectStore("outbox", { keyPath: "id" });
        }
      }
    });
  }
  return dbPromise;
}
