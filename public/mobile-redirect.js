// Mobile device detection and redirect
(function() {
  function isMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isSmallScreen = window.innerWidth <= 768;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return mobileRegex.test(userAgent) || (isSmallScreen && hasTouchScreen);
  }

  function redirectToMobile() {
    if (isMobileDevice() && !window.location.pathname.includes('/mobile.html')) {
      const currentPath = window.location.pathname + window.location.search;
      const mobileUrl = `/mobile.html${currentPath === '/' ? '' : currentPath}`;
      window.location.href = mobileUrl;
    }
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', redirectToMobile);
  } else {
    redirectToMobile();
  }

  // Also run on window resize
  window.addEventListener('resize', function() {
    setTimeout(redirectToMobile, 100);
  });
})(); 