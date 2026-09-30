import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT CATALOG — Single Source of Truth
   Every product card, cart item, and saved item references this data.
   ═══════════════════════════════════════════════════════════════════════════ */
export const PRODUCTS = [
  {
    id: '01',
    name: 'THE MONOLITH CHAIR',
    material: 'Carved Travertine & Smoked Oak',
    price: 85000,
    priceFormatted: '₹ 85,000',
    image: '/assets/ChatGPT Image Sep 30, 2026, 12_02_10 AM.png',
    layout: 'full',
  },
  {
    id: '02',
    name: 'THE AETHER TABLE',
    material: 'Smoked Glass & Cast Brass',
    price: 120000,
    priceFormatted: '₹ 1,20,000',
    image: '/assets/ChatGPT Image Sep 30, 2026, 12_02_53 AM.png',
    layout: 'left',
  },
  {
    id: '03',
    name: 'THE KYOTO CONSOLE',
    material: 'Japanese Walnut & Basalt Stone',
    price: 145000,
    priceFormatted: '₹ 1,45,000',
    image: '/assets/ChatGPT Image Sep 30, 2026, 12_03_38 AM.png',
    layout: 'right',
  },
  {
    id: '04',
    name: 'THE TERRA CABINET',
    material: 'Reclaimed Teak & Patinated Iron',
    price: 98000,
    priceFormatted: '₹ 98,000',
    image: '/assets/ChatGPT Image Sep 30, 2026, 12_06_04 AM.png',
    layout: 'full',
  },
  {
    id: '05',
    name: 'THE ALPINE LOUNGE',
    material: 'Italian Saddle Leather & Brushed Steel',
    price: 175000,
    priceFormatted: '₹ 1,75,000',
    image: '/assets/ChatGPT Image Sep 30, 2026, 12_10_19 AM.png',
    layout: 'left',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */
export function formatINR(val) {
  return Number(val).toLocaleString('en-IN');
}

export function normalizeId(id) {
  if (!id) return '';
  return String(id).replace(/^product-/, '');
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded — silently ignore
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTEXT
   ═══════════════════════════════════════════════════════════════════════════ */
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  /* ── Profile State (empty by default for new users) ─────────────────── */
  const [userProfile, setUserProfile] = useState(() =>
    loadFromStorage('fsg_userProfile', {
      name: '',
      email: '',
      phone: '',
      address: '',
    })
  );

  /* ── Cart State ─────────────────────────────────────────────────────── */
  const [cartItems, setCartItems] = useState(() =>
    loadFromStorage('fsg_cartItems', [])
  );

  /* ── Saved / Wishlist State ─────────────────────────────────────────── */
  const [savedItems, setSavedItems] = useState(() =>
    loadFromStorage('fsg_savedItems', [])
  );

  /* ── Persist to localStorage on change ──────────────────────────────── */
  useEffect(() => {
    saveToStorage('fsg_userProfile', userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveToStorage('fsg_cartItems', cartItems);
  }, [cartItems]);

  useEffect(() => {
    saveToStorage('fsg_savedItems', savedItems);
  }, [savedItems]);

  /* ── Profile Actions ────────────────────────────────────────────────── */
  const updateProfile = useCallback((field, value) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  const saveProfile = useCallback((data) => {
    setUserProfile(data);
    saveToStorage('fsg_userProfile', data);
  }, []);

  /* ── Cart Actions ───────────────────────────────────────────────────── */
  const isInCart = useCallback(
    (productId) => {
      const clean = normalizeId(productId);
      return cartItems.some((item) => normalizeId(item.id) === clean);
    },
    [cartItems]
  );

  const toggleCart = useCallback(
    (productId) => {
      const clean = normalizeId(productId);
      setCartItems((prev) => {
        const exists = prev.find((item) => normalizeId(item.id) === clean);
        if (exists) {
          return prev.filter((item) => normalizeId(item.id) !== clean);
        }
        const product = PRODUCTS.find((p) => normalizeId(p.id) === clean);
        if (!product) return prev;
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            material: product.material,
            price: product.price,
            quantity: 1,
            image: product.image,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback((productId) => {
    const clean = normalizeId(productId);
    setCartItems((prev) => prev.filter((item) => normalizeId(item.id) !== clean));
  }, []);

  const updateCartQuantity = useCallback((productId, delta) => {
    const clean = normalizeId(productId);
    setCartItems((prev) =>
      prev.map((item) => {
        if (normalizeId(item.id) === clean) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  }, []);

  /* ── Saved / Wishlist Actions ───────────────────────────────────────── */
  const isInSaved = useCallback(
    (productId) => {
      const clean = normalizeId(productId);
      return savedItems.some((item) => normalizeId(item.id) === clean);
    },
    [savedItems]
  );

  const toggleSaved = useCallback(
    (productId) => {
      const clean = normalizeId(productId);
      setSavedItems((prev) => {
        const exists = prev.find((item) => normalizeId(item.id) === clean);
        if (exists) {
          return prev.filter((item) => normalizeId(item.id) !== clean);
        }
        const product = PRODUCTS.find((p) => normalizeId(p.id) === clean);
        if (!product) return prev;
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            material: product.material,
            price: product.price,
            image: product.image,
          },
        ];
      });
    },
    []
  );

  const removeFromSaved = useCallback((productId) => {
    const clean = normalizeId(productId);
    setSavedItems((prev) => prev.filter((item) => normalizeId(item.id) !== clean));
  }, []);

  const moveToCart = useCallback((productId) => {
    const clean = normalizeId(productId);
    setSavedItems((prev) => prev.filter((item) => normalizeId(item.id) !== clean));
    setCartItems((prev) => {
      const exists = prev.find((item) => normalizeId(item.id) === clean);
      if (exists) {
        return prev.map((item) =>
          normalizeId(item.id) === clean
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const product = PRODUCTS.find((p) => normalizeId(p.id) === clean);
      if (!product) return prev;
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          material: product.material,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ];
    });
  }, []);

  /* ── Derived Values ────────────────────────────────────────────────── */
  const cartItemTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const value = {
    // Products Catalog
    PRODUCTS,
    // Profile
    userProfile,
    updateProfile,
    saveProfile,
    // Cart
    cartItems,
    cartItemTotalCount,
    cartSubtotal,
    isInCart,
    toggleCart,
    removeFromCart,
    updateCartQuantity,
    // Saved
    savedItems,
    isInSaved,
    toggleSaved,
    removeFromSaved,
    moveToCart,
    // Utility
    formatINR,
    normalizeId,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a <StoreProvider>');
  }
  return ctx;
}

export default StoreContext;
