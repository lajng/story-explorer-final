// File: js/services/auth-service.js

const TOKEN_KEY = 'user_token';

const AuthService = {
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    location.hash = '#login';
  }
};

export default AuthService;
