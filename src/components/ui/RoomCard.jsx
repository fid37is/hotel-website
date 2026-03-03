// src/components/ui/RoomCard.jsx — Pure Tailwind
import { Link } from 'react-router-dom';
import { fmt }  from '../../utils/currency.js';

export default function RoomCard({ room, showBookBtn = false, onBook }) {
  const baseRate = room.rate_plans?.[0]?.rate || room.base_rate;
  const roomId   = room.room_type_id || room.type_id || room.id;

  return (
    <article className="bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <Link to={`/rooms/${roomId}`} className="block relative overflow-hidden aspect-[4/3]">
        {room.images?.[0] ? (
          <img src={room.images[0]} alt={room.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-border flex items-center justify-center">
            <span className="font-display text-6xl text-muted">{room.name?.[0]}</span>
          </div>
        )}
        {room.category && (
          <span className="absolute top-4 left-4 bg-primary text-white text-[10px] tracking-widest uppercase px-3 py-1.5">
            {room.category}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-medium leading-snug">{room.name}</h3>
          {baseRate && (
            <div className="text-right shrink-0">
              <span className="block text-xl font-semibold text-primary">{fmt(baseRate)}</span>
              <span className="text-xs text-muted">/ night</span>
            </div>
          )}
        </div>

        {room.description && (
          <p className="text-sm text-muted leading-relaxed line-clamp-3">{room.description}</p>
        )}

        {room.amenities?.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 4).map((a, i) => (
              <li key={i} className="text-[11px] tracking-wide text-muted bg-bg px-3 py-1 rounded-full border border-border">
                {a}
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-3 mt-auto pt-2">
          <Link to={`/rooms/${roomId}`} className="btn btn--outline flex-1 justify-center text-xs tracking-wide">
            View Details
          </Link>
          {showBookBtn && (
            <button className="btn btn--primary flex-1 justify-center text-xs tracking-wide" onClick={() => onBook?.(room)}>
              Book Now
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
