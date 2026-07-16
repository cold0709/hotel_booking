import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

/* ─────────────────────────────────────────────
   FEATURE: Injected global styles for the navbar.
   Includes Cormorant Garamond + DM Sans fonts,
   CSS variables for the gold luxury palette,
   and all animation keyframes used below.
───────────────────────────────────────────── */
const NavStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

    :root {
      --gold: #d4af69;
      --gold-light: #f0d088;
      --gold-dim: rgba(212,175,105,0.15);
      --nav-dark: rgba(10, 10, 18, 0.75);
      --nav-light: rgba(255, 255, 255, 0.82);
    }

    /* FEATURE: Scroll-progress bar that runs across the very top of the page */
    .nav-progress-bar {
      position: fixed;
      top: 0; left: 0;
      height: 2px;
      background: linear-gradient(to right, var(--gold), var(--gold-light), var(--gold));
      z-index: 9999;
      transition: width 0.1s linear;
      box-shadow: 0 0 8px rgba(212,175,105,0.7);
    }

    /* FEATURE: Main nav bar base styles with smooth height + backdrop transitions */
    .navbar {
      font-family: 'DM Sans', sans-serif;
      transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* FEATURE: Frosted-glass scrolled state with a subtle bottom border glow */
    .navbar-scrolled {
      background: var(--nav-light) !important;
      backdrop-filter: blur(18px) saturate(180%);
      -webkit-backdrop-filter: blur(18px) saturate(180%);
      border-bottom: 1px solid rgba(212,175,105,0.2);
      box-shadow: 0 4px 30px rgba(0,0,0,0.08), 0 1px 0 rgba(212,175,105,0.15);
    }

    /* FEATURE: Transparent state (homepage hero) — semi-dark gradient so links stay readable */
    .navbar-transparent {
      background: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent);
    }

    /* FEATURE: Logo glow pulse on hover */
    .nav-logo {
      transition: filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
      filter: drop-shadow(0 0 0px transparent);
    }
    .nav-logo:hover {
      filter: drop-shadow(0 0 10px rgba(212,175,105,0.6));
      transform: scale(1.04);
    }

    /* FEATURE: Desktop nav link hover — animated gold underline slide */
    .nav-link {
      position: relative;
      font-size: 13px;
      font-weight: 400;
      letter-spacing: 0.6px;
      transition: color 0.3s ease;
      padding-bottom: 3px;
      text-decoration: none;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      height: 1.5px;
      width: 0;
      background: linear-gradient(to right, var(--gold), var(--gold-light));
      border-radius: 2px;
      transition: width 0.32s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 6px rgba(212,175,105,0.5);
    }
    .nav-link:hover::after { width: 100%; }

    /* FEATURE: Active route link gets a permanently visible gold underline dot */
    .nav-link-active::before {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--gold);
      box-shadow: 0 0 6px var(--gold);
    }

    /* FEATURE: Dashboard pill button with hover fill animation */
    .nav-dashboard-btn {
      font-family: 'DM Sans', sans-serif;
      font-size: 11.5px;
      font-weight: 500;
      letter-spacing: 1px;
      border-radius: 50px;
      padding: 7px 20px;
      border: 1px solid rgba(212,175,105,0.45);
      color: var(--gold);
      background: var(--gold-dim);
      cursor: pointer;
      transition: all 0.28s ease;
      position: relative;
      overflow: hidden;
    }
    .nav-dashboard-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      opacity: 0;
      transition: opacity 0.28s ease;
      border-radius: inherit;
    }
    .nav-dashboard-btn:hover::before { opacity: 1; }
    .nav-dashboard-btn:hover { color: #0f0e17; box-shadow: 0 0 20px rgba(212,175,105,0.4); }
    .nav-dashboard-btn span { position: relative; z-index: 1; }

    /* FEATURE: Login button — solid fill with ripple-ready styles */
    .nav-login-btn {
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.8px;
      border-radius: 50px;
      padding: 9px 28px;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .nav-login-btn.dark {
      background: linear-gradient(135deg, #1a1a2e, #0f0e17);
      color: var(--gold-light);
      box-shadow: 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(212,175,105,0.2);
    }
    .nav-login-btn.dark:hover {
      box-shadow: 0 6px 25px rgba(212,175,105,0.25), inset 0 1px 0 rgba(212,175,105,0.3);
      transform: translateY(-1px);
    }
    .nav-login-btn.light {
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      color: #0f0e17;
      box-shadow: 0 4px 15px rgba(212,175,105,0.35);
    }
    .nav-login-btn.light:hover {
      box-shadow: 0 6px 25px rgba(212,175,105,0.55);
      transform: translateY(-1px);
    }

    /* FEATURE: Search icon with gold glow on hover */
    .nav-search-icon {
      cursor: pointer;
      transition: filter 0.3s ease, transform 0.3s ease;
      height: 20px;
    }
    .nav-search-icon:hover {
      filter: drop-shadow(0 0 6px rgba(212,175,105,0.8)) invert(0.2) sepia(1) saturate(3) hue-rotate(5deg);
      transform: scale(1.1);
    }

    /* ─────────────────────────────────────────────
       FEATURE: Mobile menu — full-screen dark overlay
       that slides in from the right with a staggered
       list item reveal animation.
    ───────────────────────────────────────────── */
    .mobile-menu {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100vh;
      background: linear-gradient(145deg, #0d0c18 0%, #0b0b12 60%, #111120 100%);
      z-index: 48;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
    }
    .mobile-menu.open  { transform: translateX(0);     opacity: 1; pointer-events: all; }
    .mobile-menu.closed{ transform: translateX(100%);  opacity: 0; pointer-events: none; }

    /* FEATURE: Decorative gold grid inside mobile menu for depth */
    .mobile-menu::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(212,175,105,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(212,175,105,0.04) 1px, transparent 1px);
      background-size: 50px 50px;
      mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
      pointer-events: none;
    }

    /* FEATURE: Ambient corner glow orbs inside mobile menu */
    .mobile-menu::after {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 320px; height: 320px;
      background: radial-gradient(circle, rgba(212,175,105,0.09), transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    /* FEATURE: Mobile link — each item slides up on open with staggered delay */
    .mobile-link {
      position: relative;
      z-index: 1;
      font-family: 'Cormorant Garamond', serif;
      font-size: 30px;
      font-weight: 600;
      color: rgba(245,240,232,0.8);
      letter-spacing: 1px;
      text-decoration: none;
      transition: color 0.25s ease, transform 0.25s ease;
      opacity: 0;
      transform: translateY(22px);
    }
    .mobile-menu.open .mobile-link {
      opacity: 1;
      transform: translateY(0);
    }
    /* Stagger each link */
    .mobile-menu.open .mobile-link:nth-child(2)  { transition-delay: 0.07s; }
    .mobile-menu.open .mobile-link:nth-child(3)  { transition-delay: 0.12s; }
    .mobile-menu.open .mobile-link:nth-child(4)  { transition-delay: 0.17s; }
    .mobile-menu.open .mobile-link:nth-child(5)  { transition-delay: 0.22s; }
    .mobile-menu.open .mobile-link:nth-child(6)  { transition-delay: 0.27s; }
    .mobile-link:hover { color: var(--gold); transform: translateX(6px); }

    /* FEATURE: Gold divider line between mobile links */
    .mobile-divider {
      width: 40px;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(212,175,105,0.3), transparent);
      margin: 4px 0;
      position: relative;
      z-index: 1;
    }

    /* FEATURE: Mobile close button with rotation animation */
    .mobile-close-btn {
      position: absolute;
      top: 20px; right: 20px;
      background: rgba(212,175,105,0.1);
      border: 1px solid rgba(212,175,105,0.25);
      border-radius: 50%;
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all 0.25s ease;
      z-index: 2;
    }
    .mobile-close-btn:hover {
      background: rgba(212,175,105,0.2);
      box-shadow: 0 0 15px rgba(212,175,105,0.3);
      transform: rotate(90deg);
    }

    /* FEATURE: Mobile bottom action buttons fade in last */
    .mobile-actions {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin-top: 20px;
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.4s ease 0.35s, transform 0.4s ease 0.35s;
    }
    .mobile-menu.open .mobile-actions { opacity: 1; transform: translateY(0); }

    /* FEATURE: Hamburger icon with hover glow */
    .nav-hamburger {
      cursor: pointer;
      transition: filter 0.3s ease;
      height: 18px;
    }
    .nav-hamburger:hover {
      filter: drop-shadow(0 0 4px rgba(212,175,105,0.6));
    }

    /* FEATURE: Navbar entrance animation — slides down on first load */
    @keyframes nav-drop-in {
      from { transform: translateY(-100%); opacity: 0; }
      to   { transform: translateY(0);     opacity: 1; }
    }
    .navbar { animation: nav-drop-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) both; }
  `}</style>
);

/* ─────────────────────────────────────────────
   FEATURE: BookIcon — unchanged from original,
   used inside the Clerk UserButton menu item.
───────────────────────────────────────────── */
const BookIcon = () => (
  <svg className="w-4 h-4 text-gray-700" aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
      strokeWidth="2"
      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"/>
  </svg>
);

const Navbar = () => {
  const navLinks = [
    { name: "Home",             path: "/" },
    { name: "Hotels",           path: "/rooms" },
    { name: "Experience",       path: "/" },
    { name: "About",            path: "/" },
    { name: "AI Travel Planner",path: "/tripplanner" },
  ];

  const [isScrolled,  setIsScrolled]  = useState(false);
  const [isMenuOpen,  setIsMenuOpen]  = useState(false);

  /* FEATURE: Scroll-progress percentage stored in state,
     drives the thin gold bar at the very top of the viewport */
  const [scrollPct, setScrollPct] = useState(0);

  const { openSignIn } = useClerk();
  const { user }       = useUser();
  const navigate       = useNavigate();
  const location       = useLocation();

  /* ── Original scroll + route logic (unchanged) ── */
  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      /* FEATURE: Calculate scroll progress 0–100 for the progress bar */
      const docH   = document.documentElement.scrollHeight - window.innerHeight;
      const pct    = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      setScrollPct(pct);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  /* FEATURE: Lock body scroll while mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  /* FEATURE: Helper — returns true when the given path matches the current route,
     used to highlight the active nav link with a gold dot indicator */
  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* Inject all navbar CSS */}
      <NavStyles />

      {/* FEATURE: Scroll progress bar — gold gradient line at the top of the page */}
      <div className="nav-progress-bar" style={{ width: `${scrollPct}%` }} />

      {/* ── Main Navbar ── */}
      <nav className={`navbar fixed top-0 left-0 w-full flex items-center justify-between
        px-4 md:px-16 lg:px-24 xl:px-32 z-50
        ${isScrolled ? "navbar-scrolled py-3 md:py-4" : "navbar-transparent py-4 md:py-6"}`}>

        {/* FEATURE: Logo with drop-shadow glow on hover */}
        <Link to="/">
          <img
            src={assets.logo}
            alt="logo"
            className={`nav-logo h-9 ${isScrolled ? "invert opacity-80" : ""}`}
          />
        </Link>

        {/* ── Desktop Navigation Links ── */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.path}
              /* FEATURE: Active route detection — adds gold dot below active link */
              className={`nav-link ${isScrolled ? "text-gray-800" : "text-white"}
                ${isActive(link.path) ? "nav-link-active" : ""}`}
            >
              {link.name}
            </a>
          ))}

          {/* FEATURE: Dashboard button — gold border pill with fill-on-hover animation */}
          <button className="nav-dashboard-btn" onClick={() => navigate("/owner")}>
            <span>Dashboard</span>
          </button>
        </div>

        {/* ── Desktop Right: Search + Auth ── */}
        <div className="hidden md:flex items-center gap-4">

          {/* FEATURE: Search icon with gold glow + scale on hover */}
          <img
            src={assets.searchIcon}
            alt="search"
            className={`nav-search-icon ${isScrolled ? "invert" : ""}`}
          />

          {user ? (
            /* FEATURE: Clerk UserButton with "My Bookings" menu item (unchanged logic) */
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  labelIcon={<BookIcon />}
                  onClick={() => navigate("/my-bookings")}
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            /* FEATURE: Login button — two visual modes depending on scroll state,
               dark gradient when transparent, gold gradient when scrolled */
            <button
              onClick={openSignIn}
              className={`nav-login-btn ${isScrolled ? "dark" : "light"}`}
            >
              Login
            </button>
          )}
        </div>

        {/* ── Mobile: UserButton + Hamburger ── */}
        <div className="flex items-center gap-3 md:hidden">
          {user && (
            /* FEATURE: Mobile Clerk UserButton with "My Bookings" (unchanged logic) */
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  labelIcon={<BookIcon />}
                  onClick={() => navigate("/my-bookings")}
                />
              </UserButton.MenuItems>
            </UserButton>
          )}

          {/* FEATURE: Hamburger icon with gold glow on hover */}
          <img
            onClick={() => setIsMenuOpen(true)}
            src={assets.menuIcon}
            alt="open menu"
            className={`nav-hamburger ${isScrolled ? "invert" : ""}`}
          />
        </div>
      </nav>

      {/* ────────────────────────────────────────
          FEATURE: Mobile full-screen menu
          • Slides in from the right (translateX)
          • Dark luxury background with gold grid
          • Links reveal with staggered translateY animation
          • Body scroll locked while open
      ──────────────────────────────────────── */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : "closed"}`}>

        {/* FEATURE: Close button with 90° rotation on hover */}
        <button className="mobile-close-btn" onClick={() => setIsMenuOpen(false)}>
          <img src={assets.closeIcon} alt="close menu" style={{ height: 16, filter: "invert(1)" }} />
        </button>

        {/* FEATURE: Brand name inside mobile menu for identity context */}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 13,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "rgba(212,175,105,0.5)",
          marginBottom: 12,
          position: "relative",
          zIndex: 1,
        }}>
          Menu
        </p>

        {/* FEATURE: Nav links — each one is a large serif link with gold hover + slide-right */}
        {navLinks.map((link, i) => (
          <React.Fragment key={i}>
            <a
              href={link.path}
              className="mobile-link"
              onClick={() => setIsMenuOpen(false)}
              style={{ transitionDelay: `${0.06 + i * 0.055}s` }}
            >
              {link.name}
            </a>
            {/* FEATURE: Gold divider between each link */}
            {i < navLinks.length - 1 && <div className="mobile-divider" />}
          </React.Fragment>
        ))}

        {/* FEATURE: Action buttons fade in last after links settle */}
        <div className="mobile-actions">
          {user && (
            <button
              className="nav-dashboard-btn"
              onClick={() => { navigate("/owner"); setIsMenuOpen(false); }}
            >
              <span>Dashboard</span>
            </button>
          )}
          {!user && (
            <button
              onClick={() => { openSignIn(); setIsMenuOpen(false); }}
              className="nav-login-btn light"
              style={{ minWidth: 160 }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;