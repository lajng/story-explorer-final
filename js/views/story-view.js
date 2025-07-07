import { getAllStories } from "../utils/indexeddb.js";

const StoryView = {
  async renderHomePage() {
    const section = document.createElement('section');
    section.className = 'page';
    section.id = 'home-page';

    section.innerHTML = `
      <h1>Explore Amazing Stories</h1>
      <div id="stories-container" class="story-list"></div>
      <div id="stories-map" class="map-container" style="height: 400px; margin-top: 1rem;"></div>
    `;

    // 🔄 Tampilkan story dari IndexedDB
    setTimeout(() => {
      getAllStories((offlineStories) => {
        if (offlineStories && offlineStories.length > 0) {
          this.renderStoryList(offlineStories, section);
        }
      });
    }, 0);

    return section;
  },

  async renderAddStoryPage() {
    const section = document.createElement('section');
    section.className = 'page';
    section.id = 'add-story-page';

    section.innerHTML = `
      <h2>Tambah Cerita</h2>
      <form id="story-form">
        <label for="story-description">Deskripsi</label>
        <textarea id="story-description" name="description" required></textarea>

        <div class="camera-container">
          <video id="camera-preview" autoplay playsinline></video>
          <img id="captured-image" alt="Captured" style="display:none;" />
          <div class="camera-controls">
            <button type="button" id="start-camera">Start Camera</button>
            <button type="button" id="capture-photo">Capture Photo</button>
            <button type="button" id="retake-photo">Retake</button>
          </div>
        </div>

        <div class="map-container">
          <h3>Pilih Lokasi</h3>
          <div id="location-map" style="height: 400px;"></div>
        </div>

        <div class="form-actions">
          <button type="submit" id="submit-btn" class="btn btn-primary">Kirim</button>
        </div>
      </form>
    `;

    return section;
  },

  renderStoryList(stories, root = document) {
    const container = root.querySelector('#stories-container');
    if (!container) return;

    container.innerHTML = ''; // Bersihkan sebelumnya

    stories.forEach(story => {
      const storyElement = document.createElement('div');
      storyElement.className = 'story-card';
      storyElement.innerHTML = `
        <div class="story-content">
          <h3>${story.name || story.title || 'Tanpa Judul'}</h3>
          <p>${story.description || story.body || ''}</p>
          ${
            story.createdAt
              ? `<small>${new Date(story.createdAt).toLocaleDateString()}</small>`
              : ''
          }
          ${
            story.lat && story.lon
              ? `<p><span>📍 ${story.lat}, ${story.lon}</span></p>`
              : ''
          }
        </div>
      `;
      container.appendChild(storyElement);
    });
  },

  renderError(message) {
    const container = document.getElementById('stories-container');
    if (!container) return;

    container.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
      </div>
    `;
  }
};

export default StoryView;
