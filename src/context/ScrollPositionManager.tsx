import React, { useEffect, useLayoutEffect, ReactNode } from "react";

interface ScrollPositionManagerProps {
  children: ReactNode;
}

const ScrollPositionManager = ({ children }: ScrollPositionManagerProps) => {
  useEffect(() => {
    const saveScrollPosition = () => {
      localStorage.setItem("scrollPosition", JSON.stringify(window.scrollY));
    };

    window.addEventListener("scroll", saveScrollPosition);

    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
    };
  }, []);

  useLayoutEffect(() => {
    const restoreScrollPosition = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const savedPosition = localStorage.getItem("scrollPosition");
      const scrollY = savedPosition ? parseInt(savedPosition, 10) : 0;
      window.scrollTo(0, scrollY);
    };
    restoreScrollPosition();
  }, []);

  return <>{children}</>;
};

export default ScrollPositionManager;
