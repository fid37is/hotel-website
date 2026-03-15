// src/pages/RegisterPage.jsx — Pure Tailwind
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGuestAuth }   from '../hooks/useGuestAuth.jsx';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';

const EyeIcon = ({ open }) => open ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

// ── Field defined OUTSIDE RegisterPage so it is never recreated on render ──
// Defining it inside caused React to unmount/remount the input on every
// keystroke, moving the cursor to the end of the field.
function Field({ name, label, type = 'text', placeholder, optional, showToggle, show, onToggle, value, onChange, error }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}{optional && <span className="form-label-optional ml-1">optional</span>}
      </label>
      <div className="relative">
        <input
          type={show !== undefined ? (show ? 'text' : type) : type}
          className={`input ${error ? 'input--error' : ''} ${showToggle ? 'pr-12' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          autoComplete={type === 'password' ? 'new-password' : name}
        />
        {showToggle && (
          <button type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
            onClick={onToggle}>
            <EyeIcon open={show} />
          </button>
        )}
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export default function RegisterPage() {
  const hotelConfig = useHotelConfig();
  const { register, isLoggedIn } = useGuestAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from     = location.state?.from || '/account';

  const [form, setForm] = useState({ full_name: '', email: '', phone: '', address: '', password: '', confirm_password: '' });
  const [showPwd,  setShowPwd]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [errors,   setErrors]   = useState({});

  useEffect(() => {
    document.title = `Create Account | ${hotelConfig.shortName}`;
    if (isLoggedIn) navigate(from, { replace: true });
  }, [isLoggedIn]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.full_name.trim())                  e.full_name        = 'Full name is required';
    if (!form.email.trim())                      e.email            = 'Email is required';
    if (form.password.length < 8)                e.password         = 'Minimum 8 characters';
    if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setError(''); setLoading(true);
    try { await register(form); navigate(from, { replace: true }); }
    catch (err) { setError(err.message || 'Registration failed. Please try again.'); }
    finally     { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center pt-nav px-4 pb-12">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-lg border border-border p-8 lg:p-10">
          <div className="text-center mb-8">
            <Link to="/" className="font-display text-2xl font-medium text-primary">{hotelConfig.shortName}</Link>
            <h1 className="text-2xl font-medium mt-4 mb-1">Create Account</h1>
            <p className="text-sm text-muted">Book and manage your stays with ease</p>
          </div>

          {error && <div className="alert alert--error mb-5">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field name="full_name"        label="Full Name"        placeholder="John Doe"
              value={form.full_name}        onChange={set} error={errors.full_name} />
            <Field name="email"            label="Email Address"    type="email" placeholder="you@example.com"
              value={form.email}            onChange={set} error={errors.email} />
            <Field name="phone"            label="Phone Number"     type="tel" placeholder="+234 800 000 0000" optional
              value={form.phone}            onChange={set} error={errors.phone} />
            <Field name="address"          label="Address"          placeholder="Street, City, State" optional
              value={form.address}          onChange={set} error={errors.address} />
            <Field name="password"         label="Password"         type="password" placeholder="Min. 8 characters"
              showToggle show={showPwd}  onToggle={() => setShowPwd(v => !v)}
              value={form.password}         onChange={set} error={errors.password} />
            <Field name="confirm_password" label="Confirm Password" type="password" placeholder="Repeat password"
              showToggle show={showConf} onToggle={() => setShowConf(v => !v)}
              value={form.confirm_password} onChange={set} error={errors.confirm_password} />

            <button type="submit" className="btn btn--primary justify-center w-full py-3.5" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-sm">
            <p>Already have an account? <Link to="/login" state={{ from }} className="text-secondary hover:underline">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}