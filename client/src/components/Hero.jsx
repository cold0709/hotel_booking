import React, { useEffect, useRef } from "react";
import { assets, cities } from "../assets/assets";

// ─────────────────────────────────────────────────────────────────────────────
// SENIOR NOTE: All hero styles are scoped here to avoid polluting global CSS.
// We use CSS custom properties (--rx, --ry) to drive the mouse-tilt effect
// purely from JS → CSS, keeping the render loop off React state for perf.
// Keyframes defined once; classes applied via JSX className.
// ─────────────────────────────────────────────────────────────────────────────
const HeroStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,600&family=DM+Sans:wght@300;400;500&display=swap');

    /* ── Design tokens ────────────────────────────────────────────────────── */
    :root {
      --gold:       #d4af69;
      --gold-light: #f0d088;
      --gold-glow:  rgba(212, 175, 105, 0.35);
      --glass-bg:   rgba(10, 10, 18, 0.55);
      --glass-border: rgba(255, 255, 255, 0.10);
    }

    /* ── 3D tilt scene wrapper ────────────────────────────────────────────── */
    /* CHANGE: Added perspective wrapper so child rotations look truly 3-D.   */
    .hero-scene { perspective: 1400px; }

    /* CHANGE: tilt-card reads --rx/--ry custom props set by mousemove in JS. */
    /* ease-out on transition keeps motion responsive but not jittery.         */
    .tilt-card {
      transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
      transition: transform 0.18s ease-out;
      transform-style: preserve-3d;
    }

    /* ── Entrance animations ──────────────────────────────────────────────── */
    /* CHANGE: fadeSlideUp now includes a subtle rotateX for a 3-D "rise"     */
    /* effect that is consistent with the tilt-card transform-style context.  */
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(50px) rotateX(18deg); }
      to   { opacity: 1; transform: translateY(0)    rotateX(0deg);  }
    }

    /* CHANGE: shimmer sweeps gold light across the heading text on a loop.   */
    /* background-size: 300% gives plenty of travel distance for the sweep.  */
    @keyframes shimmer {
      0%   { background-position: -300% center; }
      100% { background-position:  300% center; }
    }

    /* CHANGE: New floating animation for the decorative orb behind the hero. */
    @keyframes float-orb {
      0%, 100% { transform: translateY(0) scale(1);    }
      50%       { transform: translateY(-28px) scale(1.06); }
    }

    /* CHANGE: Pulse ring that emanates from the gold badge on load.          */
    @keyframes badge-ring {
      0%   { box-shadow: 0 0 0 0   rgba(212,175,105,0.45); }
      70%  { box-shadow: 0 0 0 14px rgba(212,175,105,0);   }
      100% { box-shadow: 0 0 0 0   rgba(212,175,105,0);    }
    }

    /* CHANGE: Subtle scan-line sweep across the whole hero background.       */
    @keyframes scanline {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }

    /* ── Staggered content layers ─────────────────────────────────────────── */
    /* translateZ lifts each layer at a different depth for parallax feel.    */
    .anim-1 { animation: fadeSlideUp 0.85s cubic-bezier(0.22,1,0.36,1) both 0.1s;  transform: translateZ(40px); }
    .anim-2 { animation: fadeSlideUp 0.85s cubic-bezier(0.22,1,0.36,1) both 0.28s; transform: translateZ(70px); }
    .anim-3 { animation: fadeSlideUp 0.85s cubic-bezier(0.22,1,0.36,1) both 0.46s; transform: translateZ(45px); }
    .anim-4 { animation: fadeSlideUp 0.85s cubic-bezier(0.22,1,0.36,1) both 0.62s; transform: translateZ(55px); }

    /* ── Shimmer heading ──────────────────────────────────────────────────── */
    .shimmer-text {
      background: linear-gradient(
        90deg,
        #fff 25%,
        var(--gold-light) 45%,
        #f5e6b8 50%,
        var(--gold-light) 55%,
        #fff 75%
      );
      background-size: 300% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 5s linear infinite;
      animation-delay: 1.2s;
    }

    /* ── Hero overlay layers ──────────────────────────────────────────────── */
    /* CHANGE: Multi-stop gradient overlay darkens bottom-left where the      */
    /* content sits while keeping the right side of the image visible.        */
    .hero-overlay {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 70% 80% at 0% 60%, rgba(6,5,15,0.80) 0%, transparent 70%),
        linear-gradient(to right, rgba(6,5,15,0.70) 0%, rgba(6,5,15,0.10) 60%, transparent 100%),
        linear-gradient(to top,   rgba(6,5,15,0.60) 0%, transparent 50%);
      pointer-events: none;
      z-index: 1;
    }

    /* CHANGE: Decorative ambient orb — adds depth behind the text block.     */
    .hero-orb {
      position: absolute;
      top: 20%;
      left: -5%;
      width: 520px;
      height: 520px;
      background: radial-gradient(circle, rgba(212,175,105,0.07) 0%, transparent 65%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      animation: float-orb 8s ease-in-out infinite;
    }

    /* CHANGE: Subtle single-pass scan-line for cinematic atmosphere.         */
    .hero-scanline {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 2;
    }
    .hero-scanline::after {
      content: '';
      position: absolute;
      left: 0; right: 0;
      height: 2px;
      background: linear-gradient(to right, transparent, rgba(212,175,105,0.08), transparent);
      animation: scanline 7s linear infinite;
      animation-delay: 2s;
    }

    /* CHANGE: Top & bottom vignette fade edges to ground the hero section.   */
    .hero-fade-top {
      position: absolute; top: 0; left: 0; right: 0;
      height: 120px;
      background: linear-gradient(to bottom, rgba(6,5,15,0.55), transparent);
      pointer-events: none; z-index: 2;
    }
    .hero-fade-bot {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 160px;
      background: linear-gradient(to top, rgba(6,5,15,0.80), transparent);
      pointer-events: none; z-index: 2;
    }

    /* ── Badge ───────────────────────────────────────────────────────────── */
    /* CHANGE: Pulsing ring animation so the badge draws the eye immediately. */
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(212,175,105,0.12);
      border: 1px solid rgba(212,175,105,0.45);
      color: var(--gold-light);
      padding: 8px 20px;
      border-radius: 50px;
      font-family: 'DM Sans', sans-serif;
      font-size: 11.5px;
      font-weight: 500;
      letter-spacing: 2px;
      text-transform: uppercase;
      width: fit-content;
      animation: badge-ring 2.5s ease-out 1.2s 1;
    }

    /* CHANGE: Small animated dot inside badge adds life without noise.       */
    .hero-badge-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--gold);
      box-shadow: 0 0 6px var(--gold);
      animation: badge-ring 1.8s ease-in-out infinite;
    }

    /* ── Scroll cue ──────────────────────────────────────────────────────── */
    /* CHANGE: Animated scroll indicator at bottom-center of the hero.        */
    @keyframes scroll-cue {
      0%   { transform: translateY(0);   opacity: 0.8; }
      60%  { transform: translateY(10px); opacity: 0.2; }
      100% { transform: translateY(0);   opacity: 0.8; }
    }
    .hero-scroll-cue {
      position: absolute;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 5;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      opacity: 0;
      animation: fadeSlideUp 0.8s ease both 1.4s;
    }
    .hero-scroll-cue span {
      font-family: 'DM Sans', sans-serif;
      font-size: 9px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.35);
    }
    .hero-scroll-arrow {
      width: 1px;
      height: 36px;
      background: linear-gradient(to bottom, rgba(212,175,105,0.6), transparent);
      animation: scroll-cue 2s ease-in-out infinite;
      animation-delay: 2s;
    }

    /* ── Glass search form ────────────────────────────────────────────────── */
    /* CHANGE: Entire form replaced with a glassmorphism card that floats     */
    /* above the hero image using backdrop-filter + layered borders/shadows.  */
    .hero-form {
      background: rgba(8, 8, 18, 0.62);
      backdrop-filter: blur(20px) saturate(160%);
      -webkit-backdrop-filter: blur(20px) saturate(160%);
      border: 1px solid rgba(255,255,255,0.09);
      border-top: 1px solid rgba(212,175,105,0.22);
      border-radius: 18px;
      padding: 6px;
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      margin-top: 36px;
      box-shadow:
        0 8px 40px rgba(0,0,0,0.55),
        0 0 0 1px rgba(212,175,105,0.06),
        inset 0 1px 0 rgba(255,255,255,0.05);
      max-width: 860px;
    }

    /* CHANGE: Each field is its own pill that highlights on focus-within.    */
    .form-field {
      display: flex;
      flex-direction: column;
      padding: 12px 18px;
      border-radius: 12px;
      flex: 1;
      min-width: 140px;
      transition: background 0.22s ease;
      position: relative;
    }
    .form-field:hover,
    .form-field:focus-within {
      background: rgba(212,175,105,0.07);
    }

    /* CHANGE: Vertical separator line between form fields (desktop only).    */
    .form-field + .form-field::before {
      content: '';
      position: absolute;
      left: 0; top: 20%; bottom: 20%;
      width: 1px;
      background: rgba(255,255,255,0.07);
    }

    /* CHANGE: Field labels styled with gold micro-type for luxury feel.      */
    .form-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 1.8px;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .form-label img {
      height: 12px;
      filter: invert(1) sepia(1) saturate(2) hue-rotate(5deg) brightness(0.85);
      opacity: 0.75;
    }

    /* CHANGE: Inputs are transparent — the pill background acts as the field.*/
    .form-input {
      background: transparent;
      border: none;
      outline: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 13.5px;
      font-weight: 400;
      color: rgba(255,255,255,0.88);
      width: 100%;
      caret-color: var(--gold);
    }
    .form-input::placeholder { color: rgba(255,255,255,0.28); }

    /* CHANGE: Date input colour override — browsers render it in OS default  */
    /* colour; forcing white keeps it consistent with the dark form palette.  */
    .form-input[type="date"] { color-scheme: dark; }

    /* CHANGE: Number spinner hidden to keep the guests field clean.          */
    .form-input[type="number"]::-webkit-inner-spin-button,
    .form-input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }

    /* CHANGE: Search button is a self-contained gold CTA pill inside the     */
    /* form, elevated with a shadow bloom. Hover lifts it 2px.               */
    .hero-search-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 28px;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 50%, #c9982a 100%);
      color: #0f0e17;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      cursor: pointer;
      transition: transform 0.22s ease, box-shadow 0.22s ease;
      position: relative;
      overflow: hidden;
      align-self: center;
      box-shadow: 0 4px 20px rgba(212,175,105,0.40);
      margin: 4px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    /* CHANGE: Glint overlay on button — static shimmer layer.               */
    .hero-search-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%);
    }
    .hero-search-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(212,175,105,0.55);
    }
    .hero-search-btn img {
      height: 15px;
      filter: brightness(0); /* Make icon black to contrast gold button */
      position: relative; z-index: 1;
    }
    .hero-search-btn span { position: relative; z-index: 1; }

    /* ── Responsive: stack form fields on mobile ──────────────────────────── */
    @media (max-width: 768px) {
      .hero-form      { flex-direction: column; padding: 10px; gap: 4px; }
      .form-field     { min-width: unset; padding: 10px 14px; }
      .form-field + .form-field::before { display: none; }
      .hero-search-btn{ width: 100%; margin: 6px 0 0; padding: 14px; }
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// SENIOR NOTE: CalendarIcon renders an inline SVG instead of the broken
// <path> fragments that were floating outside any <svg> in the original code.
// This is a pure presentational component — no props needed.
// ─────────────────────────────────────────────────────────────────────────────
const CalendarIcon = ({ className = "h-3 w-3" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "var(--gold)", flexShrink: 0 }}
  >
    <path d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// SENIOR NOTE: LocationIcon — new icon for the Destination field.
// Kept as a separate component for re-usability and semantic clarity.
// ─────────────────────────────────────────────────────────────────────────────
const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12" height="12"
    fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ color: "var(--gold)", flexShrink: 0 }}
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5Z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// SENIOR NOTE: GuestIcon — person silhouette for the Guests field.
// ─────────────────────────────────────────────────────────────────────────────
const GuestIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12" height="12"
    fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ color: "var(--gold)", flexShrink: 0 }}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Hero Component
// ─────────────────────────────────────────────────────────────────────────────
const Hero = () => {
  // SENIOR NOTE: useRef gives us a direct DOM handle for the mouse-tilt
  // effect. We deliberately avoid useState here — setting CSS custom properties
  // directly skips React's reconciler entirely, giving us 60fps motion with
  // zero re-render overhead.
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;

    // CHANGE: Increased tilt sensitivity (10 → 12 for X, 10 → 14 for Y) to
    // make the 3D effect more perceptible on large viewport widths.
    const handleMouseMove = (e) => {
      const { clientX, clientY, currentTarget } = e;
      const { width, height, left, top } = currentTarget.getBoundingClientRect();
      const x = (clientX - left) / width  - 0.5; // –0.5 → +0.5 range
      const y = (clientY - top)  / height - 0.5;
      hero.style.setProperty("--rx", `${y * -12}deg`);
      hero.style.setProperty("--ry", `${x *  14}deg`);
    };

    // SENIOR NOTE: On leave we snap back to zero so the card never stays
    // tilted when the cursor exits the viewport.
    const reset = () => {
      hero.style.setProperty("--rx", "0deg");
      hero.style.setProperty("--ry", "0deg");
    };

    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", reset);
    return () => {
      // SENIOR NOTE: Always clean up event listeners in the effect teardown
      // to prevent memory leaks when the component unmounts.
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseleave", reset);
    };
  }, []); // empty deps — effect runs once on mount, cleanup on unmount

  return (
    <>
      {/* Inject scoped styles (no CSS file dependency) */}
      <HeroStyles />

      {/* ── Hero wrapper ──────────────────────────────────────────────────
          CHANGE: Added `relative` + `overflow-hidden` so all absolutely
          positioned overlay layers stay clipped inside the hero bounds.
          Image source unchanged from original.
      ─────────────────────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="hero-scene relative flex flex-col items-start justify-center
          px-6 md:px-16 lg:px-24 xl:px-32 h-screen overflow-hidden
          bg-[url('/src/assets/heroimage.png')] bg-no-repeat bg-cover bg-center"
        style={{ paddingTop: "70px" }} // offset for fixed navbar height (unchanged)
      >

        {/* CHANGE: Multi-stop radial + linear gradient darkens the left half
            of the image so text remains legible on any background photo.    */}
        <div className="hero-overlay" />

        {/* CHANGE: Floating ambient glow orb — purely decorative depth cue. */}
        <div className="hero-orb" />

        {/* CHANGE: Single-pass scan-line for a subtle cinematic atmosphere. */}
        <div className="hero-scanline" />

        {/* CHANGE: Top + bottom fade edges ground the section into the page.*/}
        <div className="hero-fade-top" />
        <div className="hero-fade-bot" />

        {/* ── Tilt card — all content inside shares the 3D transform ────── */}
        <div
          className="tilt-card relative z-10 w-full"
          style={{ transformStyle: "preserve-3d" }}
        >

          {/* ── LAYER 1 · Badge ─────────────────────────────────────────── */}
          {/* CHANGE: Replaced plain text pill with a gold bordered badge that
              has a pulsing ring animation and a live dot indicator.         */}
          <div className="anim-1">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              The Ultimate Travel Experience
            </div>
          </div>

          {/* ── LAYER 2 · Heading ───────────────────────────────────────── */}
          {/* CHANGE: font-family set to Cormorant Garamond for luxury serif
              feel. Italic span on "Luxury" adds editorial contrast.
              clamp() keeps it fluid across all breakpoints.                */}
          <h1
            className="anim-2 shimmer-text mt-5 max-w-2xl"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
              lineHeight: 1.12,
              letterSpacing: "-0.5px",
            }}
          >
            Discover the{" "}
            <em style={{ fontStyle: "italic", fontWeight: 600 }}>Luxury</em>{" "}
            According to Your Budget
          </h1>

          {/* ── LAYER 3 · Sub-copy ──────────────────────────────────────── */}
          {/* CHANGE: DM Sans at font-weight 300 (light) reads elegantly
              against the dark overlay without competing with the heading.  */}
          <p
            className="anim-3 max-w-lg mt-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(13px, 1.5vw, 15px)",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.60)",
              letterSpacing: "0.3px",
            }}
          >
            Ultimate affordable and home-like experience and food with
            everything planned according to your budget.
          </p>

          {/* ── LAYER 4 · Search form ───────────────────────────────────── */}
          {/* CHANGE: Replaced solid white card with a glassmorphism panel.
              Each field is a hover-reactive pill. Inputs are transparent
              so the dark glass background reads as the field chrome.
              All original fields preserved: destination, check-in,
              check-out, guests, and search button.                         */}
          <form className="hero-form anim-4">

            {/* Field 1 · Destination */}
            <div className="form-field">
              <label htmlFor="destinationInput" className="form-label">
                <LocationIcon /> Destination
              </label>
              <input
                list="destinations"
                id="destinationInput"
                type="text"
                className="form-input"
                placeholder="Where to?"
                required
              />
              {/* SENIOR NOTE: <datalist> is paired to the input via list=
                  and id= attributes — unchanged from original logic.       */}
              <datalist id="destinations">
                {cities.map((city, index) => (
                  <option value={city} key={index} />
                ))}
              </datalist>
            </div>

            {/* Field 2 · Check-in */}
            <div className="form-field">
              <label htmlFor="checkIn" className="form-label">
                <CalendarIcon /> Check In
              </label>
              <input
                id="checkIn"
                type="date"
                className="form-input"
              />
            </div>

            {/* Field 3 · Check-out */}
            <div className="form-field">
              <label htmlFor="checkOut" className="form-label">
                <CalendarIcon /> Check Out
              </label>
              <input
                id="checkOut"
                type="date"
                className="form-input"
              />
            </div>

            {/* Field 4 · Guests */}
            {/* CHANGE: min/max unchanged (1–6). Spinner hidden via CSS for
                a cleaner look; user can still type a value directly.       */}
            <div className="form-field" style={{ maxWidth: 110, minWidth: 90 }}>
              <label htmlFor="guests" className="form-label">
                <GuestIcon /> Guests
              </label>
              <input
                id="guests"
                type="number"
                min={1}
                max={6}
                className="form-input"
                placeholder="1"
              />
            </div>

            {/* Search button */}
            {/* CHANGE: Gold gradient CTA pill with glint layer + hover lift.
                Original assets.searchIcon preserved; inverted black for
                contrast against the gold background.                       */}
            <button type="submit" className="hero-search-btn">
              <img src={assets.searchIcon} alt="search" />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* ── Scroll cue ─────────────────────────────────────────────────── */}
        {/* CHANGE: Animated vertical line + label nudges users to scroll.    */}
        <div className="hero-scroll-cue">
          <span>Scroll</span>
          <div className="hero-scroll-arrow" />
        </div>
      </div>
    </>
  );
};

export default Hero; 