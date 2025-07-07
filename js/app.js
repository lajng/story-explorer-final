// File: js/app.js

import AuthPresenter from './presenters/auth-presenter.js';
import StoryPresenter from './presenters/story-presenter.js';
import AuthView from './views/auth-view.js';
import StoryView from './views/story-view.js';
import CameraView from './views/camera-view.js';
import MapView from './views/map-view.js';

const routes = {
  '#login': async () => {
    const page = await AuthView.renderLoginPage();
    render(page);
    AuthPresenter.init();
  },
  '#register': async () => {
    const page = await AuthView.renderRegisterPage();
    render(page);
    AuthPresenter.init();
  },
  '#home': async () => {
    const page = await StoryView.renderHomePage();
    render(page);
    StoryPresenter.loadStories();
  },
  '#add-story': async () => {
    const page = await StoryView.renderAddStoryPage();
    render(page);
    CameraView.initCamera();
    MapView.initAddStoryMap();
    StoryPresenter.initSubmitHandler();
  }
};

function render(page) {
  const main = document.getElementById('main-content');
  main.innerHTML = '';
  page.classList.add('fade-in');
  main.appendChild(page);
  main.focus();
}

window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  if (routes[hash]) routes[hash]();
});

window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash || '#login';
  if (routes[hash]) routes[hash]();
});
