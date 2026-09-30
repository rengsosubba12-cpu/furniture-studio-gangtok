import { useEffect, useRef } from 'react';
import './ScrollButton.css';

/**
 * ScrollButton — Animated down-arrow with "Scroll" label.
 * Sits at the bottom of the phone frame content layer.
 * Entrance animation is cleaned up after initial run.
 */
export default function ScrollButton() {
  const btnRef = useRef(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    const handleAnimEnd = () => {
      el.classList.remove('entrance-fade-up');
      el.classList.add('entrance-done');
    };

    el.addEventListener('animationend', handleAnimEnd, { once: true });
    return () => el.removeEventListener('animationend', handleAnimEnd);
  }, []);

  return (
    <button
      ref={btnRef}
      className="scroll-btn entrance-fade-up delay-4"
      aria-label="Scroll down"
      type="button"
    >
      <div className="scroll-btn__line" aria-hidden="true" />
      <svg
        className="scroll-btn__arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
