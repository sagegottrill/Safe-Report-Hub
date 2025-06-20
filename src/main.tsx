import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AppProvider } from './contexts/AppContext'
import './i18n'
import { Workbox } from 'workbox-window'

// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <App />
  </AppProvider>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const wb = new Workbox('/service-worker.js')
    wb.register()
    wb.addEventListener('waiting', () => {
      wb.messageSW({ type: 'SKIP_WAITING' })
    })
    wb.addEventListener('externalwaiting', () => {
      wb.messageSW({ type: 'SKIP_WAITING' })
    })
    wb.addEventListener('controlling', () => {
      window.location.reload()
    })
    wb.addEventListener('activated', (event) => {
      if (!event.isUpdate) {
        // First install
        // Optionally show a welcome message
      }
    })
  })
}

// Optionally, show sync status using a toast or banner
window.addEventListener('online', () => {
  // Show online/sync status
  // e.g., toast.success('Back online. Reports will sync.')
})
window.addEventListener('offline', () => {
  // Show offline status
  // e.g., toast.warning('You are offline. Reports will be saved and synced when online.')
})
