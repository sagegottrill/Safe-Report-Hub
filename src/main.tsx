import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AppProvider } from './contexts/AppContext'
import './i18n'

// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <App />
  </AppProvider>
);

// Optionally, show sync status using a toast or banner
window.addEventListener('online', () => {
  // Show online/sync status
  // e.g., toast.success('Back online. Reports will sync.')
})
window.addEventListener('offline', () => {
  // Show offline status
  // e.g., toast.warning('You are offline. Reports will be saved and synced when online.')
})
