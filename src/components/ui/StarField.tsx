'use client';

import { useEffect } from 'react';

const StarField = () => {
  useEffect(() => {
    const starsContainer = document.querySelector('.stars-container');
    if (!starsContainer) return;

    starsContainer.innerHTML = '';
    const numberOfStars = 120;

    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      starsContainer.appendChild(star);
    }
  }, []);

  return (
    <>
      {/* Cosmic gradient background */}
      <div className="cosmic-bg" />

      {/* Static star particles */}
      <div className="stars-container fixed inset-0 z-[-50] pointer-events-none" />

      {/* Floating geometric shapes */}
      <div className="geometric-elements fixed inset-0 z-[-45] overflow-hidden pointer-events-none">
        {/* Triangles */}
        <div className="absolute floating-shape triangle animate-rotate-slow" style={{ top: '55%', left: '30%' }} />
        <div className="absolute floating-shape triangle animate-rotate-slow" style={{ bottom: '50%', right: '33%' }} />

        {/* Hexagons */}
        <div className="absolute floating-shape hexagon animate-rotate-medium" style={{ top: '25%', right: '20%' }} />
        <div className="absolute floating-shape hexagon animate-rotate-medium" style={{ bottom: '22%', left: '10%' }} />

        {/* Circles */}
        <div className="absolute floating-shape circle animate-rotate-fast" style={{ top: '25%', left: '8%' }} />
        <div className="absolute floating-shape circle animate-rotate-fast" style={{ bottom: '20%', right: '15%' }} />
      </div>

      {/* Foreground gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none z-[-46]" />
      <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-blue-800/5 to-transparent pointer-events-none z-[-46]" />
    </>
  );
};

export default StarField;