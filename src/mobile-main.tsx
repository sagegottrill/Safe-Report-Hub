import React from 'react'
import ReactDOM from 'react-dom/client'
import MobileApp from './MobileApp.tsx'
import LoadingScreen from './components/LoadingScreen.tsx'
import './mobile-index.css'

// Remove old loading screen
const loadingElement = document.querySelector('.mobile-loading');
if (loadingElement) {
  loadingElement.remove();
}

const MobileAppWithLoading: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  const handleDeviceDetected = (isMobile: boolean) => {
    // For mobile entry point, we always load mobile app
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onDeviceDetected={handleDeviceDetected} />;
  }

  return <MobileApp />;
};

ReactDOM.createRoot(document.getElementById('mobile-root')!).render(
  <React.StrictMode>
    <MobileAppWithLoading />
  </React.StrictMode>,
) 