import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollManager: React.FC = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    const savedPosition = localStorage.getItem(location.pathname);
    const scrollY = savedPosition ? parseInt(savedPosition, 10) : 0;
    window.scrollTo(0, scrollY);
  }, [location.pathname]);

  useLayoutEffect(() => {
    const handlePopstate = () => {
      const savedPosition = localStorage.getItem(location.pathname);
      const scrollY = savedPosition ? parseInt(savedPosition, 10) : 0;
      window.scrollTo(0, scrollY);
    };

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [location.pathname]);

  return null;
};

export default ScrollManager;
