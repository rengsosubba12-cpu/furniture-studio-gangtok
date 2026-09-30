import { useEffect, useRef } from 'react';
import './Header.css';

/**
 * Header — Shortened "FSG" brand logo with luxury Yellow/Gold gradient.
 * Refined with luxury subtext: "FURNITURE STUDIO GANGTOK".
 * Transparent frosted glass header container.
 * Clicking branding on non-home pages navigates to Home.
 */
export default function Header({ onNavigate, isHome = true }) {
  const headerRef = useRef(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const handleAnimEnd = () => {
      el.classList.remove('entrance-fade');
      el.classList.add('entrance-done');
    };

    el.addEventListener('animationend', handleAnimEnd, { once: true });
    return () => el.removeEventListener('animationend', handleAnimEnd);
  }, []);

  const handleBrandClick = () => {
    if (!isHome && onNavigate) {
      onNavigate('home');
    }
  };

  return (
    <header ref={headerRef} className="header entrance-fade">
      <div
        className={`header__branding ${!isHome ? 'header__branding--clickable' : ''}`}
        onClick={handleBrandClick}
        role={!isHome ? 'button' : undefined}
        tabIndex={!isHome ? 0 : undefined}
        aria-label={!isHome ? 'Return to Home' : undefined}
      >
        <h1 className="header__title">FSG</h1>
        {isHome && (
          <span className="header__subtext">FURNITURE STUDIO GANGTOK</span>
        )}
      </div>
    </header>
  );
}
