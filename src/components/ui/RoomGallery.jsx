// src/components/ui/RoomGallery.jsx
import { useState, useEffect, useCallback } from 'react';
import './RoomGallery.css';

export default function RoomGallery({ images = [], videoUrl = null, roomName = '' }) {
  const [activeIndex,   setActiveIndex]   = useState(0);
  const [lightboxOpen,  setLightboxOpen]  = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoPlaying,  setVideoPlaying]  = useState(false);

  const hasImages = images.length > 0;
  const hasVideo  = !!videoUrl;
  const hasMedia  = hasImages || hasVideo;

  // All media items: video first (if present), then images
  const mediaItems = [
    ...(hasVideo  ? [{ type: 'video', src: videoUrl }] : []),
    ...(hasImages ? images.map(src => ({ type: 'image', src })) : []),
  ];

  const total = mediaItems.length;

  const prev = useCallback(() => {
    setActiveIndex(i => (i - 1 + total) % total);
    setVideoPlaying(false);
  }, [total]);

  const next = useCallback(() => {
    setActiveIndex(i => (i + 1) % total);
    setVideoPlaying(false);
  }, [total]);

  const lightboxPrev = useCallback(() => {
    setLightboxIndex(i => (i - 1 + total) % total);
  }, [total]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex(i => (i + 1) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
      if (e.key === 'Escape')     setLightboxOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, lightboxPrev, lightboxNext]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // ── No media placeholder ─────────────────────────────────────────────────
  if (!hasMedia) {
    return (
      <div className="room-gallery room-gallery--empty">
        <div className="room-gallery__placeholder">
          <div className="room-gallery__placeholder-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
          <p className="room-gallery__placeholder-title">{roomName}</p>
          <p className="room-gallery__placeholder-sub">Photos coming soon</p>
        </div>
      </div>
    );
  }

  const activeItem = mediaItems[activeIndex];

  // ── Single image (no thumbnails needed) ─────────────────────────────────
  if (total === 1 && activeItem.type === 'image') {
    return (
      <div className="room-gallery room-gallery--single">
        <div className="room-gallery__main" onClick={() => openLightbox(0)}>
          <img src={activeItem.src} alt={roomName} />
          <div className="room-gallery__zoom-hint">Click to enlarge</div>
        </div>
        {lightboxOpen && (
          <Lightbox
            items={mediaItems}
            index={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={lightboxPrev}
            onNext={lightboxNext}
          />
        )}
      </div>
    );
  }

  // ── Full gallery ─────────────────────────────────────────────────────────
  return (
    <div className="room-gallery">

      {/* Main viewer */}
      <div className="room-gallery__main">
        {activeItem.type === 'video' ? (
          <div className="room-gallery__video-wrap">
            {videoPlaying ? (
              <video
                src={activeItem.src}
                controls
                autoPlay
                className="room-gallery__video"
              />
            ) : (
              <>
                <div className="room-gallery__video-poster">
                  <span className="room-gallery__video-label">Room Video</span>
                </div>
                <button
                  className="room-gallery__play-btn"
                  onClick={() => setVideoPlaying(true)}
                  aria-label="Play video"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        ) : (
          <img
            src={activeItem.src}
            alt={`${roomName} — photo ${activeIndex + 1}`}
            className="room-gallery__main-img"
            onClick={() => openLightbox(activeIndex)}
          />
        )}

        {/* Nav arrows */}
        {total > 1 && (
          <>
            <button className="room-gallery__arrow room-gallery__arrow--prev" onClick={prev} aria-label="Previous">
              ‹
            </button>
            <button className="room-gallery__arrow room-gallery__arrow--next" onClick={next} aria-label="Next">
              ›
            </button>
          </>
        )}

        {/* Counter */}
        <div className="room-gallery__counter">
          {activeIndex + 1} / {total}
        </div>

        {/* Expand button (images only) */}
        {activeItem.type === 'image' && (
          <button
            className="room-gallery__expand"
            onClick={() => openLightbox(activeIndex)}
            aria-label="View fullscreen"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="room-gallery__thumbs">
          {mediaItems.map((item, i) => (
            <button
              key={i}
              className={`room-gallery__thumb ${i === activeIndex ? 'room-gallery__thumb--active' : ''}`}
              onClick={() => { setActiveIndex(i); setVideoPlaying(false); }}
              aria-label={`View ${item.type} ${i + 1}`}
            >
              {item.type === 'video' ? (
                <div className="room-gallery__thumb-video">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              ) : (
                <img src={item.src} alt={`Thumbnail ${i + 1}`} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          items={mediaItems}
          index={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={lightboxPrev}
          onNext={lightboxNext}
        />
      )}
    </div>
  );
}

// ── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const item  = items[index];
  const total = items.length;

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox__inner" onClick={e => e.stopPropagation()}>

        <button className="lightbox__close" onClick={onClose} aria-label="Close">✕</button>

        <div className="lightbox__media">
          {item.type === 'video' ? (
            <video src={item.src} controls autoPlay className="lightbox__video" />
          ) : (
            <img src={item.src} alt={`Photo ${index + 1}`} className="lightbox__img" />
          )}
        </div>

        {total > 1 && (
          <>
            <button className="lightbox__arrow lightbox__arrow--prev" onClick={onPrev}>‹</button>
            <button className="lightbox__arrow lightbox__arrow--next" onClick={onNext}>›</button>
            <div className="lightbox__counter">{index + 1} / {total}</div>
          </>
        )}
      </div>
    </div>
  );
}