let db;

export function initDB() {
  const request = indexedDB.open('story-db', 1);

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains('stories')) {
      db.createObjectStore('stories', { keyPath: 'id' });
    }
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    console.log('✅ IndexedDB initialized');
  };

  request.onerror = (event) => {
    console.error('❌ IndexedDB failed:', event.target.errorCode);
  };
}

export function saveStory(story) {
  if (!db) return;
  const tx = db.transaction('stories', 'readwrite');
  const store = tx.objectStore('stories');
  store.put(story);
}

export function getAllStories(callback) {
  if (!db) return;
  const tx = db.transaction('stories', 'readonly');
  const store = tx.objectStore('stories');
  const request = store.getAll();

  request.onsuccess = () => {
    callback(request.result);
  };
}

export function deleteStory(id) {
  if (!db) return;
  const tx = db.transaction('stories', 'readwrite');
  const store = tx.objectStore('stories');
  store.delete(id);
}
