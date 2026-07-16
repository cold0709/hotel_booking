import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const HotelCard = ({ room, index }) => {
  const cardRef = useRef(null)
  const [transform, setTransform] = useState('')
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotY = ((x - cx) / cx) * 12
    const rotX = -((y - cy) / cy) * 10
    setTransform(`perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`)
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 })
    setImgOffset({ x: (rotY / 12) * 8, y: -(rotX / 10) * 6 })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)')
    setGlowPos({ x: 50, y: 50 })
    setImgOffset({ x: 0, y: 0 })
    setHovered(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .hotel-card-wrapper {
          perspective: 1000px;
        }

        .hotel-card {
          transition: transform 0.12s ease-out, box-shadow 0.3s ease;
          transform-style: preserve-3d;
          will-change: transform;
          background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0e17 100%);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.4),
            0 8px 20px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.05);
          text-decoration: none;
          display: block;
          max-width: 320px;
          width: 100%;
          cursor: pointer;
        }

        .hotel-card:hover {
          box-shadow:
            0 10px 30px rgba(0,0,0,0.6),
            0 30px 60px rgba(0,0,0,0.4),
            0 0 0 1px rgba(212,175,105,0.3),
            0 0 40px rgba(212,175,105,0.08);
        }

        .card-glow {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          pointer-events: none;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .hotel-card:hover .card-glow {
          opacity: 1;
        }

        .img-wrapper {
          position: relative;
          width: 100%;
          height: 210px;
          overflow: hidden;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.15s ease-out;
          transform-origin: center center;
        }

        .img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.05) 0%,
            rgba(0,0,0,0) 40%,
            rgba(15,14,23,0.85) 100%
          );
          z-index: 1;
        }

        .bestseller-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 5;
          background: linear-gradient(135deg, #d4af69 0%, #f0d088 50%, #c9982a 100%);
          color: #1a1200;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 30px;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 2px 12px rgba(212,175,105,0.5);
          transform: translateZ(20px);
        }

        .price-floating {
          position: absolute;
          bottom: 16px;
          right: 14px;
          z-index: 5;
          background: rgba(212,175,105,0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212,175,105,0.4);
          border-radius: 12px;
          padding: 6px 12px;
          transform: translateZ(25px);
          transition: transform 0.2s ease;
        }

        .hotel-card:hover .price-floating {
          transform: translateZ(35px);
        }

        .price-floating span {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 700;
          color: #f0d088;
          line-height: 1;
          display: block;
        }

        .price-floating small {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          color: rgba(240,208,136,0.7);
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .card-body {
          padding: 18px 18px 20px;
          transform-style: preserve-3d;
        }

        .hotel-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 700;
          color: #f5f0e8;
          letter-spacing: 0.2px;
          line-height: 1.2;
          margin: 0;
          transform: translateZ(15px);
          display: block;
          transition: color 0.3s ease;
        }

        .hotel-card:hover .hotel-name {
          color: #f0d088;
        }

        .rating-chip {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 4px 10px;
          transform: translateZ(15px);
        }

        .rating-chip span {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #f0d088;
        }

        .rating-chip img {
          width: 13px;
          height: 13px;
          filter: drop-shadow(0 0 4px rgba(240,208,136,0.8));
        }

        .location-row {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 8px;
          transform: translateZ(10px);
        }

        .location-row img {
          width: 13px;
          height: 13px;
          opacity: 0.5;
          filter: invert(1);
          flex-shrink: 0;
        }

        .location-row span {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.3px;
        }

        .card-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212,175,105,0.25), transparent);
          margin: 14px 0;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          transform: translateZ(20px);
        }

        .price-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.4px;
        }

        .price-text strong {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 700;
          color: #f5f0e8;
          display: block;
          line-height: 1;
          margin-bottom: 1px;
        }

        .book-btn {
          position: relative;
          padding: 10px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: #0f0e17;
          background: linear-gradient(135deg, #d4af69, #f0d088, #c9982a);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.25s ease;
          box-shadow: 0 4px 15px rgba(212,175,105,0.35);
        }

        .book-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.25), transparent 60%);
          border-radius: inherit;
        }

        .book-btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease, opacity 0.4s ease;
          opacity: 0;
        }

        .book-btn:hover::after {
          width: 200px;
          height: 200px;
          opacity: 0;
        }

        .book-btn:hover {
          box-shadow: 0 6px 25px rgba(212,175,105,0.55);
          transform: translateY(-1px);
        }

        .corner-accent {
          position: absolute;
          top: 0;
          right: 0;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle at top right, rgba(212,175,105,0.12), transparent 70%);
          pointer-events: none;
          z-index: 2;
        }

        .shimmer-line {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.04) 50%,
            transparent 100%
          );
          transform: skewX(-15deg);
          animation: shimmer 3.5s infinite ease-in-out;
          pointer-events: none;
          z-index: 3;
        }

        @keyframes shimmer {
          0% { left: -100%; opacity: 0; }
          10% { opacity: 1; }
          50% { left: 130%; opacity: 1; }
          60% { opacity: 0; }
          100% { left: 130%; opacity: 0; }
        }

        .top-edge-glow {
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212,175,105,0.5), transparent);
          z-index: 4;
        }
      `}</style>

      <div className="hotel-card-wrapper">
        <Link
          to={`/rooms/${room._id}`}
          onClick={() => scrollTo(0, 0)}
          key={room._id}
          className="hotel-card"
          ref={cardRef}
          style={{ transform }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setHovered(true)}
        >
          {/* Shimmer sweep */}
          <div className="shimmer-line" />

          {/* Top edge glow */}
          <div className="top-edge-glow" />

          {/* Corner accent */}
          <div className="corner-accent" />

          {/* Radial glow that follows cursor */}
          <div
            className="card-glow"
            style={{
              background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(212,175,105,0.12) 0%, transparent 65%)`,
            }}
          />

          {/* Image Section */}
          <div className="img-wrapper">
            <img
              src={room.images[0]}
              alt={room.hotel?.name || 'Hotel'}
              className="card-img"
              style={{
                transform: `scale(1.08) translate(${imgOffset.x}px, ${imgOffset.y}px)`,
              }}
            />
            <div className="img-overlay" />

            {/* Bestseller Badge */}
            {index % 2 === 0 && (
              <div className="bestseller-badge">⭐ Bestseller</div>
            )}

            {/* Floating Price on Image */}
            <div className="price-floating">
              <span>${room.pricePerNight}</span>
              <small>per night</small>
            </div>
          </div>

          {/* Card Body */}
          <div className="card-body">
            {/* Name + Rating Row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              <p className="hotel-name">{room.hotel?.name}</p>
              <div className="rating-chip" style={{ flexShrink: 0 }}>
                <img src={assets.starIconFilled} alt="star" />
                <span>4.5</span>
              </div>
            </div>

            {/* Location */}
            <div className="location-row">
              <img src={assets.locationIcon} alt="location" />
              <span>{room.hotel?.address}</span>
            </div>

            {/* Divider */}
            <div className="card-divider" />

            {/* Footer */}
            <div className="card-footer">
              <div className="price-text">
                <strong>${room.pricePerNight}</strong>
                /night
              </div>
              <button className="book-btn">Book Now</button>
            </div>
          </div>
        </Link>
      </div>
    </>
  )
}

export default HotelCard;