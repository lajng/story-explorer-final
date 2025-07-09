// File: js/utils/indexeddb.js
import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';

const DB_NAME = 'story-explorer-db';
const STORE_NAME = 'favorite-stories';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function saveStory(story) {
  const db = await initDB();
  await db.put(STORE_NAME, story);
}

export async function getAllStories(callback) {
  const db = await initDB();
  const stories = await db.getAll(STORE_NAME);
  callback(stories);
}

export async function deleteStory(id) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}
