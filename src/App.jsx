import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Header from './components/Header';
import LandingNav from './components/LandingNav';
import ScrollButton from './components/ScrollButton';
import CollectionPage from './components/CollectionPage';
import ProfilePage from './components/ProfilePage';
import BlogPage from './components/BlogPage';
import HamburgerMenu from './components/HamburgerMenu';

/* ═══════════════════════════════════════════════════════════════════════════
   App — Multi-page app inside the central 9:16 mobile frame (.phone-frame).
   Wrapped in StoreProvider for global state management.
   Strict boundary: Desktop layout (.desktop-wrapper) remains untouched.
   Everything renders strictly inside .phone-frame.
   ═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive current page from URL pathname (e.g. /profile, /collection, /blog)
  const path = location.pathname.replace(/^\//, '').toLowerCase();
  const currentPage = ['collection', 'profile', 'blog'].includes(path) ? path : 'home';
  const [menuOpen, setMenuOpen] = useState(false);

  const navigateTo = (page) => {
    setMenuOpen(false);
    if (!page) return;
    if (page.startsWith('/')) {
      navigate(page);
    } else if (page.includes('#')) {
      navigate(`/${page}`);
    } else {
      navigate(page === 'home' ? '/' : `/${page}`);
    }
  };

  const isHome = currentPage === 'home';

  return (
    <StoreProvider>
      <div className="desktop-wrapper">
        {/* ── Central Mobile Frame (9:16 aspect ratio) ──────────────────── */}
        <div
          className={`phone-frame ${
            currentPage === 'collection'
              ? 'phone-frame--collection'
              : currentPage === 'profile'
              ? 'phone-frame--profile'
              : currentPage === 'blog'
              ? 'phone-frame--blog'
              : ''
          }`}
        >
          {/* ── HOME: Background video inside frame ────────────────────── */}
          {isHome && (
            <>
              <video
                className="phone-frame__video"
                autoPlay
                loop
                muted
                playsInline
                src="/assets/Bg-video.mp4"
                aria-hidden="true"
              />
              <div className="phone-frame__overlay" aria-hidden="true" />
            </>
          )}

          {/* ── UI Content Layer (z-index: 2) ───────────────────────────── */}
          <div className="phone-frame__content">
            {/* Global Floating Frosted Glass Header */}
            <Header onNavigate={navigateTo} isHome={isHome} />

            {/* Navigation Overlay (Option Tab) & Hamburger Menu */}
            <HamburgerMenu
              isOpen={menuOpen}
              onToggle={() => setMenuOpen((v) => !v)}
              onNavigate={navigateTo}
              currentPage={currentPage}
            />

            {/* ── Page Routing (In-Frame) ──────────────────────────────── */}
            {isHome ? (
              <>
                <LandingNav onNavigate={navigateTo} />
                <ScrollButton />
              </>
            ) : currentPage === 'collection' ? (
              <CollectionPage />
            ) : currentPage === 'profile' ? (
              <ProfilePage onNavigate={navigateTo} />
            ) : currentPage === 'blog' ? (
              <BlogPage onNavigate={navigateTo} />
            ) : (
              /* Fallback stub */
              <div className="page-stub">
                <span className="page-stub__pre">SECTION // 02</span>
                <h2 className="page-stub__title">FSG</h2>
                <p className="page-stub__text">Archive in curation</p>
                <button
                  type="button"
                  className="page-stub__btn"
                  onClick={() => navigateTo('home')}
                >
                  RETURN HOME
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}
