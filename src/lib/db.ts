import { openDB, type DBSchema, type IDBPDatabase } from "idb";

interface TraderOSDB extends DBSchema {
  journal: {
    key: string;
    value: {
      id: string;
      createdAt: number;
      screenshot?: string;
      reason: string;
      emotion: string;
      mistake: string;
      lesson: string;
      score: number;
    };
  };
  settings: {
    key: string;
    value: unknown;
  };
  checklist: {
    key: string;
    value: { id: string; label: string; done: boolean };
  };
  knowledge: {
    key: string;
    value: { id: string; topic: string; content: string };
  };
  statistics: {
    key: string;
    value: unknown;
  };
}

const DB_NAME = "trader-os";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<TraderOSDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<TraderOSDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("journal")) {
          db.createObjectStore("journal", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings");
        }
        if (!db.objectStoreNames.contains("checklist")) {
          db.createObjectStore("checklist", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("knowledge")) {
          db.createObjectStore("knowledge", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("statistics")) {
          db.createObjectStore("statistics");
        }
      }
    });
  }
  return dbPromise;
}
