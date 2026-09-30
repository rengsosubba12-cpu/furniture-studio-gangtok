import { useState, useEffect, useRef, useCallback } from 'react';
import './BlogPage.css';

/* ═══════════════════════════════════════════════════════════════════════════
   BLOG POST DATA — Architectural & Himalayan Joinery Dossier
   Media sources point to /assets/blog/ (jpg images & mp4 videos)
   ═══════════════════════════════════════════════════════════════════════════ */
export const BLOG_POSTS = [
  {
    id: 1,
    tag: 'EDITORIAL // 01',
    title: 'SILENCE IN TIMBER',
    subtitle: 'HIMALAYAN MONOGRAPHS',
    date: 'OCTOBER 2026',
    readTime: '4 MIN READ',
    type: 'image',
    mediaUrl: '/assets/blog/1.jpg',
    align: 'left',
    snippet:
      'Exploring the quiet poetry of high-altitude Himalayan walnut and chiseled mortise joinery crafted for contemporary sanctuaries.',
    content: [
      'In high-altitude alpine architectures, silence is not merely an absence of noise—it is a tactile presence. The timber selected for our Gangtok editions originates in slow-grown mountain valleys where dense winters tighten every ring.',
      'Through traditional dry-joinery techniques, we eliminate mechanical fasteners, allowing the wood to breathe, flex, and acclimatize across shifting seasonal humidity without structural compromise.',
      'Every grain divergence is preserved, hand-rubbed with organic tung and beeswax to leave a raw, luminous sheen that matures in tone over decades of domestic companionship.',
    ],
  },
  {
    id: 2,
    tag: 'ATELIER MOTION // 02',
    title: 'THE ARTISAN’S RHYTHM',
    subtitle: 'WORKSHOP CHRONICLES',
    date: 'SEPTEMBER 2026',
    readTime: 'WATCH FILM',
    type: 'video',
    mediaUrl: '/assets/blog/2.mp4',
    align: 'right',
    snippet:
      'Inside our Gangtok workshop: the tactile dialogue between hand plane, chiseled mortise, and raw Himalayan grain.',
    content: [
      'The hum of the atelier begins at dawn before mist lifts from the valley. An artisan gauges wood grain not merely with calipers, but with fingertips hardened by forty seasons of mountain carpentry.',
      'Our motion chronicle captures the meticulous process of shaping architectural profiles: the deliberate stroke of Japanese hand planes removing ribbons of cedar thinner than paper, the crisp strike of the mallet seating a blind tenon.',
      'To build for generations requires an unhurried tempo—a refusal of industrial expedience in favor of soulful spatial permanence.',
    ],
  },
  {
    id: 3,
    tag: 'CURATION // 03',
    title: 'GEOMETRY OF REST',
    subtitle: 'SPATIAL PROPORTIONS',
    date: 'AUGUST 2026',
    readTime: '5 MIN READ',
    type: 'image',
    mediaUrl: '/assets/blog/3.jpg',
    align: 'left',
    snippet:
      'Monolithic seating sculpted with restrained proportions, designed to ground light-filled alpine residences.',
    content: [
      'A seat is an anchor in a living volume. When drafting the Monolith series, we eliminated superfluous decorative gestures to let pure planar geometry frame the human silhouette.',
      'By balancing the heavy grounding mass of stone-washed timber with low cantilevered sightlines, the piece harmonizes with sprawling Himalayan panoramic windows rather than competing against them.',
      'Comfort is engineered through calculated ergonomics: a 104-degree seat incline paired with saddle-stitched natural leather that yields subtly to body heat.',
    ],
  },
  {
    id: 4,
    tag: 'MATERIALITY // 04',
    title: 'HONORING THE GRAIN',
    subtitle: 'ENDURING INTEGRITY',
    date: 'JULY 2026',
    readTime: '3 MIN READ',
    type: 'image',
    mediaUrl: '/assets/blog/4.jpg',
    align: 'right',
    snippet:
      'Why imperfections and organic rings in natural timber narrate an unhurried story of endurance, season after season.',
    content: [
      'Modern mass production treats wood grain as a uniform substrate to be sanded flat and pigmented into monotony. In our studio, every sap line and knot cluster is treated as geological calligraphy.',
      'These natural variations tell the biography of mountain storms, droughts, and sunlit summers that formed the tree over eighty to a hundred and twenty years.',
      'By celebrating these organic narratives, each bespoke commission becomes an unrepeatable collector’s item that can never be replicated.',
    ],
  },
  {
    id: 5,
    tag: 'PHILOSOPHY // 05',
    title: 'MODERN HERITAGE',
    subtitle: 'EASTERN ARCHITECTURE',
    date: 'JUNE 2026',
    readTime: '6 MIN READ',
    type: 'image',
    mediaUrl: '/assets/blog/5.jpg',
    align: 'left',
    snippet:
      'Bridging Eastern mountain craftsmanship with minimalist brutalist silhouettes in bespoke private residential commissions.',
    content: [
      'How does one synthesize sacred Himalayan Buddhist architectural motifs with the restrained discipline of mid-century European brutalism? The answer lies in structural honesty.',
      'Neither tradition disguises its load paths: columns are proudly expressed, joint junctions celebrate their interlocking geometry, and finishes reveal raw materiality.',
      'In our contemporary cabinetry and table collections, we unite these lineages to create heirloom furniture suited for modern residential lofts worldwide.',
    ],
  },
  {
    id: 6,
    tag: 'INTERIOR DOSSIER // 06',
    title: 'SHADOW & PROPORTION',
    subtitle: 'CHIAROSCURO INTERIORS',
    date: 'MAY 2026',
    readTime: '4 MIN READ',
    type: 'image',
    mediaUrl: '/assets/blog/6.jpg',
    align: 'right',
    snippet:
      'How morning alpine light enters hillside residences, creating contemplative chiaroscuro across hand-rubbed oil finishes.',
    content: [
      'Light at 5,400 feet elevation holds an acute crystalline clarity. As sunlight passes across timber surfaces throughout the day, the depth of open pores and micro-carvings transforms the atmosphere.',
      'We design furniture with deliberate overhangs and recessed shadow gaps that register shifting solar angles, casting poetic geometric shadows along walls and floors.',
      'It is this quiet, living presence that transforms a house into an evocative domestic temple.',
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   BlogPage Component
   - Perspective scroll container: 1200px perspective + transform-style: preserve-3d
   - Dynamic 3D transforms: rotateX & translateZ linked to scroll progress
   - Magazine layout: alternating alignment, sharp media corners, drop shadows,
     and overlapping serif text blocks.
   ═══════════════════════════════════════════════════════════════════════════ */
export default function BlogPage({ onNavigate }) {
  const scrollContainerRef = useRef(null);
  const cardElementsRef = useRef([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  /* ── 3D Interactive Scroll Calculation ─────────────────────────────────── */
  const calculate3DTransforms = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenterY = containerRect.top + containerRect.height / 2;
    const halfHeight = containerRect.height / 2;

    cardElementsRef.current.forEach((card) => {
      if (!card) return;

      const cardRect = card.getBoundingClientRect();
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const deltaY = cardCenterY - containerCenterY;

      // Progress normalized: 0 at center, positive below center, negative above
      const progress = deltaY / halfHeight;

      let rotX = 0;
      let transZ = 0;
      let opacity = 1;

      if (progress > 0) {
        // Enters from bottom: tilt backwards (+15deg) and pushed back in Z-space (-150px)
        const p = Math.min(progress, 1);
        rotX = p * 15;
        transZ = p * -150;
        opacity = Math.max(0.2, 1 - p * 0.45);
      } else {
        // Leaves towards top: tilt forwards (-15deg) and fade out
        const p = Math.min(Math.abs(progress), 1);
        rotX = -p * 15;
        transZ = -p * 150;
        opacity = Math.max(0, 1 - p * 1.15);
      }

      card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) translateZ(${transZ.toFixed(1)}px)`;
      card.style.opacity = opacity.toFixed(3);
    });
  }, []);

  /* ── Scroll and Resize Listeners using requestAnimationFrame ──────────── */
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let rafId = null;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(calculate3DTransforms);
    };

    // Initial run
    calculate3DTransforms();
    const timer = setTimeout(calculate3DTransforms, 120);

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(timer);
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [calculate3DTransforms]);

  /* ── Close modal on Escape key ────────────────────────────────────────── */
  useEffect(() => {
    if (!selectedArticle) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedArticle(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticle]);

  return (
    <div className="blog-page">
      {/* ── 3D Interactive Scroll Container ─────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        className="blog-scroll-container"
        tabIndex={0}
        aria-label="Blog Journal Stream"
      >
        {/* ── Editorial Header ──────────────────────────────────────────── */}
        <header className="blog-hero">
          <div className="blog-hero__meta">
            <span className="blog-hero__tag">DOSSIER // 02</span>
            <span className="blog-hero__volume">VOL. XXIV</span>
          </div>
          <h2 className="blog-hero__title">CHRONICLES</h2>
          <p className="blog-hero__desc">
            Reflections on high-altitude materiality, architectural joinery, and
            the meditative art of Himalayan living.
          </p>
        </header>

        {/* ── Spatial Magazine Feed (Alternating Cards) ─────────────────── */}
        <div className="blog-feed">
          {BLOG_POSTS.map((post, idx) => {
            const isLeft = post.align === 'left';
            return (
              <article
                key={post.id}
                ref={(el) => (cardElementsRef.current[idx] = el)}
                className={`blog-card ${isLeft ? 'blog-card--left' : 'blog-card--right'}`}
                onClick={() => setSelectedArticle(post)}
                role="button"
                tabIndex={0}
                aria-label={`Read article: ${post.title}`}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedArticle(post)}
              >
                {/* ── Media Element (Image or Video) ────────────────────── */}
                <div className="blog-card__media-wrap">
                  {post.type === 'video' ? (
                    <video
                      className="blog-card__media-video"
                      autoPlay
                      loop
                      muted
                      playsInline
                      src={post.mediaUrl}
                      aria-label={post.title}
                    />
                  ) : (
                    <img
                      className="blog-card__media-img"
                      src={post.mediaUrl}
                      alt={post.title}
                      loading="lazy"
                    />
                  )}
                  <span className="blog-card__badge">{post.tag}</span>
                </div>

                {/* ── Overlapping Serif Text Block ──────────────────────── */}
                <div className="blog-card__text-block">
                  <div className="blog-card__header-meta">
                    <span className="blog-card__date">{post.date}</span>
                    <span className="blog-card__read-time">{post.readTime}</span>
                  </div>

                  <h3 className="blog-card__title">{post.title}</h3>
                  <span className="blog-card__subtitle">{post.subtitle}</span>

                  <p className="blog-card__snippet">{post.snippet}</p>

                  <div className="blog-card__action">
                    <span className="blog-card__cta">
                      {post.type === 'video' ? 'WATCH FILM' : 'READ MORE'}
                    </span>
                    <span className="blog-card__arrow" aria-hidden="true">→</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Bottom Colophon Watermark ─────────────────────────────────── */}
        <footer className="blog-colophon">
          <span className="blog-colophon__mark">FSG ATELIER</span>
          <p className="blog-colophon__text">
            ARCHIVES UPDATED BIMONTHLY IN GANGTOK, SIKKIM
          </p>
        </footer>
      </div>

      {/* ── Interactive Editorial Article Reader Modal ───────────────────── */}
      {selectedArticle && (
        <div
          className="blog-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-article-title"
        >
          <div className="blog-modal__scroller">
            {/* Close Button */}
            <button
              type="button"
              className="blog-modal__close-btn"
              onClick={() => setSelectedArticle(null)}
              aria-label="Close article"
            >
              <span>RETURN</span>
              <span className="blog-modal__close-icon" aria-hidden="true">✕</span>
            </button>

            {/* Modal Media */}
            <div className="blog-modal__media-wrap">
              {selectedArticle.type === 'video' ? (
                <video
                  className="blog-modal__media-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={selectedArticle.mediaUrl}
                />
              ) : (
                <img
                  className="blog-modal__media-img"
                  src={selectedArticle.mediaUrl}
                  alt={selectedArticle.title}
                />
              )}
            </div>

            {/* Modal Article Content */}
            <div className="blog-modal__body">
              <span className="blog-modal__tag">{selectedArticle.tag}</span>
              <h2 id="modal-article-title" className="blog-modal__title">
                {selectedArticle.title}
              </h2>
              <div className="blog-modal__meta">
                <span className="blog-modal__date">{selectedArticle.date}</span>
                <span className="blog-modal__bullet">•</span>
                <span className="blog-modal__read-time">{selectedArticle.readTime}</span>
              </div>

              <div className="blog-modal__prose">
                {selectedArticle.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="blog-modal__paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="blog-modal__footer">
                <button
                  type="button"
                  className="blog-modal__explore-btn"
                  onClick={() => {
                    setSelectedArticle(null);
                    if (onNavigate) onNavigate('collection');
                  }}
                >
                  EXPLORE ARCHIVE PIECES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
