// File: js/views/map-view.js

import * as L from 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js';

const MapView = {
  storyMap: null,
  addStoryMap: null,

  initStoryMap(listStory) {
    const container = document.getElementById('stories-map');
    if (!container) return;

    if (this.storyMap) {
      this.storyMap.remove();
    }

    this.storyMap = L.map('stories-map').setView([-6.2, 106.8], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.storyMap);

    // Penting untuk SPA: pastikan ukuran map dihitung ulang
    setTimeout(() => {
      this.storyMap.invalidateSize();
    }, 200);

    listStory.forEach(story => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(this.storyMap)
          .bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
      }
    });
  },

  initAddStoryMap() {
    const container = document.getElementById('location-map');
    if (!container) return;

    if (this.addStoryMap) {
      this.addStoryMap.remove();
    }

    this.addStoryMap = L.map('location-map').setView([-6.2, 106.8], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.addStoryMap);

    // Penting untuk SPA: hindari map pecah / tidak utuh
    setTimeout(() => {
      this.addStoryMap.invalidateSize();
    }, 200);

    let marker = null;

    this.addStoryMap.on('click', function (e) {
      const { lat, lng } = e.latlng;

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(MapView.addStoryMap);
      }

      // Simpan lokasi di AppState
      window.AppState = window.AppState || {};
      window.AppState.currentLocation = {
        lat: lat.toFixed(6),
        lon: lng.toFixed(6)
      };
    });
  }
};

export default MapView;
  