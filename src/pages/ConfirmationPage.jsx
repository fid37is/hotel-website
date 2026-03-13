// hotel-website/src/pages/ConfirmationPage.jsx — Pure Tailwind
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking }     from '../hooks/useBooking.jsx';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';
import { fmt }            from '../utils/currency.js';

const nights = (ci, co) => (!ci || !co) ? 0
  : Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000));

export default function ConfirmationPage() {
  const navigate    = useNavigate();
  const { state, dispatch } = useBooking();
  const hotelConfig = useHotelConfig();
  const { confirmation, selectedRoom, selectedRate, search, guestDetails } = state;

  useEffect(() => {
    if (!confirmation?.reservation) navigate('/book');
  }, [confirmation]);

  useEffect(() => {
    document.title = `Booking Confirmed | ${hotelConfig.shortName}`;
  }, [hotelConfig.shortName]);

  if (!confirmation?.reservation) return null;

  const res           = confirmation.reservation;
  const paymentMethod = confirmation.paymentMethod || 'on_arrival';
  const numNights     = nights(res.check_in_date, res.check_out_date);
  const ratePerNight  = selectedRate?.base_rate ?? selectedRoom?.base_rate ?? 0;
  const totalAmount   = ratePerNight * numNights;
  const isBankTransfer = paymentMethod === 'bank_transfer';
  const isPaystack     = paymentMethod === 'paystack';

  const handleDone = () => {
    dispatch({ type: 'RESET' });
    navigate('/');
  };

  return (
    <div className="bg-bg min-h-screen pt-nav pb-16">
      <div className="container max-w-2xl">

        {/* Status banner */}
        <div className={`rounded-xl p-6 mb-8 text-center ${isBankTransfer ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl
            ${isBankTransfer ? 'bg-amber-100' : 'bg-green-100'}`}>
            {isBankTransfer ? '🏦' : '✓'}
          </div>
          <h1 className="font-display text-3xl font-medium mb-2">
            {isBankTransfer ? 'Booking Received' : 'Booking Confirmed!'}
          </h1>
          <p className="text-muted text-sm">
            {isBankTransfer
              ? 'Your reservation is held — please complete your bank transfer to confirm it.'
              : isPaystack
              ? 'Payment received. Your reservation is fully confirmed.'
              : 'We look forward to welcoming you. Payment is due at check-in.'}
          </p>
          {res.id && (
            <p className="mt-3 text-xs text-muted">
              Booking reference: <strong className="font-mono text-primary">{res.id.slice(0, 8).toUpperCase()}</strong>
            </p>
          )}
        </div>

        {/* Bank Transfer instructions */}
        {isBankTransfer && hotelConfig.payment?.bankName && (
          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <h2 className="font-display text-lg font-medium mb-4">Complete Your Payment</h2>
            <p className="text-sm text-muted mb-4">
              Please transfer the amount below to our account within <strong>24 hours</strong> to
              secure your reservation. Send your proof of payment to our email.
            </p>
            <div className="bg-bg rounded-lg p-4 flex flex-col gap-3 mb-4">
              {[
                ['Bank',           hotelConfig.payment.bankName],
                ['Account Number', hotelConfig.payment.bankAccountNumber],
                ['Account Name',   hotelConfig.payment.bankAccountName],
                ['Amount',         fmt(totalAmount)],
                ['Reference',      `${guestDetails.lastName || ''} ${res.id?.slice(0,8).toUpperCase() || ''}`.trim()],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted">{label}</span>
                  <strong className={`text-right font-mono ${label === 'Amount' ? 'text-secondary' : 'text-primary'}`}>
                    {value}
                  </strong>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted">
              After transferring, send proof to{' '}
              <a href={`mailto:${hotelConfig.contact?.email}?subject=Payment proof - ${res.id?.slice(0,8).toUpperCase()}`}
                className="text-secondary hover:underline">
                {hotelConfig.contact?.email}
              </a>
              {' '}or WhatsApp{' '}
              <a href={`https://wa.me/${hotelConfig.contact?.whatsapp?.replace(/\D/g,'')}`}
                className="text-secondary hover:underline" target="_blank" rel="noreferrer">
                {hotelConfig.contact?.whatsapp}
              </a>.
            </p>
          </div>
        )}

        {/* Booking summary */}
        <div className="bg-surface border border-border rounded-lg p-6 mb-6">
          <h2 className="font-display text-lg font-medium mb-4">Your Booking</h2>
          <div className="flex flex-col gap-3">
            {[
              ['Room Type',  selectedRoom?.name || res.room_type_id],
              ['Rate Plan',  selectedRate?.name || 'Standard'],
              ['Check-in',   `${res.check_in_date}${hotelConfig.contact?.checkIn ? ` from ${hotelConfig.contact.checkIn}` : ''}`],
              ['Check-out',  `${res.check_out_date}${hotelConfig.contact?.checkOut ? ` by ${hotelConfig.contact.checkOut}` : ''}`],
              ['Duration',   `${numNights} night${numNights !== 1 ? 's' : ''}`],
              ['Guests',     search.guests || 1],
              ['Payment',    paymentMethod === 'on_arrival' ? 'Pay on Arrival'
                           : paymentMethod === 'bank_transfer' ? 'Bank Transfer'
                           : 'Paid by Card'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm border-b border-border pb-2 last:border-0 last:pb-0">
                <span className="text-muted">{label}</span>
                <strong className="text-primary text-right">{value}</strong>
              </div>
            ))}
            {totalAmount > 0 && (
              <div className="flex justify-between text-sm pt-1">
                <span className="font-medium">Estimated Total</span>
                <strong className="text-secondary">{fmt(totalAmount)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Guest details */}
        <div className="bg-surface border border-border rounded-lg p-6 mb-8">
          <h2 className="font-display text-lg font-medium mb-4">Guest Details</h2>
          <div className="flex flex-col gap-2 text-sm">
            {[
              ['Name',  `${guestDetails.firstName} ${guestDetails.lastName}`],
              ['Email', guestDetails.email],
              ['Phone', guestDetails.phone],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted">{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="btn btn--outline" onClick={() => window.print()}>
            Print / Save PDF
          </button>
          {hotelConfig.contact?.whatsapp && (
            <a
              href={`https://wa.me/${hotelConfig.contact.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(
                `Hi, I just booked. Reference: ${res.id?.slice(0,8).toUpperCase()}. Check-in: ${res.check_in_date}.`
              )}`}
              target="_blank" rel="noreferrer"
              className="btn btn--outline text-center">
              WhatsApp Us
            </a>
          )}
          <Link to="/manage-booking" className="btn btn--outline text-center">
            Manage Booking
          </Link>
          <button className="btn btn--primary" onClick={handleDone}>
            Back to Home
          </button>
        </div>

        {/* Contact */}
        <p className="text-center text-xs text-muted mt-8">
          Questions? Call{' '}
          <a href={`tel:${hotelConfig.contact?.phone}`} className="text-secondary hover:underline">
            {hotelConfig.contact?.phone}
          </a>
          {' '}or email{' '}
          <a href={`mailto:${hotelConfig.contact?.email}`} className="text-secondary hover:underline">
            {hotelConfig.contact?.email}
          </a>
        </p>

      </div>
    </div>
  );
}