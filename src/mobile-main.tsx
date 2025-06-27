import React from 'react'
import ReactDOM from 'react-dom/client'
import MobileApp from './MobileApp.tsx'
import './mobile-index.css'

// Remove loading screen
const loadingElement = document.querySelector('.mobile-loading');
if (loadingElement) {
  loadingElement.remove();
}

ReactDOM.createRoot(document.getElementById('mobile-root')!).render(
  <React.StrictMode>
    <MobileApp />
  </React.StrictMode>,
) 