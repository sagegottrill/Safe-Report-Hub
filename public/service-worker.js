import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style' || request.destination === 'image',
  new StaleWhileRevalidate()
);

registerRoute(
  /\/api\/reports/,
  new NetworkFirst({
    cacheName: 'reports-cache',
    networkTimeoutSeconds: 5,
  })
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    // Placeholder: sync logic for offline reports
    // Show notification or update UI
    self.registration.showNotification('Reports synced', {
      body: 'Offline reports have been sent.',
    });
  }
}); 