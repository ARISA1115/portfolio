'use client';

import { useEffect, useState } from 'react';

const GlobalMobileOverlay = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleMobileMenuChange = () => {
            // Listen for custom events from Navigation
            const isOpen = document.body.classList.contains('mobile-menu-open');
            setIsMobileMenuOpen(isOpen);
        };

        // Initial check
        handleMobileMenuChange();

        // Listen for custom events
        document.addEventListener('mobileMenuToggle', handleMobileMenuChange);

        // Also use MutationObserver to watch for class changes
        const observer = new MutationObserver(handleMobileMenuChange);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => {
            document.removeEventListener('mobileMenuToggle', handleMobileMenuChange);
            observer.disconnect();
        };
    }, []);

    const handleOverlayClick = () => {
        // Trigger event to close mobile menu
        document.dispatchEvent(new CustomEvent('closeMobileMenu'));
    };

    if (!isMobileMenuOpen) return null;

    return (
        <div
            className="fixed bg-black/70 backdrop-blur-sm md:hidden"
            style={{
                zIndex: 9997,
                top: 0,
                left: 0,
                bottom: 0,
                right: 'min(320px, 80vw)' // Exact same calculation as side menu width
            }}
            onClick={handleOverlayClick}
        />
    );
};

export default GlobalMobileOverlay;