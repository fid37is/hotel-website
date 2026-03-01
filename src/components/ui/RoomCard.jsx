// src/components/ui/RoomCard.jsx
import { Link } from 'react-router-dom';
import hotelConfig from '../../config/hotel.config.js';
import { fmt }     from '../../utils/currency.js';
import './RoomCard.css';


export default function RoomCard({ room, showBookBtn = false, onBook }) {
  const baseRate = room.rate_plans?.[0]?.rate || room.base_rate;

  return (
    <article className="room-card">
      <Link to={`/rooms/${room.room_type_id || room.type_id || room.id}`} className="room-card__image-wrap">
        {room.images?.[0] ? (
          <img
            src={room.images[0]}
            alt={room.name}
            className="room-card__image"
            loading="lazy"
          />
        ) : (
          <div className="room-card__image-placeholder">
            <span>{room.name?.[0]}</span>
          </div>
        )}
        {room.category && (
          <span className="room-card__badge">{room.category}</span>
        )}
      </Link>

      <div className="room-card__body">
        <div className="room-card__top">
          <h3 className="room-card__name">{room.name}</h3>
          {baseRate && (
            <div className="room-card__price">
              <span className="room-card__price-amount">{fmt(baseRate)}</span>
              <span className="room-card__price-unit">/ night</span>
            </div>
          )}
        </div>

        {room.description && (
          <p className="room-card__desc">{room.description}</p>
        )}

        {room.amenities?.length > 0 && (
          <ul className="room-card__amenities">
            {room.amenities.slice(0, 4).map((a, i) => (
              <li key={i} className="room-card__amenity">{a}</li>
            ))}
          </ul>
        )}

        <div className="room-card__footer">
          <Link to={`/rooms/${room.room_type_id || room.type_id || room.id}`} className="btn btn--outline">
            View Details
          </Link>
          {showBookBtn && (
            <button
              className="btn btn--primary"
              onClick={() => onBook?.(room)}
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </article>
  );
}