import { saveStory, getAllStories, deleteStory } from '../utils/indexeddb.js';

const StoryView = {
  render(stories) {
    const container = document.getElementById('story-list');
    container.innerHTML = '';

    stories.forEach((story) => {
      const card = document.createElement('div');
      card.className = 'story-card';
      card.innerHTML = `
        <h3>${story.title || 'Tanpa Judul'}</h3>
        <p>${story.description}</p>
        <button class="btn-favorite" data-story='${JSON.stringify(story)}'>❤️ Simpan ke Favorite</button>
      `;
      container.appendChild(card);
    });

    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-favorite')) {
        const story = JSON.parse(e.target.getAttribute('data-story'));
        saveStory(story);
        alert('Story disimpan ke Favorite!');
      }
    });
  },

  renderFavoriteStoriesPage() {
    const section = document.createElement('section');
    section.className = 'page';
    section.id = 'favorites-page';

    section.innerHTML = `
      <h2>Favorite Stories</h2>
      <div id="favorites-container" class="story-list"></div>
    `;

    getAllStories().then((stories) => {
      const container = section.querySelector('#favorites-container');
      if (stories.length === 0) {
        container.innerHTML = '<p>Tidak ada story favorit.</p>';
      } else {
        stories.forEach((story) => {
          const el = document.createElement('div');
          el.className = 'story-card';
          el.innerHTML = `
            <h3>${story.title || 'Tanpa Judul'}</h3>
            <p>${story.description}</p>
            <button data-id="${story.id}" class="delete-btn">🗑️ Hapus</button>
          `;
          container.appendChild(el);
        });

        container.addEventListener('click', (e) => {
          if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            deleteStory(id).then(() => {
              e.target.closest('.story-card').remove();
            });
          }
        });
      }
    });

    return section;
  },

  renderHomePage() {
    const section = document.createElement('section');
    section.className = 'page';
    section.id = 'home-page';

    section.innerHTML = `
      <h2>Story Terbaru</h2>
      <div id="story-list" class="story-list">Loading...</div>
    `;

    return section;
  },

  renderAddStoryPage() {
    const section = document.createElement('section');
    section.className = 'page';
    section.id = 'add-story-page';

    section.innerHTML = `
      <h2>Tambah Cerita</h2>
      <form id="add-story-form">
        <input type="text" id="title" name="title" placeholder="Judul" required />
        <textarea id="description" name="description" placeholder="Deskripsi" required></textarea>
        <button type="submit">Kirim</button>
      </form>
    `;

    return section;
  }
};

export default StoryView;
