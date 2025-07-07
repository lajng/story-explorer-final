import AuthService from '../services/auth-service.js';

const LoginPresenter = {
  init() {
    const form = document.getElementById('login-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Login gagal');
        }

        // ✅ Simpan token ke localStorage
        AuthService.setToken(result.loginResult.token);

        alert('Login berhasil!');
        location.hash = '#home';
      } catch (err) {
        const message = err.message || 'Terjadi kesalahan saat login.';
        document.getElementById('login-message').textContent = message;
      }
    });
  }
};

export default LoginPresenter;
// Usage:
// import LoginPresenter from './presenters/login-presenter.js';