// File: js/presenters/story-presenter.js
import StoryView from '../views/story-view.js';
import AuthService from '../services/auth-service.js';
import MapView from '../views/map-view.js';
import { saveStory } from '../utils/indexeddb.js';

const StoryPresenter = {
  async loadStories() {
    const token = AuthService.getToken();
    if (!token) {
      window.location.hash = '#login';
      return;
    }

    try {
      const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        AuthService.logout();
        window.location.hash = '#login';
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal memuat cerita');

      StoryView.renderStoryList(data.listStory);
      MapView.initStoryMap(data.listStory);
    } catch (err) {
      StoryView.renderError(err.message || 'Terjadi kesalahan saat memuat cerita.');
    }
  },

  initSubmitHandler() {
    const form = document.getElementById('story-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = document.getElementById('story-description').value;
      const photo = window.AppState?.capturedPhoto;
      const location = window.AppState?.currentLocation;

      if (!photo) {
        alert('Silakan ambil foto terlebih dahulu.');
        return;
      }

      if (!location) {
        alert('Silakan pilih lokasi terlebih dahulu.');
        return;
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('lat', location.lat);
      formData.append('lon', location.lon);
      formData.append('photo', photo);

      try {
        const token = AuthService.getToken();
        if (!token) {
          alert('Anda harus login terlebih dahulu.');
          window.location.hash = '#login';
          return;
        }

        const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        alert('Cerita berhasil ditambahkan!');

        // ✅ Simpan juga ke IndexedDB
        saveStory({
          id: result.story.id || Date.now().toString(),
          title: result.story.name || "Cerita Offline",
          body: description,
          lat: location.lat,
          lon: location.lon,
          createdAt: new Date().toISOString()
        });

        window.location.hash = '#home';
      } catch (err) {
        alert('Gagal mengirim cerita: ' + err.message);
      }
    });

    MapView.initAddStoryMap();
  }
};

export default StoryPresenter;
