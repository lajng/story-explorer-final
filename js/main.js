import View from './view.js';
import Presenter from './presenter.js';

const view = new View();
const presenter = new Presenter(view);

// Default Home
presenter.showHome();

// Navigasi
document.getElementById('nav-home').addEventListener('click', () => presenter.showHome());
document.getElementById('nav-add').addEventListener('click', () => presenter.showAddStory());
document.getElementById('nav-login').addEventListener('click', () => presenter.showLogin());
document.getElementById('nav-logout').addEventListener('click', () => presenter.logout());

// Skip link
const mainContent = document.querySelector("#main-content");
const skipLink = document.querySelector(".skip-link");

skipLink.addEventListener("click", function(event) {
  event.preventDefault();
  skipLink.blur();
  mainContent.focus();
  mainContent.scrollIntoView();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}
});