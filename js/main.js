import View from './view.js';
import Presenter from './presenter.js';

// Inisialisasi View dan Presenter
const view = new View();
const presenter = new Presenter(view);

// Default ke halaman Home saat load
presenter.showHome();

// Event listener Navigasi
document.getElementById('nav-home').addEventListener('click', () => presenter.showHome());
document.getElementById('nav-add').addEventListener('click', () => presenter.showAddStory());
document.getElementById('nav-login').addEventListener('click', () => presenter.showLogin());
document.getElementById('nav-logout').addEventListener('click', () => presenter.logout());
document.getElementById('nav-favorite').addEventListener('click', () => presenter.showFavorites());

// Skip to content
const skipLink = document.querySelector('.skip-link');
const mainContent = document.querySelector('#main-content');
skipLink.addEventListener('click', function (event) {
  event.preventDefault();
  mainContent.focus();
  mainContent.scrollIntoView();
});

// Service Worker dan Push Notification
import { initDB } from './utils/indexeddb.js';
import { requestPermission, subscribeUser } from './utils/push-helper.js';

window.addEventListener('load', async () => {
  await initDB();

  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered:', reg);
      await requestPermission();
      await subscribeUser(reg);
    } catch (err) {
      console.error('❌ SW registration/push failed:', err);
    }
  }
});
