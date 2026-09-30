import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore, PRODUCTS } from '../context/StoreContext';
import './CollectionPage.css';

/* ═══════════════════════════════════════════════════════════════════════════
   CollectionPage — High-end editorial magazine layout inside .phone-frame.
   Product cards include Cart and Save toggle icons wired to StoreContext.
   Supports deep-linking: listens to URL hash and scrolls to target product.
   ═══════════════════════════════════════════════════════════════════════════ */
export default function CollectionPage() {
  const { hash } = useLocation();
  const { isInCart, toggleCart, isInSaved, toggleSaved } = useStore();

  /* ── Deep-link: scroll to product whenever URL hash is present ────── */
  useEffect(() => {
    if (hash) {
      const scrollTarget = () => {
        const targetId = hash.replace('#', '');
        const element = document.getElementById(targetId) || document.getElementById(`product-${targetId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('collection__item--highlight');
          setTimeout(() => element.classList.remove('collection__item--highlight'), 2200);
        }
      };

      scrollTarget();
      const timer = setTimeout(scrollTarget, 100);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  return (
    <div className="collection">
      {/* ── Large Editorial Header ──────────────────────────────────────── */}
      <div className="collection__hero">
        <span className="collection__season">COLLECTION // 2026</span>
        <h2 className="collection__title">CURATED</h2>
        <h2 className="collection__title collection__title--archive">ARCHIVE</h2>
        <p className="collection__intro">
          Sculptural integrity meets bespoke artisan joinery. An exploration of permanence, raw materials, and quiet luxury.
        </p>
      </div>

      {/* ── Asymmetric Magazine Layout Products ──────────────────────── */}
      <div className="collection__catalog">
        {PRODUCTS.map((product) => {
          const inCart = isInCart(product.id);
          const inSaved = isInSaved(product.id);

          return (
            <article
              key={product.id}
              id={`product-${product.id}`}
              className={`collection__item collection__item--${product.layout}`}
            >
              <div className="collection__img-wrap">
                <span className="collection__index">{product.id}</span>
                <img
                  className="collection__img"
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />

                {/* ── Action Icons (Cart + Save) ──────────────────────── */}
                <div className="collection__actions">
                  {/* Cart Toggle */}
                  <button
                    type="button"
                    className={`collection__action-btn ${inCart ? 'collection__action-btn--active' : ''}`}
                    onClick={() => toggleCart(product.id)}
                    aria-label={inCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
                    title={inCart ? 'Remove from cart' : 'Add to cart'}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {inCart ? (
                        /* Filled shopping bag with #9E4137 */
                        <path
                          d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6ZM16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                          fill="#9E4137"
                          stroke="#9E4137"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
                        /* Outlined shopping bag */
                        <path
                          d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6ZM3 6H21M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                  </button>

                  {/* Save / Bookmark Toggle */}
                  <button
                    type="button"
                    className={`collection__action-btn ${inSaved ? 'collection__action-btn--active' : ''}`}
                    onClick={() => toggleSaved(product.id)}
                    aria-label={inSaved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
                    title={inSaved ? 'Remove from saved' : 'Save item'}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {inSaved ? (
                        /* Filled bookmark with #9E4137 */
                        <path
                          d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                          fill="#9E4137"
                          stroke="#9E4137"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
                        /* Outlined bookmark */
                        <path
                          d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="collection__info">
                <h3 className="collection__name">{product.name}</h3>
                <span className="collection__material">{product.material}</span>
                <span className="collection__price">{product.priceFormatted}</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Editorial Colophon / Footer ───────────────────────────────── */}
      <footer className="collection__footer">
        <div className="collection__footer-mark">FSG</div>
        <span className="collection__footer-title">FURNITURE STUDIO GANGTOK</span>
        <span className="collection__footer-sub">Gangtok · Sikkim · Curated Edition</span>
      </footer>
    </div>
  );
}
