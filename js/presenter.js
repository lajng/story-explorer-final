export default class Presenter {
  constructor(view) {
    this.view = view;
    this.isLoggedIn = false;
  }

  showHome() {
    const container = document.createElement('div');
    container.innerHTML = `
      <h2>Beranda</h2>
      <div id="map" style="height: 400px;"></div>
    `;
    this.view.render(container);

    const map = L.map('map').setView([-6.2, 106.8], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([-6.2, 106.8]).addTo(map).bindPopup('Contoh Lokasi').openPopup();
  }

  showAddStory() {
    const container = document.createElement('div');
    container.innerHTML = `
      <h2>Tambah Story</h2>
      <form id="add-story-form">
        <label>Deskripsi:
          <input type="text" name="description" required />
        </label><br/>
        <label>Foto:
          <input type="file" name="photo" accept="image/*" capture="environment" required />
        </label><br/>
        <label>Latitude:
          <input type="text" name="lat" id="latitude" readonly required />
        </label><br/>
        <label>Longitude:
          <input type="text" name="lon" id="longitude" readonly required />
        </label><br/>
        <div id="map" style="height:300px; margin:1rem 0;"></div>
        <button type="submit">Kirim</button>
      </form>
    `;
    this.view.render(container);

    const map = L.map('map').setView([-6.2, 106.8], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      document.getElementById('latitude').value = lat;
      document.getElementById('longitude').value = lng;
    });

    document.getElementById('add-story-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(new FormData(e.target));
    });
  }

  handleSubmit(formData) {
    const description = formData.get('description');
    const photo = formData.get('photo');
    const lat = formData.get('lat');
    const lon = formData.get('lon');

    // Simulasi kirim data
    console.log({ description, photo, lat, lon });

    this.view.showAlert('Story berhasil ditambahkan!');
    this.showHome();
  }

  showLogin() {
    const container = document.createElement('div');
    container.innerHTML = `
      <h2>Login</h2>
      <form id="login-form">
        <label>Email:
          <input type="email" name="email" required />
        </label><br/>
        <label>Password:
          <input type="password" name="password" required />
        </label><br/>
        <button type="submit">Login</button>
      </form>
    `;
    this.view.render(container);

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.isLoggedIn = true;
      this.updateNav();
      this.view.showAlert('Login berhasil!');
      this.showHome();
    });
  }

  showFavorites() {
    import('./views/story-view.js').then(module => {
      const StoryView = module.default;
      const section = StoryView.renderFavoriteStoriesPage();
      this.view.render(section);
    }).catch(err => {
      console.error('Gagal memuat halaman favorit:', err);
      this.view.showAlert('Gagal memuat halaman favorit!');
    });
  }

  logout() {
    this.isLoggedIn = false;
    this.updateNav();
    this.view.showAlert('Anda sudah logout.');
    this.showHome();
  }

  updateNav() {
    const loginBtn = document.getElementById('nav-login');
    const logoutBtn = document.getElementById('nav-logout');

    if (loginBtn && logoutBtn) {
      loginBtn.style.display = this.isLoggedIn ? 'none' : '';
      logoutBtn.style.display = this.isLoggedIn ? '' : 'none';
    }
  }
}
