// File: js/views/camera-view.js

const CameraView = {
  stream: null,
  video: null,
  canvas: null,

  initCamera() {
    this.video = document.getElementById('camera-preview');
    this.canvas = document.createElement('canvas');

    document.getElementById('start-camera')?.addEventListener('click', () => this.startCamera());
    document.getElementById('capture-photo')?.addEventListener('click', () => this.capturePhoto());
    document.getElementById('retake-photo')?.addEventListener('click', () => this.retakePhoto());
  },

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.srcObject = this.stream;
      this.video.play();
      this.video.style.display = 'block';
      document.getElementById('captured-image').style.display = 'none';
    } catch (err) {
      alert('Kamera tidak dapat diakses: ' + err.message);
    }
  },

  capturePhoto() {
    const width = this.video.videoWidth;
    const height = this.video.videoHeight;

    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.getContext('2d').drawImage(this.video, 0, 0, width, height);

    this.canvas.toBlob((blob) => {
      const img = document.getElementById('captured-image');
      img.src = URL.createObjectURL(blob);
      img.style.display = 'block';
      this.video.pause();
      this.video.style.display = 'none';

      window.AppState = window.AppState || {};
      window.AppState.capturedPhoto = blob;
    }, 'image/jpeg');
  },

  retakePhoto() {
    window.AppState.capturedPhoto = null;
    this.video.style.display = 'block';
    document.getElementById('captured-image').style.display = 'none';
    this.video.play();
  }
};

export default CameraView;
