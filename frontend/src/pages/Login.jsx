import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import useAuthStore from '../store/auth.store';
import { authAPI } from '../api/auth.api';
import Logo from '../components/common/Logo';

// ── Inline SVG icons (no extra deps) ─────────────────────────────────────────
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const TILE_ICONS = ['🎬','🎵','🌍','🎙️','🔭','📸','🎮','🏔️','🎧','📡','🌌','🎤'];

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // ── All your original logic — untouched ──────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.accessToken);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const response = await authAPI.GoogleLogin(credentialResponse.credential);
      login(response.user, response.accessToken);
      toast.success('Signed in with Google!');
      navigate('/');
    } catch (error) {
      console.error('Google Auth Error:', error);
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={s.page}>
      {/* Ambient red glow */}
      <div style={s.bgGlow} />

      {/* Cinematic tile grid — right side */}
      <div style={s.filmstrip} aria-hidden="true">
        <div style={s.tileGrid}>
          {TILE_ICONS.map((icon, i) => (
            <div key={i} style={{
              ...s.tile,
              background: i % 3 === 0 ? '#1c0e0e' : i % 3 === 1 ? '#111' : '#160d0d',
            }}>
              <span style={s.tileIcon}>{icon}</span>
            </div>
          ))}
        </div>
        <div style={s.fadeLeft} />
      </div>

      {/* Left panel */}
      <main style={s.left}>
        {/* Logo */}
        <div style={s.logoRow}>
          <Link to="/">
            <Logo variant="premium" size="xl" />
          </Link>
        </div>

        <h1 style={s.heading}>Welcome back</h1>
        <p style={s.sub}>Sign in to continue watching</p>

        {/* Email + password form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={s.field}>
            <label style={s.label} htmlFor="vt-email">Email address</label>
            <div style={s.inputWrap}>
              <input
                id="vt-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={s.input}
                onFocus={e => e.target.style.borderColor = 'rgba(232,25,44,0.45)'}
                onBlur={e => e.target.style.borderColor = '#222'}
                required
              />
              <span style={s.inputIcon}><MailIcon /></span>
            </div>
          </div>

          {/* Password */}
          <div style={s.field}>
            <label style={s.label} htmlFor="vt-password">Password</label>
            <div style={s.inputWrap}>
              <input
                id="vt-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={s.input}
                onFocus={e => e.target.style.borderColor = 'rgba(232,25,44,0.45)'}
                onBlur={e => e.target.style.borderColor = '#222'}
                required
              />
              <button
                type="button"
                style={s.eyeBtn}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </div>
          </div>

          {/* Remember + forgot */}
          <div style={s.row}>
            <label style={s.rememberLabel}>
              <input type="checkbox" style={s.checkbox} />
              Remember me
            </label>
            <button type="button" style={s.forgotBtn}>Forgot password?</button>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={s.primaryBtn}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>or continue with</span>
          <div style={s.dividerLine} />
        </div>

        {/* Google login — your original component, unchanged */}
        <div style={s.googleWrap}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google login failed')}
            useOneTap
            theme="filled_black"
            shape="pill"
            width="320"
          />
        </div>

        <p style={s.registerText}>
          Don't have an account?{' '}
          <Link to="/register" style={s.registerLink}>Create one now</Link>
        </p>
      </main>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  bgGlow: {
    position: 'absolute', inset: 0,
    background: `
      radial-gradient(ellipse 60% 50% at 75% 50%, rgba(180,20,30,0.18) 0%, transparent 65%),
      radial-gradient(ellipse 40% 60% at 20% 80%, rgba(120,10,20,0.12) 0%, transparent 60%)
    `,
    pointerEvents: 'none', zIndex: 0,
  },
  filmstrip: {
    position: 'absolute', right: 0, top: 0, bottom: 0,
    width: '52%', overflow: 'hidden', zIndex: 0,
  },
  tileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(4, 1fr)',
    gap: '4px', height: '100%',
    opacity: 0.18,
    transform: 'skewY(-4deg) scale(1.1)',
  },
  tile: {
    borderRadius: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  tileIcon: {
    fontSize: '28px',
    filter: 'grayscale(1) brightness(0.3)',
  },
  fadeLeft: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to right, #0a0a0a 25%, transparent 70%)',
    pointerEvents: 'none',
  },
  left: {
    position: 'relative', zIndex: 1,
    width: 'min(460px, 100%)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    padding: '52px clamp(24px, 5vw, 48px)',
  },
  logoRow: {
    marginBottom: '48px',
  },
  heading: {
    fontSize: 'clamp(24px, 4vw, 30px)',
    fontWeight: 500, color: '#fff',
    letterSpacing: '-0.5px', marginBottom: '6px',
  },
  sub: {
    fontSize: '14px', color: '#666', marginBottom: '32px',
  },
  field: { marginBottom: '16px' },
  label: {
    display: 'block', fontSize: '11px', color: '#555',
    marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase',
  },
  inputWrap: { position: 'relative' },
  input: {
    width: '100%', padding: '11px 40px 11px 14px',
    background: '#0f0f0f', border: '0.5px solid #222',
    borderRadius: '8px', color: '#fff', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  inputIcon: {
    position: 'absolute', right: '12px', top: '50%',
    transform: 'translateY(-50%)', color: '#333',
    pointerEvents: 'none', display: 'flex',
  },
  eyeBtn: {
    position: 'absolute', right: '10px', top: '50%',
    transform: 'translateY(-50%)', background: 'none',
    border: 'none', color: '#444', cursor: 'pointer',
    display: 'flex', padding: '2px',
  },
  row: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: '24px',
  },
  rememberLabel: {
    display: 'flex', alignItems: 'center', gap: '7px',
    fontSize: '13px', color: '#555', cursor: 'pointer',
  },
  checkbox: { width: '14px', height: '14px', accentColor: '#e8192c', cursor: 'pointer' },
  forgotBtn: {
    fontSize: '13px', color: '#e8192c', background: 'none',
    border: 'none', cursor: 'pointer', opacity: 0.85,
  },
  primaryBtn: {
    width: '100%', padding: '13px 0',
    background: '#e8192c', border: 'none', borderRadius: '8px',
    color: '#fff', fontSize: '15px', fontWeight: 500,
    cursor: 'pointer', marginBottom: '24px', letterSpacing: '-0.2px',
    opacity: 1, transition: 'opacity 0.15s',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
  },
  dividerLine: { flex: 1, height: '0.5px', background: '#1e1e1e' },
  dividerText: { fontSize: '12px', color: '#444', whiteSpace: 'nowrap' },
  googleWrap: {
    display: 'flex', justifyContent: 'center', marginBottom: '28px',
  },
  registerText: { textAlign: 'center', fontSize: '13px', color: '#444' },
  registerLink: { color: '#e8192c', textDecoration: 'none', opacity: 0.85 },
};
