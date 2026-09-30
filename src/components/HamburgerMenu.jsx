import { useEffect, useRef } from 'react';
import './HamburgerMenu.css';

/**
 * HamburgerMenu & Navigation Overlay (Option Tab) — FURNITURE STUDIO GANGTOK
 * Sleek 3-line hamburger icon + full-frame frosted glass overlay inside .phone-frame.
 * Left-aligned editorial typography with active gold accent indicator.
 */

const MENU_ITEMS = [
  { label: 'HOME', page: 'home' },
  { label: 'COLLECTION', page: 'collection' },
  { label: 'BLOG', page: 'blog' },
  { label: 'PROFILE', page: 'profile' },
];

export default function HamburgerMenu({ isOpen, onToggle, onNavigate, currentPage }) {
  const overlayRef = useRef(null);

  /* ── Focus overlay on open ─────────────────────────────────────────── */
  useEffect(() => {
    if (isOpen && overlayRef.current) {
      overlayRef.current.focus();
    }
  }, [isOpen]);

  /* ── Close on Escape key ──────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onToggle();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onToggle]);

  return (
    <>
      {/* ── Hamburger Icon (3 horizontal lines, height 1px, #ffffff) ──── */}
      <button
        className="hamburger"
        onClick={onToggle}
        aria-label="Open menu"
        aria-expanded={isOpen}
        type="button"
      >
        <span className="hamburger__line" />
        <span className="hamburger__line" />
        <span className="hamburger__line" />
      </button>

      {/* ── Navigation Overlay (Option Tab Glassmorphism strictly inside .phone-frame) ────── */}
      <div
        ref={overlayRef}
        className={`nav-overlay menu-overlay ${isOpen ? 'nav-overlay--open menu-overlay--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        tabIndex={-1}
      >
        {/* Close button with text + X icon */}
        <button
          className="nav-overlay__close menu-overlay__close"
          onClick={onToggle}
          aria-label="Close menu"
          type="button"
        >
          <span>CLOSE</span>
          <span className="menu-overlay__close-icon" aria-hidden="true">✕</span>
        </button>

        {/* Sleek, Left-Aligned Navigation Links */}
        <nav className="nav-overlay__nav menu-overlay__nav" aria-label="Main navigation">
          {MENU_ITEMS.map(({ label, page }) => {
            const isActive = currentPage === page;
            return (
              <button
                key={page}
                type="button"
                className={`nav-overlay__link menu-overlay__link ${isActive ? 'nav-overlay__link--active menu-overlay__link--active active' : ''}`}
                onClick={() => onNavigate(page)}
              >
                {isActive && <span className="nav-overlay__indicator" aria-hidden="true" />}
                <span className="nav-overlay__text">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom brand watermark */}
        <span className="nav-overlay__brand menu-overlay__brand">FSG</span>
      </div>
    </>
  );
}
