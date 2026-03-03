// src/components/ui/RoomGallery.jsx — Pure Tailwind
import { useState, useEffect, useCallback } from 'react';

export default function RoomGallery({ images = [], videoUrl = null, roomName = '' }) {
  const [activeIndex,   setActiveIndex]   = useState(0);
  const [lightboxOpen,  setLightboxOpen]  = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoPlaying,  setVideoPlaying]  = useState(false);

  const mediaItems = [
    ...(videoUrl ? [{ type: 'video', src: videoUrl }] : []),
    ...images.map(src => ({ type: 'image', src })),
  ];
  const total = mediaItems.length;

  const prev = useCallback(() => { setActiveIndex(i => (i - 1 + total) % total); setVideoPlaying(false); }, [total]);
  const next = useCallback(() => { setActiveIndex(i => (i + 1) % total); setVideoPlaying(false); }, [total]);
  const lbPrev = useCallback(() => setLightboxIndex(i => (i - 1 + total) % total), [total]);
  const lbNext = useCallback(() => setLightboxIndex(i => (i + 1) % total), [total]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const h = (e) => {
      if (e.key === 'ArrowLeft')  lbPrev();
      if (e.key === 'ArrowRight') lbNext();
      if (e.key === 'Escape')     setLightboxOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lightboxOpen, lbPrev, lbNext]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  if (!total) return (
    <div className="aspect-[16/9] rounded-lg bg-border flex flex-col items-center justify-center gap-3 text-muted">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="48" height="48">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
      </svg>
      <p className="font-display text-lg">{roomName}</p>
      <p className="text-sm">Photos coming soon</p>
    </div>
  );

  const active = mediaItems[activeIndex];

  if (total === 1 && active.type === 'image') return (
    <div className="relative aspect-[16/9] rounded-lg overflow-hidden cursor-zoom-in" onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
      <img src={active.src} alt={roomName} className="w-full h-full object-cover" />
      <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-3 py-1.5 rounded">Click to enlarge</div>
      {lightboxOpen && <Lightbox items={mediaItems} index={lightboxIndex} onClose={() => setLightboxOpen(false)} onPrev={lbPrev} onNext={lbNext} />}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Main */}
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-primary/10">
        {active.type === 'video' ? (
          videoPlaying ? (
            <video src={active.src} controls autoPlay className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/20">
              <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
                onClick={() => setVideoPlaying(true)} aria-label="Play video">
                <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M8 5v14l11-7z"/></svg>
              </button>
            </div>
          )
        ) : (
          <img src={active.src} alt={`${roomName} — ${activeIndex + 1}`}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => { setLightboxIndex(activeIndex); setLightboxOpen(true); }} />
        )}

        {total > 1 && (
          <>
            <button className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white text-2xl flex items-center justify-center hover:bg-black/60 transition-colors" onClick={prev} aria-label="Previous">‹</button>
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white text-2xl flex items-center justify-center hover:bg-black/60 transition-colors" onClick={next} aria-label="Next">›</button>
          </>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
          {activeIndex + 1} / {total}
        </div>

        {active.type === 'image' && (
          <button className="absolute top-3 right-3 w-9 h-9 bg-black/40 text-white rounded flex items-center justify-center hover:bg-black/60 transition-colors"
            onClick={() => { setLightboxIndex(activeIndex); setLightboxOpen(true); }} aria-label="Fullscreen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {mediaItems.map((item, i) => (
            <button key={i}
              className={`shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-all ${i === activeIndex ? 'border-secondary' : 'border-transparent opacity-60 hover:opacity-100'}`}
              onClick={() => { setActiveIndex(i); setVideoPlaying(false); }}
              aria-label={`View ${item.type} ${i + 1}`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>
                </div>
              ) : (
                <img src={item.src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && <Lightbox items={mediaItems} index={lightboxIndex} onClose={() => setLightboxOpen(false)} onPrev={lbPrev} onNext={lbNext} />}
    </div>
  );
}

function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const item  = items[index];
  const total = items.length;
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <div className="relative w-full max-w-5xl max-h-[90vh] px-12" onClick={e => e.stopPropagation()}>
        <button className="absolute -top-10 right-0 text-white/70 hover:text-white text-2xl" onClick={onClose} aria-label="Close">✕</button>
        {item.type === 'video' ? (
          <video src={item.src} controls autoPlay className="w-full max-h-[80vh] object-contain" />
        ) : (
          <img src={item.src} alt={`Photo ${index + 1}`} className="w-full max-h-[80vh] object-contain" />
        )}
        {total > 1 && (
          <>
            <button className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 text-white text-3xl flex items-center justify-center hover:text-secondary transition-colors" onClick={onPrev}>‹</button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 text-white text-3xl flex items-center justify-center hover:text-secondary transition-colors" onClick={onNext}>›</button>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm">{index + 1} / {total}</div>
          </>
        )}
      </div>
    </div>
  );
}
