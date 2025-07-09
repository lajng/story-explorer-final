// File: js/utils/push-helper.js

const applicationServerKey = 'BObTt6J9Ey2b......'; // Ganti dengan kunci publik VAPID kamu


function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function requestPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(result => {
      if (result === 'granted') {
        subscribeUser();
      }
    });
  }
}

export function subscribeUser() {
  navigator.serviceWorker.ready.then(registration => {
    if (!registration.pushManager) return;

    registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
    }).then(subscription => {
      console.log('Berhasil subscribe push:', subscription);
    }).catch(err => {
      console.error('Gagal subscribe push:', err);
    });
  });
}
