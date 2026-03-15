// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HotelConfigProvider } from './hooks/useHotelConfig.jsx';
import { GuestAuthProvider }   from './hooks/useGuestAuth.jsx';
import { GuestNotificationsProvider } from './hooks/useGuestNotifications.jsx';
import { BookingProvider }     from './hooks/useBooking.jsx';
import Layout             from './components/layout/Layout.jsx';
import HomePage           from './pages/HomePage.jsx';
import RoomsPage          from './pages/RoomsPage.jsx';
import RoomDetailPage     from './pages/RoomDetailPage.jsx';
import BookingPage        from './pages/BookingPage.jsx';
import ConfirmationPage   from './pages/ConfirmationPage.jsx';
import AccountPage        from './pages/AccountPage.jsx';
import LoginPage          from './pages/LoginPage.jsx';
import RegisterPage       from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage  from './pages/ResetPasswordPage.jsx';
import NotFoundPage       from './pages/NotFoundPage.jsx';
import ChatPage            from './pages/ChatPage.jsx';
import ManageBookingPage  from './pages/ManageBookingPage.jsx';
import EventsPage         from './pages/EventsPage.jsx';
import DiningPage         from './pages/DiningPage.jsx';
import WellnessPage       from './pages/WellnessPage.jsx';
import ConciergePage      from './pages/ConciergePage.jsx';
import ExploreHotelPage   from './pages/ExploreHotelPage.jsx';
import OffersPage         from './pages/OffersPage.jsx';
import AboutPage          from './pages/AboutPage.jsx';
import ContactPage        from './pages/ContactPage.jsx';


// Bridge: reads token from GuestAuth and passes to GuestNotificationsProvider
import { useGuestAuth } from './hooks/useGuestAuth.jsx';
function GuestAuthNotificationsWrapper({ children }) {
  const { token } = useGuestAuth();
  return (
    <GuestNotificationsProvider guestToken={token}>
      {children}
    </GuestNotificationsProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <HotelConfigProvider>
        <GuestAuthProvider>
          <GuestAuthNotificationsWrapper>
          <BookingProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/"              index element={<HomePage />} />
                <Route path="/rooms"               element={<RoomsPage />} />
                <Route path="/rooms/:id"           element={<RoomDetailPage />} />
                <Route path="/book"                element={<BookingPage />} />
                <Route path="/confirmation"        element={<ConfirmationPage />} />
                <Route path="/account"             element={<AccountPage />} />
                <Route path="/login"               element={<LoginPage />} />
                <Route path="/register"            element={<RegisterPage />} />
                <Route path="/forgot-password"     element={<ForgotPasswordPage />} />
                <Route path="/reset-password"      element={<ResetPasswordPage />} />
                <Route path="/chat"                    element={<ChatPage />} />
                <Route path="/manage-booking"          element={<ManageBookingPage />} />
                <Route path="/events"                   element={<EventsPage />} />
                <Route path="/dining"                   element={<DiningPage />} />
                <Route path="/wellness"                 element={<WellnessPage />} />
                <Route path="/concierge"                element={<ConciergePage />} />
                <Route path="/explore"                  element={<ExploreHotelPage />} />
                <Route path="/offers"                   element={<OffersPage />} />
                <Route path="/about"                    element={<AboutPage />} />
                <Route path="/contact"                  element={<ContactPage />} />
                <Route path="*"                    element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BookingProvider>
          </GuestAuthNotificationsWrapper>
        </GuestAuthProvider>
      </HotelConfigProvider>
    </BrowserRouter>
  );
}