// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HotelConfigProvider } from './hooks/useHotelConfig.jsx';
import { GuestAuthProvider }   from './hooks/useGuestAuth.jsx';
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
import ChatPage           from './pages/ChatPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <HotelConfigProvider>
        <GuestAuthProvider>
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
                <Route path="*"                    element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BookingProvider>
        </GuestAuthProvider>
      </HotelConfigProvider>
    </BrowserRouter>
  );
} 