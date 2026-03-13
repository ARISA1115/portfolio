'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileSideMenuProps {
    isMobileMenuOpen: boolean;
    closeMobileMenu: () => void;
}

const MobileSideMenu = ({ isMobileMenuOpen, closeMobileMenu }: MobileSideMenuProps) => {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/profile', label: 'Profile' },
        { href: '/projects', label: 'Projects' },
        { href: '/articles', label: 'Articles' }
    ];

    if (!isMobileMenuOpen) return null;

    return (
        <div>
            {/* Side menu */}
            <div
                className={`fixed right-0 top-0 h-full transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{
                    width: 'min(320px, 80vw)', // Explicit width calculation to match overlay
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
                    zIndex: 9999,
                    boxShadow: '-20px 0 40px rgba(0, 0, 0, 0.6)'
                }}
            >
                {/* Menu header - aligned with navigation */}
                <div
                    className="flex items-center justify-between px-6"
                    style={{
                        height: '80px', // Same as navigation height (h-20)
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
                        borderBottom: '2px solid rgba(59, 130, 246, 0.4)',
                        borderLeft: '2px solid rgba(59, 130, 246, 0.4)'
                    }}
                >
                    <h2 className="text-xl font-bold text-blue-400">Menu</h2>
                    <button
                        onClick={closeMobileMenu}
                        className="text-gray-400 hover:text-white p-2 transition-colors"
                        aria-label="Close menu"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Menu items - fill entire remaining space */}
                <div
                    className="flex-1 py-6 px-6 space-y-3"
                    style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
                        minHeight: 'calc(100vh - 80px)', // Fill remaining space below header
                        borderLeft: '2px solid rgba(59, 130, 246, 0.4)' // Blue border line unified with header
                    }}
                >
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className={`block px-6 py-4 text-lg font-medium transition-all duration-200 rounded-lg border ${isActive
                                    ? 'text-blue-400 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-400/40 shadow-lg shadow-blue-500/20'
                                    : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50 border-slate-600/30 hover:border-slate-500/50 hover:shadow-lg'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MobileSideMenu;