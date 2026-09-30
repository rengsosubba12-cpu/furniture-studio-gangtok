import './HeroVideo.css';

/**
 * HeroVideo — Full-screen background video backdrop.
 * Mounted with autoPlay, muted, loop, playsInline.
 * Poster fallback shown when prefers-reduced-motion: reduce.
 */
export default function HeroVideo() {
  return (
    <div className="hero-video">
      <video
        className="hero-video__video"
        autoPlay
        muted
        loop
        playsInline
        poster="/assets/hero-poster.svg"
        aria-hidden="true"
      >
        <source src="/assets/Bg-video.mp4" type="video/mp4" />
      </video>

      {/* Static poster fallback for prefers-reduced-motion */}
      <img
        className="hero-video__poster"
        src="/assets/hero-poster.svg"
        alt=""
        aria-hidden="true"
        loading="eager"
      />

      {/* Gradient overlay for text contrast */}
      <div className="hero-video__overlay" aria-hidden="true" />
    </div>
  );
}
