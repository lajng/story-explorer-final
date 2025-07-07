// js/presenters/camera-presenter.js - Refactored for MVP
class CameraPresenter {
  constructor() {
    this.view = new CameraView();
    this.model = null; // Add camera model if needed
  }

  async startCamera() {
    try {
      // Validate DOM elements through view
      if (!this.view.getVideoElement()) {
        throw new Error('Required DOM elements not found');
      }

      // Update UI through view
      this.view.updateStartButton('Starting camera...', true);
      this.view.clearError();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      // Store in app state (business logic)
      window.AppState.cameraStream = stream;
      
      // Update view
      this.view.setVideoSource(stream);
      
      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        const video = this.view.getVideoElement();
        video.onloadedmetadata = () => {
          video.play()
            .then(resolve)
            .catch(reject);
        };
        video.onerror = reject;
        
        setTimeout(() => reject(new Error('Camera timeout')), 10000);
      });

      // Update UI state through view
      this.view.showVideo();
      this.view.hideStartButton();
      this.view.showCaptureButton();
      this.view.updateStartButton('Start Camera', false);

    } catch (err) {
      // Handle error through view
      this.view.updateStartButton('Start Camera', false);
      this.view.showError(`Camera error: ${err.message}`);
      console.error('Camera error:', err);
    }
  }

  capturePhoto() {
    try {
      const video = this.view.getVideoElement();
      
      if (!video || !video.srcObject) {
        this.view.showError('Camera not active');
        return;
      }

      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        this.view.showError('Video not ready, please wait');
        return;
      }

      // Update UI state
      this.view.updateCaptureButton('Capturing...', true);

      // Create canvas and capture image (business logic)
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context not available');
      }
      
      ctx.drawImage(video, 0, 0);

      canvas.toBlob(blob => {
        try {
          if (!blob) {
            throw new Error('Failed to create image blob');
          }

          // Store in app state (business logic)
          window.AppState.capturedPhoto = blob;
          const url = URL.createObjectURL(blob);

          // Update view
          this.view.showCapturedImage(url);
          this.view.hideVideo();
          this.view.hideCaptureButton();
          this.view.showRetakeButton();

          this.stopCamera();
          this.view.clearError();

        } catch (err) {
          this.view.showError(`Capture error: ${err.message}`);
          console.error('Capture error:', err);
        } finally {
          this.view.updateCaptureButton('Capture Photo', false);
        }
      }, 'image/jpeg', 0.9);

    } catch (err) {
      this.view.updateCaptureButton('Capture Photo', false);
      this.view.showError(`Capture error: ${err.message}`);
      console.error('Capture error:', err);
    }
  }

  retakePhoto() {
    try {
      // Clean up captured image URL (business logic)
      const capturedImage = this.view.elements.capturedImage;
      if (capturedImage && capturedImage.src) {
        URL.revokeObjectURL(capturedImage.src);
      }

      // Reset app state
      window.AppState.capturedPhoto = null;

      // Update view
      this.view.hideCapturedImage();
      this.view.hideRetakeButton();
      this.view.showStartButton();
      this.view.clearError();

    } catch (err) {
      this.view.showError(`Retake error: ${err.message}`);
      console.error('Retake error:', err);
    }
  }

  stopCamera() {
    try {
      const stream = window.AppState?.cameraStream;
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopped ${track.kind} track`);
        });
        window.AppState.cameraStream = null;
      }
    } catch (err) {
      console.error('Error stopping camera:', err);
    }
  }

  cleanup() {
    try {
      this.stopCamera();

      // Clean up through view
      this.view.clearVideoSource();
      
      const capturedImage = this.view.elements.capturedImage;
      if (capturedImage && capturedImage.src) {
        URL.revokeObjectURL(capturedImage.src);
      }

      this.view.resetToInitialState();

      // Reset app state
      if (window.AppState) {
        window.AppState.capturedPhoto = null;
      }

    } catch (err) {
      console.error('Cleanup error:', err);
    }
  }

  checkCameraSupport() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.view.showError('Camera not supported in this browser.');
        return false;
      }

      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        this.view.showError('Camera requires HTTPS connection.');
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error checking camera support:', err);
      this.view.showError('Error checking camera support.');
      return false;
    }
  }

  async requestCameraPermission() {
    try {
      const result = await navigator.permissions.query({ name: 'camera' });
      return result.state;
    } catch (err) {
      console.warn('Permission API not supported:', err);
      return 'unknown';
    }
  }

  async handlePermissions() {
    const permission = await this.requestCameraPermission();
    
    switch (permission) {
      case 'denied':
        this.view.showError('Camera permission denied. Please enable in browser settings.');
        return false;
      case 'prompt':
        console.log('Camera permission will be requested');
        return true;
      case 'granted':
        console.log('Camera permission already granted');
        return true;
      default:
        console.log('Camera permission state unknown');
        return true;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize AppState if not exists
    if (!window.AppState) {
      window.AppState = {
        cameraStream: null,
        capturedPhoto: null
      };
    }

    // Create presenter instance
    const cameraPresenter = new CameraPresenter();

    // Check camera support
    if (cameraPresenter.checkCameraSupport()) {
      console.log('Camera support verified');
      
      // Check permissions
      cameraPresenter.handlePermissions().then(hasPermission => {
        if (hasPermission) {
          console.log('Camera permissions OK');
        }
      });
    }

    // Add event listeners
    const startBtn = document.getElementById('start-camera');
    const captureBtn = document.getElementById('capture-photo');
    const retakeBtn = document.getElementById('retake-photo');

    if (startBtn) {
      startBtn.addEventListener('click', () => cameraPresenter.startCamera());
    }
    
    if (captureBtn) {
      captureBtn.addEventListener('click', () => cameraPresenter.capturePhoto());
    }
    
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => cameraPresenter.retakePhoto());
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => cameraPresenter.cleanup());

    // Store presenter globally if needed
    window.cameraPresenter = cameraPresenter;

  } catch (err) {
    console.error('Error initializing CameraPresenter:', err);
  }
});