import AuthView from './views/auth-view.js';
import StoryView from './views/story-view.js';
import AuthPresenter from './presenters/auth-presenter.js';
import StoryPresenter from './presenters/story-presenter.js';
import { initDB } from './utils/indexeddb.js';
import { requestPermission, subscribeUser } from './utils/push-helper.js';

const app = {
  init: async () => {
    // Init IndexedDB
    await initDB();

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          console.log('✅ Service Worker registered:', reg);

          // Request push permission
          await requestPermission();
          await subscribeUser(reg);
        } catch (err) {
          console.error('❌ SW registration/push failed:', err);
        }
      });
    }

    // SPA hash change handler
    window.addEventListener('hashchange', app.route);
    window.addEventListener('DOMContentLoaded', app.route);
  },

  route: async () => {
    const hash = window.location.hash || '#login';
    const main = document.getElementById('main-content');
    main.innerHTML = '';

    switch (hash) {
      case '#register':
        main.appendChild(await AuthView.renderRegisterPage());
        AuthPresenter.initRegisterHandler();
        break;
      case '#login':
        main.appendChild(await AuthView.renderLoginPage());
        AuthPresenter.initLoginHandler();
        break;
      case '#home':
        main.appendChild(await StoryView.renderHomePage());
        StoryPresenter.loadStories();
        break;
      case '#add-story':
        main.appendChild(await StoryView.renderAddStoryPage());
        StoryPresenter.initSubmitHandler();
        break;
      default:
        main.innerHTML = '<p>Halaman tidak ditemukan</p>';
    }
  }
};

app.init();
