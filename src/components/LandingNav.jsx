import { useState, useEffect, useRef } from 'react';
import './LandingNav.css';

/**
 * LandingNav — ZARA-style vertical premium text-only navigation.
 * Ultra-sleek editorial serif typography, left-aligned mid-frame.
 * Accepts onNavigate callback to switch pages in App.
 */

const NAV_ITEMS = [
  { label: 'Home', page: 'home' },
  { label: 'Collection', page: 'collection' },
  { label: 'Blog', page: 'blog' },
  { label: 'Profile', page: 'profile' },
];

export default function LandingNav({ onNavigate }) {
  const navRef = useRef(null);
  const [activeItem, setActiveItem] = useState('home');

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const handleAnimEnd = () => {
      el.classList.remove('entrance-slide-left');
      el.classList.add('entrance-done');
    };

    el.addEventListener('animationend', handleAnimEnd, { once: true });
    return () => el.removeEventListener('animationend', handleAnimEnd);
  }, []);

  const handleClick = (page) => {
    setActiveItem(page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <nav
      ref={navRef}
      className="landing-nav entrance-slide-left delay-2"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(({ label, page }) => (
        <button
          key={page}
          type="button"
          className={`landing-nav__link${activeItem === page ? ' active' : ''}`}
          onClick={() => handleClick(page)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
