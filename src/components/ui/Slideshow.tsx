'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type SlideshowProps = {
  images: string[];
  interval?: number;
};

const Slideshow = ({ images, interval = 3000 }: SlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg bg-slate-800 flex items-center justify-center">
      <Image
        src={images[currentIndex]}
        alt={`slide-${currentIndex}`}
        fill
        className="object-contain transition-opacity duration-1000 ease-in-out rounded-lg p-4"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />
    </div>
  );
};

export default Slideshow;