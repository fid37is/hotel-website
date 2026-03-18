// src/pages/HomePage.jsx
//
// Renders the home page by composing standalone section components in the
// order defined by hotelConfig.layout.section_order.
// Each section reads its own copy from hotelConfig.content.<section_id>.

import { useState }          from 'react';
import { useNavigate }       from 'react-router-dom';
import { useHotelConfig }    from '../hooks/useHotelConfig.jsx';
import { DEFAULT_LAYOUT }    from '../config/theme.js';
import useSEO                from '../hooks/useSEO.js';

import HeroSection      from '../components/sections/HeroSection.jsx';
import AmenitiesSection from '../components/sections/AmenitiesSection.jsx';
import RoomsSection     from '../components/sections/RoomsSection.jsx';
import WhyStaySection   from '../components/sections/WhyStaySection.jsx';
import StorySection     from '../components/sections/StorySection.jsx';
import OffersSection    from '../components/sections/OffersSection.jsx';
import EventsSection    from '../components/sections/EventsSection.jsx';
import ReviewsSection   from '../components/sections/ReviewsSection.jsx';
import CtaSection       from '../components/sections/CtaSection.jsx';

export default function HomePage() {
  const hotelConfig = useHotelConfig();
  const navigate    = useNavigate();
  useSEO();

  const [checkin,  setCheckin]  = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests,   setGuests]   = useState('2');

  const goToBook = () => {
    const p = new URLSearchParams();
    if (checkin)  p.set('checkIn',  checkin);
    if (checkout) p.set('checkOut', checkout);
    navigate('/book' + (p.toString() ? '?' + p.toString() : ''));
  };

  const layout        = hotelConfig.layout || DEFAULT_LAYOUT;
  const sectionOrder  = layout.section_order || DEFAULT_LAYOUT.section_order;
  const hidden        = layout.section_hidden || [];
  const visible       = id => !hidden.includes(id);

  const SECTIONS = {
    hero:        () => (
      <div key="hero">
        <HeroSection
          checkin={checkin}   setCheckin={setCheckin}
          checkout={checkout} setCheckout={setCheckout}
          guests={guests}     setGuests={setGuests}
          onSearch={goToBook}
        />
        <AmenitiesSection />
      </div>
    ),
    booking_bar: () => null,
    rooms:       () => <RoomsSection   key="rooms"    />,
    why_stay:    () => <WhyStaySection key="why_stay" />,
    story:       () => <StorySection   key="story"    />,
    offers:      () => <OffersSection  key="offers"   />,
    events:      () => <EventsSection  key="events"   />,
    reviews:     () => <ReviewsSection key="reviews"  />,
    cta:         () => <CtaSection      key="cta"       />,
    custom_1:    () => <CustomSection1   key="custom_1"  />,
    custom_2:    () => <CustomSection2   key="custom_2"  />,
  };

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.45} 50%{opacity:0.7} }
        *::-webkit-scrollbar { display:none }

        @media(max-width:900px){
          .rooms-grid    { grid-template-columns:repeat(2,1fr) !important; }
          .services-grid { grid-template-columns:repeat(2,1fr) !important; }
          .offers-grid   { grid-template-columns:repeat(2,1fr) !important; }
          .pillars-grid  { grid-template-columns:1fr !important; gap:2rem !important; }
          .venues-grid   { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:768px){
          .story-grid    { grid-template-columns:1fr !important; }
          .story-img     { min-height:60vw !important; order:-1; }
          .rooms-grid    { grid-template-columns:1fr !important; }
          .services-grid { grid-template-columns:1fr !important; }
          .offers-grid   { grid-template-columns:1fr !important; }
          .reviews-grid  { grid-template-columns:1fr !important; }
          .cta-inner     { flex-direction:column !important; }
          .rooms-header  { flex-direction:column !important; align-items:flex-start !important; }
          .venues-grid   { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:480px){
          .venues-grid { grid-template-columns:1fr !important; }
        }
      `}</style>
      <div>
        {sectionOrder
          .filter(id => id === 'hero' || visible(id))
          .map(id => SECTIONS[id]?.())}
      </div>
    </>
  );
}