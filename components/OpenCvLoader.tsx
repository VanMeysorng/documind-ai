'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    cv: any;
    cvLoaded: boolean;
    cvLoading: boolean;
  }
}

export default function OpenCvLoader() {
  useEffect(() => {
    // Global guard - prevent ANY double loading
    if (window.cvLoaded || window.cvLoading) {
      console.log('OpenCV already loading or loaded, skipping');
      return;
    }

    // If already loaded
    if (window.cv && window.cv.Mat) {
      window.cvLoaded = true;
      console.log('OpenCV already available');
      return;
    }

    // Set loading flag
    window.cvLoading = true;
    console.log('Loading OpenCV...');

    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
    script.async = true;
    
    script.onload = () => {
      window.cvLoaded = true;
      window.cvLoading = false;
      console.log('OpenCV loaded successfully');
    };
    
    script.onerror = () => {
      window.cvLoading = false;
      console.error('OpenCV failed');
    };
    
    document.body.appendChild(script);

    return () => {
      // Keep flags set - don't reload on unmount
    };
  }, []);

  return null;
}
