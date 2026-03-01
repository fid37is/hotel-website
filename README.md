# Hotel Website — White-Label Booking Frontend

React + Vite public-facing website for the HMS backend.

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in your API URL and payment key
npm run dev                   # runs on http://localhost:3000
```

## White-Label Setup

**To deploy for a new hotel, only one file changes:**

```
src/config/hotel.config.js
```

Update the name, branding, contact details, social links, and feature toggles.
Everything else adapts automatically.

## Project Structure

```
src/
├── config/
│   └── hotel.config.js       ← WHITE-LABEL CONFIG — change this per hotel
├── services/
│   └── api.js                ← All HMS API calls
├── hooks/
│   └── useBooking.jsx        ← Global booking state (React Context)
├── components/
│   ├── layout/
│   │   ├── Layout.jsx        ← Nav + Footer wrapper
│   │   └── Layout.css        ← Global design system + utility classes
│   ├── booking/
│   │   └── AvailabilitySearch.jsx
│   └── ui/
│       └── RoomCard.jsx
└── pages/
    ├── HomePage.jsx           ← Hero, featured rooms, amenities, CTA
    ├── RoomsPage.jsx          ← Availability results + all room types
    ├── RoomDetailPage.jsx     ← Single room detail + rates
    ├── BookingPage.jsx        ← 3-step booking flow
    ├── ConfirmationPage.jsx   ← Post-booking confirmation
    ├── ManageBookingPage.jsx  ← Guest booking management + cancel
    └── NotFoundPage.jsx
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | HMS public API base (e.g. `https://api.yourhotel.com/api/v1/public`) |
| `VITE_PAYMENT_PUBLIC_KEY` | Paystack or Flutterwave public key |

## Build for Production

```bash
npm run build     # outputs to /dist
npm run preview   # preview the production build locally
```

Deploy the `/dist` folder to any static host: Netlify, Vercel, Cloudflare Pages, or your own Nginx/Apache server.

## Connecting to the HMS Backend

The website calls these endpoints on your HMS:

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/rooms/types` | None | Display room types |
| GET | `/rooms/types/:id` | None | Room detail page |
| GET | `/rooms/types/:id/rates` | None | Room pricing |
| GET | `/rooms/availability` | None | Availability search |
| POST | `/reservations` | None | Create booking |
| GET | `/reservations/:id` | Guest JWT | View booking |
| PATCH | `/reservations/:id/cancel` | Guest JWT | Cancel booking |
| GET | `/folio/reservation/:id` | Guest JWT | View bill |
| POST | `/folio/:id/payments` | Guest JWT | Pay bill |
