import { isTauri } from "./tauri";

const DB_NAME = "quiz_data";
const STORE_NAME = "scores";
const KEY_NAME = "quiz_stats";

export interface QuizStats {
  highScore: number;
  maxStreak: number;
}

const defaultStats: QuizStats = {
  highScore: 0,
  maxStreak: 0,
};

// ---------------------------
// IndexedDB Implementation
// ---------------------------
function initIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

async function getIndexedDBStats(): Promise<QuizStats> {
  try {
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(KEY_NAME);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result ? (request.result as QuizStats) : defaultStats);
      };
    });
  } catch (e) {
    console.error("Failed to read from IndexedDB", e);
    return defaultStats;
  }
}

async function saveIndexedDBStats(stats: QuizStats): Promise<void> {
  try {
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(stats, KEY_NAME);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (e) {
    console.error("Failed to write to IndexedDB", e);
  }
}

// ---------------------------
// SQLite (Tauri) Implementation
// ---------------------------
let sqlDbPromise: Promise<any> | null = null;

async function getSqlDb() {
  if (!sqlDbPromise) {
    const { load } = await import("@tauri-apps/plugin-sql");
    sqlDbPromise = load("sqlite:quiz_data.db").then(async (db) => {
      // Create table if it doesn't exist
      await db.execute(
        "CREATE TABLE IF NOT EXISTS scores (id TEXT PRIMARY KEY, high_score INTEGER, max_streak INTEGER)"
      );
      return db;
    });
  }
  return sqlDbPromise;
}

async function getSQLiteStats(): Promise<QuizStats> {
  try {
    const db = await getSqlDb();
    const result = await db.select<{ high_score: number; max_streak: number }[]>(
      "SELECT high_score, max_streak FROM scores WHERE id = $1",
      [KEY_NAME]
    );
    if (result && result.length > 0) {
      return {
        highScore: result[0].high_score,
        maxStreak: result[0].max_streak,
      };
    }
    return defaultStats;
  } catch (e) {
    console.error("Failed to read from SQLite", e);
    return defaultStats;
  }
}

async function saveSQLiteStats(stats: QuizStats): Promise<void> {
  try {
    const db = await getSqlDb();
    // SQLite upsert
    await db.execute(
      `INSERT INTO scores (id, high_score, max_streak) VALUES ($1, $2, $3)
       ON CONFLICT(id) DO UPDATE SET high_score = excluded.high_score, max_streak = excluded.max_streak`,
      [KEY_NAME, stats.highScore, stats.maxStreak]
    );
  } catch (e) {
    console.error("Failed to write to SQLite", e);
  }
}

// ---------------------------
// Exported Unified API
// ---------------------------
export async function loadQuizStats(): Promise<QuizStats> {
  if (isTauri()) {
    return getSQLiteStats();
  } else {
    return getIndexedDBStats();
  }
}

export async function saveQuizStats(stats: QuizStats): Promise<void> {
  if (isTauri()) {
    return saveSQLiteStats(stats);
  } else {
    return saveIndexedDBStats(stats);
  }
}
