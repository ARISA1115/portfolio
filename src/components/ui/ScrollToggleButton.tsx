'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const ScrollToggleButton = () => {
  const [isBottom, setIsBottom] = useState(false);
  const pathname = usePathname();

  {/* === Detect if user has scrolled to bottom of the page ===*/}
  useEffect(() => {
    const checkScrollPosition = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

      const threshold = pathname === '/profile' ? 100 : 10;
      const atBottom = scrollY + windowHeight >= documentHeight - threshold;
      setIsBottom(atBottom);
    };

    checkScrollPosition();
    
    window.addEventListener('scroll', checkScrollPosition);
    return () => window.removeEventListener('scroll', checkScrollPosition);
  }, [pathname]);

   {/* === Scroll to bottom or top depending on current position ===*/}
  const handleClick = () => {
    if (isBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center transition"
    >
      {isBottom ? (
        <ChevronUpIcon className="w-6 h-6" />
      ) : (
        <ChevronDownIcon className="w-6 h-6" />
      )}
    </button>
  );
};

export default ScrollToggleButton;