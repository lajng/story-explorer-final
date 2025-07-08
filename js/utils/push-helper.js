// File: js/utils/push-helper.js

const applicationServerKey = 'BObTt6J9Ey2b......'; // Ganti dengan kunci publik VAPID kamu


export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('✅ Notification permission granted.');
  } else {
    console.log('❌ Notification permission denied.');
  }
}

export async function subscribeUser() {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
    });

    console.log('✅ Push subscribed:', subscription);
    // Kamu bisa kirim subscription ini ke server via fetch jika perlu
  } catch (error) {
    console.error('❌ Failed to subscribe the user: ', error);
  }
}
