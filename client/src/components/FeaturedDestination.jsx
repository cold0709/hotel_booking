import React, { useEffect, useRef, useState } from 'react'
import { roomsDummyData } from '../assets/assets'
import HotelCard from './HotelCard'
import Title from './Title'

// ─────────────────────────────────────────────────────────────────────────────
// SENIOR NOTE: All section styles are co-located here for zero external CSS
// dependency. CSS custom properties keep the gold palette consistent with
// HotelCard and Hero. Keyframes defined once; reused via className.
// ─────────────────────────────────────────────────────────────────────────────
const SectionStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500&display=swap');

    /* ── Design tokens (match HotelCard palette exactly) ─────────────────── */
    :root {
      --gold:         #d4af69;
      --gold-light:   #f0d088;
      --gold-dim:     rgba(212, 175, 105, 0.12);
      --dark-base:    #09090f;
      --dark-mid:     #0d0c18;
      --dark-card:    #111120;
    }

    /* ── Section shell ────────────────────────────────────────────────────── */
    /* CHANGE: Replaced bg-slate-50 with a deep obsidian gradient that        */
    /* matches the HotelCard dark-luxury palette perfectly.                   */
    .fd-section {
      position: relative;
      background: linear-gradient(170deg, #0d0c18 0%, #09090f 45%, #0e0b1a 100%);
      padding: 110px 0 130px;
      overflow: hidden;
      isolation: isolate;
    }

    /* ── Background: perspective grid ────────────────────────────────────── */
    /* CHANGE: Gold micro-grid adds depth without distracting from content.   */
    /* mask-image radial fades the grid away at the edges.                   */
    .fd-grid-bg {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(212,175,105,0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(212,175,105,0.045) 1px, transparent 1px);
      background-size: 58px 58px;
      mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black 20%, transparent 100%);
      pointer-events: none;
      z-index: 0;
    }

    /* ── Background: floating ambient orbs ───────────────────────────────── */
    /* CHANGE: Two large blurred circles create colour depth without images.  */
    @keyframes fd-drift-a {
      0%,100% { transform: translate(0,0)       scale(1);    }
      50%      { transform: translate(35px,45px) scale(1.08); }
    }
    @keyframes fd-drift-b {
      0%,100% { transform: translate(0,0)          scale(1.04); }
      50%      { transform: translate(-28px,-36px) scale(0.94); }
    }
    .fd-orb-a {
      position: absolute; top: -120px; left: -90px;
      width: 560px; height: 560px;
      background: radial-gradient(circle, rgba(212,175,105,0.09) 0%, transparent 68%);
      border-radius: 50%; pointer-events: none; z-index: 0;
      animation: fd-drift-a 10s ease-in-out infinite;
    }
    .fd-orb-b {
      position: absolute; bottom: -80px; right: -60px;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(90,70,180,0.08) 0%, transparent 68%);
      border-radius: 50%; pointer-events: none; z-index: 0;
      animation: fd-drift-b 13s ease-in-out infinite;
    }
    /* CHANGE: Third centre orb softly illuminates the card row.             */
    .fd-orb-c {
      position: absolute; top: 52%; left: 50%;
      width: 800px; height: 260px;
      transform: translate(-50%, -50%);
      background: radial-gradient(ellipse, rgba(212,175,105,0.05) 0%, transparent 65%);
      pointer-events: none; z-index: 0;
    }

    /* ── Edge fade strips ─────────────────────────────────────────────────── */
    /* CHANGE: Gradient strips at top/bottom blend the section seamlessly     */
    /* into adjacent page sections — no hard colour boundary.                */
    .fd-fade-top {
      position: absolute; top:0; left:0; right:0; height:90px;
      background: linear-gradient(to bottom, #07070e, transparent);
      pointer-events: none; z-index: 3;
    }
    .fd-fade-bot {
      position: absolute; bottom:0; left:0; right:0; height:90px;
      background: linear-gradient(to top, #07070e, transparent);
      pointer-events: none; z-index: 3;
    }

    /* ── Mouse-reactive spotlight ─────────────────────────────────────────── */
    /* CHANGE: Radial spotlight follows the cursor across the section,        */
    /* giving the flat background a sense of physical depth.                 */
    .fd-spotlight {
      position: absolute; inset: 0;
      pointer-events: none; z-index: 1;
      transition: background 0.18s ease;
    }

    /* ── Title wrapper ────────────────────────────────────────────────────── */
    /* CHANGE: Wraps the imported <Title /> so we can animate it on scroll    */
    /* without touching the Title component itself.                           */
    .fd-title-wrap {
      position: relative; z-index: 2;
      text-align: center;
      padding: 0 24px;
      margin-bottom: 70px;
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.72s cubic-bezier(0.22,1,0.36,1),
                  transform 0.72s cubic-bezier(0.22,1,0.36,1);
    }
    .fd-title-wrap.vis { opacity: 1; transform: translateY(0); }

    /* CHANGE: Gold expanding underline animates in after the title fades up. */
    .fd-title-bar {
      width: 0;
      height: 2px;
      margin: 18px auto 0;
      border-radius: 2px;
      background: linear-gradient(to right, transparent, var(--gold), transparent);
      transition: width 1.1s cubic-bezier(0.22,1,0.36,1) 0.3s;
    }
    .fd-title-wrap.vis .fd-title-bar { width: 200px; }

    /* ── Override Title component colours for dark background ────────────── */
    /* CHANGE: <Title /> was designed for light bg (slate-50). We inject      */
    /* targeted overrides so it reads correctly on the dark section.         */
    .fd-title-wrap h2,
    .fd-title-wrap h1,
    .fd-title-wrap h3 {
      color: #f5f0e8 !important;
      font-family: 'Cormorant Garamond', serif !important;
    }
    .fd-title-wrap p {
      color: rgba(245,240,232,0.50) !important;
      font-family: 'DM Sans', sans-serif !important;
      font-weight: 300 !important;
    }

    /* ── Cards grid ───────────────────────────────────────────────────────── */
    /* CHANGE: CSS Grid auto-fill replaces flex-wrap — gives even column      */
    /* widths and cleaner alignment at every breakpoint.                     */
    .fd-cards-grid {
      position: relative; z-index: 2;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
      gap: 30px;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }
    @media (min-width: 768px)  { .fd-cards-grid { padding: 0 64px; } }
    @media (min-width: 1024px) { .fd-cards-grid { padding: 0 88px; } }

    /* ── Per-card reveal wrapper ──────────────────────────────────────────── */
    /* CHANGE: Each card starts invisible + offset. IntersectionObserver adds */
    /* .vis class → transition plays. nth-child delays create the stagger.   */
    .fd-card-wrap {
      opacity: 0;
      transform: translateY(55px) scale(0.95);
      transition: opacity 0.68s cubic-bezier(0.22,1,0.36,1),
                  transform 0.68s cubic-bezier(0.22,1,0.36,1);
    }
    .fd-card-wrap.vis { opacity: 1; transform: translateY(0) scale(1); }
    .fd-card-wrap:nth-child(1) { transition-delay: 0.04s; }
    .fd-card-wrap:nth-child(2) { transition-delay: 0.14s; }
    .fd-card-wrap:nth-child(3) { transition-delay: 0.24s; }
    .fd-card-wrap:nth-child(4) { transition-delay: 0.34s; }

    /* ── "Explore All" CTA ────────────────────────────────────────────────── */
    /* CHANGE: New CTA below the cards. Same pill style as the Navbar         */
    /* Dashboard button for design consistency.                              */
    .fd-footer {
      position: relative; z-index: 2;
      display: flex; justify-content: center;
      margin-top: 64px;
      opacity: 0; transform: translateY(20px);
      transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
    }
    .fd-footer.vis { opacity: 1; transform: translateY(0); }

    .fd-cta-btn {
      position: relative;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px; font-weight: 600;
      letter-spacing: 2.2px; text-transform: uppercase;
      color: var(--gold);
      background: transparent;
      border: 1px solid rgba(212,175,105,0.38);
      border-radius: 50px;
      padding: 15px 46px;
      cursor: pointer; overflow: hidden;
      transition: color 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease;
    }
    /* CHANGE: Gold fill sweeps in on hover — same pattern as HotelCard btn. */
    .fd-cta-btn::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      opacity: 0; transition: opacity 0.28s ease;
      border-radius: inherit;
    }
    .fd-cta-btn:hover::before { opacity: 1; }
    .fd-cta-btn:hover {
      color: #0f0e17;
      border-color: var(--gold);
      box-shadow: 0 0 32px rgba(212,175,105,0.38);
    }
    .fd-cta-btn span { position: relative; z-index: 1; }

    /* ── Floating sparkle particles ──────────────────────────────────────── */
    /* CHANGE: Tiny gold dots rise from the bottom on looping CSS animations  */
    /* — organic motion with zero JavaScript cost.                           */
    @keyframes fd-spark {
      0%   { transform: translateY(0)     scale(0); opacity: 0;    }
      20%  { transform: translateY(-18px) scale(1); opacity: 0.55; }
      80%  { opacity: 0.25; }
      100% { transform: translateY(-95px) scale(0); opacity: 0;    }
    }
    .fd-sparkle {
      position: absolute;
      border-radius: 50%;
      background: var(--gold);
      pointer-events: none;
      animation: fd-spark linear infinite;
      z-index: 1;
    }
  `}</style>
)

// ─────────────────────────────────────────────────────────────────────────────
// SENIOR NOTE: Sparkle config defined outside the component as a constant so
// it is never re-allocated on re-renders — pure data, zero runtime cost.
// ─────────────────────────────────────────────────────────────────────────────
const SPARKLES = [
  { left: '8%',  bottom: '12%', size: 3, dur: '3.8s', delay: '0s'   },
  { left: '22%', bottom: '18%', size: 2, dur: '4.6s', delay: '0.7s' },
  { left: '40%', bottom: '10%', size: 4, dur: '5.1s', delay: '1.3s' },
  { left: '58%', bottom: '15%', size: 2, dur: '3.4s', delay: '0.4s' },
  { left: '74%', bottom: '20%', size: 3, dur: '4.9s', delay: '1.8s' },
  { left: '88%', bottom: '9%',  size: 2, dur: '3.2s', delay: '2.2s' },
]

const FeaturedDestination = () => {
  // SENIOR NOTE: sectionRef targets the <section> for IntersectionObserver.
  // visible drives the .vis class for all CSS transitions in one go.
  // mousePos feeds the cursor-following spotlight via inline style.
  const sectionRef = useRef(null)
  const [visible,  setVisible]  = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  // ── Scroll-triggered reveal ───────────────────────────────────────────────
  // CHANGE: IntersectionObserver fires once at 10% visibility, sets visible=true,
  // then disconnects — no polling, no scroll event listeners, battery-friendly.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()   // fire once then stop watching
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // ── Mouse spotlight handler ───────────────────────────────────────────────
  // CHANGE: Tracks cursor position as a % of section dims so the radial
  // spotlight background follows the mouse realistically.
  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    setMousePos({
      x: ((e.clientX - rect.left)  / rect.width)  * 100,
      y: ((e.clientY - rect.top)   / rect.height) * 100,
    })
  }

  return (
    <>
      <SectionStyles />

      <section
        ref={sectionRef}
        className="fd-section"
        onMouseMove={handleMouseMove}
      >
        {/* ── Atmospheric BG layers (z-index 0) — purely decorative ─────── */}
        <div className="fd-grid-bg"   aria-hidden="true" />
        <div className="fd-orb-a"    aria-hidden="true" />
        <div className="fd-orb-b"    aria-hidden="true" />
        <div className="fd-orb-c"    aria-hidden="true" />
        <div className="fd-fade-top"  aria-hidden="true" />
        <div className="fd-fade-bot"  aria-hidden="true" />

        {/* CHANGE: Spotlight div updates background on every mousemove.     */}
        <div
          className="fd-spotlight"
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle 520px at ${mousePos.x}% ${mousePos.y}%,
              rgba(212,175,105,0.07), transparent 68%)`,
          }}
        />

        {/* CHANGE: CSS-only sparkle dots — six particles, staggered timers. */}
        {SPARKLES.map((s, i) => (
          <div
            key={i}
            className="fd-sparkle"
            aria-hidden="true"
            style={{
              left:              s.left,
              bottom:            s.bottom,
              width:             `${s.size}px`,
              height:            `${s.size}px`,
              animationDuration: s.dur,
              animationDelay:    s.delay,
            }}
          />
        ))}

        {/* ── Title block ───────────────────────────────────────────────── */}
        {/* CHANGE: Wrapped <Title /> in .fd-title-wrap to:                  */}
        {/*  1. Animate it up on scroll entry (.vis class)                   */}
        {/*  2. Override its text colours for the dark background            */}
        {/*  3. Append the expanding gold underline bar below it             */}
        {/* The <Title /> component itself is 100% untouched.                */}
        <div className={`fd-title-wrap${visible ? ' vis' : ''}`}>
          <Title
            title="Featured Destination"
            subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
          />
          {/* CHANGE: Gold bar expands from 0 → 200px after title fades in. */}
          <div className="fd-title-bar" aria-hidden="true" />
        </div>

        {/* ── Cards grid ────────────────────────────────────────────────── */}
        {/* CHANGE: CSS Grid replaces flex-wrap for consistent column widths. */}
        {/* fd-card-wrap stagger-reveals each HotelCard on scroll entry.     */}
        {/* Fixed original typos: items-centre / justify-centre removed.     */}
        <div className="fd-cards-grid">
          {roomsDummyData.slice(0, 4).map((room, index) => (
            <div
              key={room._id}
              className={`fd-card-wrap${visible ? ' vis' : ''}`}
            >
              {/* HotelCard is completely unchanged — only its wrapper animates */}
              <HotelCard room={room} index={index} />
            </div>
          ))}
        </div>

        {/* ── CTA Footer ────────────────────────────────────────────────── */}
        {/* CHANGE: "Explore All Properties" button fades in last (delay 0.5s)*/}
        {/* after the cards have settled — draws the eye to the next action. */}
        <div className={`fd-footer${visible ? ' vis' : ''}`}>
          <button className="fd-cta-btn">
            <span>Explore All Properties</span>
          </button>
        </div>
      </section>
    </>
  )
}

export default FeaturedDestination