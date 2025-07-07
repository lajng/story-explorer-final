// File: js/views/auth-view.js

const AuthView = {
  async renderLoginPage() {
    const section = document.createElement('section');
    section.className = 'page';
    section.id = 'login-page';

    section.innerHTML = `
      <h1>Login</h1>
      <form id="login-form">
        <label for="login-email">Email</label>
        <input type="email" id="login-email" required />

        <label for="login-password">Password</label>
        <input type="password" id="login-password" required />

        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <div id="login-message" class="form-message"></div>
    `;

    return section;
  },

  async renderRegisterPage() {
    const section = document.createElement('section');
    section.className = 'page';
    section.id = 'register-page';

    section.innerHTML = `
      <h1>Register</h1>
      <form id="register-form">
        <label for="register-name">Nama</label>
        <input type="text" id="register-name" required />

        <label for="register-email">Email</label>
        <input type="email" id="register-email" required />

        <label for="register-password">Password</label>
        <input type="password" id="register-password" required />

        <button type="submit" class="btn btn-primary">Daftar</button>
      </form>
      <div id="register-message" class="form-message"></div>
    `;

    return section;
  },

  showLoginMessage(msg, isError = false) {
    const box = document.getElementById('login-message');
    if (box) {
      box.textContent = msg;
      box.style.color = isError ? 'red' : 'green';
    }
  },

  showRegisterMessage(msg, isError = false) {
    const box = document.getElementById('register-message');
    if (box) {
      box.textContent = msg;
      box.style.color = isError ? 'red' : 'green';
    }
  }
};

export default AuthView;
