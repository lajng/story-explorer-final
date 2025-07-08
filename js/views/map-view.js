// File: js/views/map-view.js
import * as L from 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js';

const MapView = {
  storyMap: null,
  addStoryMap: null,

  initStoryMap(listStory) {
    const container = document.getElementById('stories-map');
    if (!container) return;

    // Bersihkan kontainer agar tidak ada elemen duplikat
    container.innerHTML = '';

    if (this.storyMap) {
      this.storyMap.remove();
      this.storyMap = null;
    }

    this.storyMap = L.map(container).setView([-6.2, 106.8], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.storyMap);

    // Tunggu agar layout DOM stabil (SPA friendly)
    setTimeout(() => {
      this.storyMap.invalidateSize();
    }, 300);

    listStory.forEach(story => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(this.storyMap)
          .bindPopup(`<strong>${story.name || story.title}</strong><br>${story.description || story.body}`);
      }
    });
  },

  initAddStoryMap() {
    const container = document.getElementById('location-map');
    if (!container) return;

    container.innerHTML = '';

    if (this.addStoryMap) {
      this.addStoryMap.remove();
      this.addStoryMap = null;
    }

    this.addStoryMap = L.map(container).setView([-6.2, 106.8], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.addStoryMap);

    setTimeout(() => {
      this.addStoryMap.invalidateSize();
    }, 300);

    let marker = null;

    this.addStoryMap.on('click', function (e) {
      const { lat, lng } = e.latlng;

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(MapView.addStoryMap);
      }

      window.AppState = window.AppState || {};
      window.AppState.currentLocation = {
        lat: lat.toFixed(6),
        lon: lng.toFixed(6)
      };
    });
  }
};

export default MapView;
