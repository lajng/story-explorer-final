let db;
const request = indexedDB.open("story-db", 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  db.createObjectStore("stories", { keyPath: "id" });
};

request.onsuccess = function(event) {
  db = event.target.result;
};

export function saveStory(data) {
  const tx = db.transaction("stories", "readwrite");
  const store = tx.objectStore("stories");
  store.put(data);
}

export function getAllStories(callback) {
  const tx = db.transaction("stories", "readonly");
  const store = tx.objectStore("stories");
  const request = store.getAll();
  request.onsuccess = () => callback(request.result);
}
