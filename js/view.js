export default class View {
  constructor() {
    this.main = document.getElementById('main-content');
  }

  render(htmlElement) {
    this.main.innerHTML = '';
    this.main.appendChild(htmlElement);
  }

  showAlert(message) {
    alert(message);
  }

  focusMain() {
    this.main.focus();
    this.main.scrollIntoView();
  }
}
