const PUBLIC_VAPID_KEY = 'BEluCmaCGNnPXF7oqPQNaA7UQkrIuMiVr3fhRCGDZL6KiLSpFY1CMZTVwdyHzvMXXyUsHFzfdaj9z1jNPTXjaXQ'; // contoh

async function subscribeUserToPush() {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

    console.log('Push subscription success:', JSON.stringify(subscription));
    // Simpan ke server bila perlu
  } catch (err) {
    console.error('Push subscription failed:', err);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

window.addEventListener('load', () => {
  subscribeUserToPush();
});
