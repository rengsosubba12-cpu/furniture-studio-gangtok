import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, normalizeId } from '../context/StoreContext';
import './ProfilePage.css';

/* ═══════════════════════════════════════════════════════════════════════════
   ProfilePage — Client Profile with Details / Cart / Saved tabs.
   Reads and writes to global StoreContext with localStorage persistence.
   Strict Heritage Color Palette:
     - Background: Paper Cream (#E7DBCF)
     - Text & Input: Deep Charcoal (#1A1A1A)
     - Primary Accents, Active Tabs, & Buttons: Barn Shadow (#9E4137)
     - Secondary Accents: Leaf Green (#4F725C)
     - Tertiary Accents & Hover: Candle Amber (#CE7F5C)
   ═══════════════════════════════════════════════════════════════════════════ */
export default function ProfilePage({ onNavigate }) {
  const navigate = useNavigate();
  const {
    userProfile,
    saveProfile,
    cartItems,
    cartItemTotalCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    savedItems,
    removeFromSaved,
    moveToCart,
    formatINR,
  } = useStore();

  /* ── Tab State: 'details' | 'cart' | 'saved' ────────────────────────── */
  const [activeTab, setActiveTab] = useState('details');

  /* ── Local form state (empty by default for new user) ───────────────── */
  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    email: userProfile.email || '',
    phone: userProfile.phone || '',
    address: userProfile.address || '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  /* ── Toast notification feedback ────────────────────────────────────── */
  const [toastMessage, setToastMessage] = useState(null);

  /* ── Checkout Inquiry Modal State ───────────────────────────────────── */
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  /* ── Check localStorage on mount and populate form fields ───────────── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('fsg_userProfile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setFormData((prev) => ({
            name: parsed.name ?? prev.name,
            email: parsed.email ?? prev.email,
            phone: parsed.phone ?? prev.phone,
            address: parsed.address ?? prev.address,
          }));
          saveProfile(parsed);
        }
      }
    } catch {
      // localStorage read failed — fallback to context
    }
  }, [saveProfile]);

  /* Sync local form when global profile changes */
  useEffect(() => {
    setFormData({
      name: userProfile.name || '',
      email: userProfile.email || '',
      phone: userProfile.phone || '',
      address: userProfile.address || '',
    });
  }, [userProfile]);

  /* Helper to trigger temporary toast */
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  /* ── Personal Details Handlers ──────────────────────────────────────── */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    saveProfile(formData);
    try {
      localStorage.setItem('fsg_userProfile', JSON.stringify(formData));
    } catch {
      // ignore
    }
    setSaveSuccess(true);
    showToast('PROFILE CHANGES SAVED');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  /* ── Cart Handlers ─────────────────────────────────────────────────── */
  const handleQuantityChange = (id, delta) => updateCartQuantity(id, delta);

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
    showToast('ITEM REMOVED FROM CART');
  };

  /* ── Saved / Wishlist Handlers ──────────────────────────────────────── */
  const handleMoveToCart = (id) => {
    moveToCart(id);
    showToast('MOVED TO CART');
  };

  const handleRemoveFromSaved = (id) => {
    removeFromSaved(id);
    showToast('REMOVED FROM SAVED ARCHIVE');
  };

  /* ── Deep-link navigation helper via React Router ──────────────────── */
  const navigateToProduct = (productId) => {
    const cleanId = normalizeId(productId);
    navigate(`/collection#product-${cleanId}`);
    if (onNavigate) {
      onNavigate(`collection#product-${cleanId}`);
    }
  };

  return (
    <div className="profile-page">
      {/* ── Toast Alert ───────────────────────────────────────────────── */}
      {toastMessage && <div className="profile-toast">{toastMessage}</div>}

      {/* ── Top Editorial Header ──────────────────────────────────────── */}
      <div className="profile-hero">
        <div className="profile-hero__meta">
          <span className="profile-hero__edition">DOSSIER // 2026</span>
          <span className="profile-hero__id">CLIENT ID: FSG-8492</span>
        </div>
        <h2 className="profile-hero__title">CLIENT PROFILE</h2>
      </div>

      {/* ── Segmented Switcher (Sub-Navigation) ────────────────────────── */}
      <nav className="profile-tabs" role="tablist" aria-label="Profile Sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'details'}
          className={`profile-tab ${activeTab === 'details' ? 'profile-tab--active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          DETAILS
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'cart'}
          className={`profile-tab ${activeTab === 'cart' ? 'profile-tab--active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          CART ({cartItemTotalCount})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'saved'}
          className={`profile-tab ${activeTab === 'saved' ? 'profile-tab--active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          SAVED ({savedItems.length})
        </button>
      </nav>

      {/* ── Scrollable Tab Body ────────────────────────────────────────── */}
      <div className="profile-body">
        {/* ── TAB 1: PERSONAL DETAILS ─────────────────────────────────── */}
        {activeTab === 'details' && (
          <form className="profile-form" onSubmit={handleSaveDetails}>
            <div className="form-field">
              <label htmlFor="field-name" className="form-field__label">
                Full Name
              </label>
              <input
                id="field-name"
                name="name"
                type="text"
                className="form-field__input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="field-email" className="form-field__label">
                Email Address
              </label>
              <input
                id="field-email"
                name="email"
                type="email"
                className="form-field__input"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div className="form-field">
              <label htmlFor="field-phone" className="form-field__label">
                Phone Number
              </label>
              <input
                id="field-phone"
                name="phone"
                type="tel"
                className="form-field__input"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
                autoComplete="tel"
              />
            </div>

            <div className="form-field">
              <label htmlFor="field-address" className="form-field__label">
                Delivery Address
              </label>
              <input
                id="field-address"
                name="address"
                type="text"
                className="form-field__input"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your delivery address"
                autoComplete="street-address"
              />
            </div>

            <button type="submit" className="profile-form__save-btn">
              SAVE CHANGES
            </button>

            {saveSuccess && (
              <div className="profile-form__feedback">
                ✓ CHANGES SAVED TO ARCHIVE
              </div>
            )}
          </form>
        )}

        {/* ── TAB 2: CART WINDOW ──────────────────────────────────────── */}
        {activeTab === 'cart' && (
          <>
            {cartItems.length > 0 ? (
              <div className="cart-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    {/* Clickable wrapper around Thumbnail and Title */}
                    <div
                      className="cart-item__link-wrap"
                      onClick={() => navigateToProduct(item.id)}
                      role="link"
                      tabIndex={0}
                      aria-label={`View ${item.name} in collection`}
                      onKeyDown={(e) => e.key === 'Enter' && navigateToProduct(item.id)}
                    >
                      <div className="cart-item__thumb-wrap">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item__thumb"
                          loading="lazy"
                        />
                      </div>
                      <div className="cart-item__info">
                        <h3 className="cart-item__title">{item.name}</h3>
                        <span className="cart-item__material">{item.material}</span>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="cart-item__meta">
                      <span className="cart-item__price">
                        ₹ {formatINR(item.price)}
                      </span>
                      <div className="cart-item__actions">
                        <div className="cart-item__qty" aria-label="Quantity selector">
                          <button
                            type="button"
                            className="cart-item__qty-btn"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="cart-item__qty-val">{item.quantity}</span>
                          <button
                            type="button"
                            className="cart-item__qty-btn"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="cart-item__remove-btn"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="profile-empty">
                <h3 className="profile-empty__title">
                  YOUR SHOPPING BAG IS CURRENTLY EMPTY.
                </h3>
                <p className="profile-empty__text">
                  Discover bespoke architectural pieces curated for Gangtok residences.
                </p>
                <button
                  type="button"
                  className="profile-empty__btn"
                  onClick={() => onNavigate ? onNavigate('collection') : navigate('/collection')}
                >
                  EXPLORE COLLECTION
                </button>
              </div>
            )}
          </>
        )}

        {/* ── TAB 3: SAVED / WISHLIST WINDOW ──────────────────────────── */}
        {activeTab === 'saved' && (
          <>
            {savedItems.length > 0 ? (
              <div className="saved-list">
                {savedItems.map((item) => (
                  <div key={item.id} className="saved-card">
                    {/* Clickable wrapper around Thumbnail and Title */}
                    <div
                      className="saved-card__link-wrap"
                      onClick={() => navigateToProduct(item.id)}
                      role="link"
                      tabIndex={0}
                      aria-label={`View ${item.name} in collection`}
                      onKeyDown={(e) => e.key === 'Enter' && navigateToProduct(item.id)}
                    >
                      <div className="saved-card__thumb-wrap">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="saved-card__thumb"
                          loading="lazy"
                        />
                      </div>
                      <div className="saved-card__info">
                        <h3 className="saved-card__title">{item.name}</h3>
                        <span className="saved-card__material">{item.material}</span>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="saved-card__meta">
                      <span className="saved-card__price">
                        ₹ {formatINR(item.price)}
                      </span>
                      <div className="saved-card__actions">
                        <button
                          type="button"
                          className="saved-card__move-btn"
                          onClick={() => handleMoveToCart(item.id)}
                        >
                          MOVE TO CART
                        </button>
                        <button
                          type="button"
                          className="saved-card__remove-btn"
                          onClick={() => handleRemoveFromSaved(item.id)}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="profile-empty">
                <h3 className="profile-empty__title">
                  YOUR SAVED ARCHIVE IS CURRENTLY EMPTY.
                </h3>
                <p className="profile-empty__text">
                  Save pieces to curate your bespoke private collection.
                </p>
                <button
                  type="button"
                  className="profile-empty__btn"
                  onClick={() => onNavigate ? onNavigate('collection') : navigate('/collection')}
                >
                  EXPLORE COLLECTION
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Sticky Subtotal & Checkout Bar (Cart Tab Only) ─────────────── */}
      {activeTab === 'cart' && cartItems.length > 0 && (
        <div className="cart-checkout-bar">
          <div className="cart-subtotal">
            <span className="cart-subtotal__label">SUBTOTAL:</span>
            <span className="cart-subtotal__value">₹ {formatINR(cartSubtotal)}</span>
          </div>
          <button
            type="button"
            className="cart-checkout-btn"
            onClick={() => setCheckoutModalOpen(true)}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      )}

      {/* ── Order Concierge Modal (Checkout Simulation) ────────────────── */}
      {checkoutModalOpen && (
        <div className="checkout-modal" role="dialog" aria-modal="true">
          <div className="checkout-modal__card">
            <span className="checkout-modal__badge">FSG PRIVATE CONCIERGE</span>
            <h3 className="checkout-modal__title">INQUIRY DISPATCHED</h3>
            <p className="checkout-modal__desc">
              Your architectural order inquiry of <strong>₹ {formatINR(cartSubtotal)}</strong> has been registered with our Gangtok studio.
            </p>
            <div className="checkout-modal__meta">
              <span className="checkout-modal__meta-item">
                Recipient: <strong>{userProfile.name || '—'}</strong>
              </span>
              <span className="checkout-modal__meta-item">
                Contact: <strong>{userProfile.phone || '—'}</strong>
              </span>
              <span className="checkout-modal__meta-item">
                Delivery: <strong>{userProfile.address || '—'}</strong>
              </span>
            </div>
            <button
              type="button"
              className="checkout-modal__close-btn"
              onClick={() => setCheckoutModalOpen(false)}
            >
              RETURN TO ARCHIVE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
