// File: js/presenters/auth-presenter.js
import AuthService from '../services/auth-service.js';

const AuthPresenter = {
  init() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
      loginForm.addEventListener('submit', this.handleLogin);
    }

    if (registerForm) {
      registerForm.addEventListener('submit', this.handleRegister);
    }

    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AuthService.logout();
        window.location.hash = '#login';
      });
    }
  },

  async handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const message = document.getElementById('login-message');

    try {
      const res = await fetch('https://story-api.dicoding.dev/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      AuthService.setToken(result.loginResult.token);
      message.textContent = 'Login berhasil!';
      message.style.color = 'green';

      setTimeout(() => {
        window.location.hash = '#home';
      }, 1000);
    } catch (err) {
      AuthService.logout(); // prevent stale token
      message.textContent = 'Login gagal: ' + err.message;
      message.style.color = 'red';
    }
  },

  async handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const message = document.getElementById('register-message');

    if (!name || !email || !password) {
      message.textContent = 'Semua field harus diisi.';
      message.style.color = 'red';
      return;
    }

    if (password.length < 6) {
      message.textContent = 'Password minimal 6 karakter.';
      message.style.color = 'red';
      return;
    }

    console.log('Data yang dikirim:', { name, email, password }); // Tambahkan ini

    try {
      const res = await fetch('https://story-api.dicoding.dev/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      message.textContent = 'Registrasi berhasil! Silakan login.';
      message.style.color = 'green';
      event.target.reset();

      setTimeout(() => {
        window.location.hash = '#login';
      }, 1000);
    } catch (err) {
      message.textContent = 'Gagal daftar: ' + err.message;
      message.style.color = 'red';
    }
  }

};

export default AuthPresenter;
