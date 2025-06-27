export const isMobileDevice = (): boolean => {
  // Check if we're already on the mobile version
  if (window.location.pathname.includes('/mobile.html')) {
    return true;
  }

  // Check user agent for mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Mobile device regex patterns
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  
  // Check screen size
  const isSmallScreen = window.innerWidth <= 768;
  
  // Check touch capability
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return mobileRegex.test(userAgent) || (isSmallScreen && hasTouchScreen);
};

export const redirectToMobile = (): void => {
  if (isMobileDevice() && !window.location.pathname.includes('/mobile.html')) {
    const currentPath = window.location.pathname + window.location.search;
    const mobileUrl = `/mobile.html${currentPath === '/' ? '' : currentPath}`;
    window.location.href = mobileUrl;
  }
};

export const redirectToDesktop = (): void => {
  if (!isMobileDevice() && window.location.pathname.includes('/mobile.html')) {
    const currentPath = window.location.pathname.replace('/mobile.html', '');
    const desktopUrl = currentPath || '/';
    window.location.href = desktopUrl;
  }
}; 