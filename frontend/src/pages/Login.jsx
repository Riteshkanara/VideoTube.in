import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import useAuthStore from '../store/auth.store';
import { authAPI } from '../api/auth.api';
import Logo from '../components/common/Logo';

const EyeOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

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

  return (
    <div style={s.page}>
      <div style={s.bgGlow} />

      <header style={s.header}>
        <Link to="/">
          <Logo variant="premium" size="lg" />
        </Link>
      </header>

      <main style={s.main}>
        <div style={s.card}>
          <h1 style={s.heading}>Sign in</h1>
          <p style={s.sub}>Use your account to continue to VideoTube</p>

          <form onSubmit={handleSubmit} noValidate style={{ marginTop: 28 }}>
            <div style={s.field}>
              <input
                id="vt-email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={s.input}
                onFocus={e => e.target.style.borderColor = '#e8192c'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                required
              />
            </div>

            <div style={s.field}>
              <div style={s.inputWrap}>
                <input
                  id="vt-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={s.input}
                  onFocus={e => e.target.style.borderColor = '#e8192c'}
                  onBlur={e => e.target.style.borderColor = '#2a2a2a'}
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

            <div style={s.row}>
              <button type="button" style={s.forgotBtn}>Forgot password?</button>
            </div>

            <button type="submit" disabled={loading} style={s.primaryBtn}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={s.divider}>
            <div style={s.dividerLine} />
            <span style={s.dividerText}>or</span>
            <div style={s.dividerLine} />
          </div>

          <div style={s.googleWrap}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google login failed')}
              useOneTap
              theme="filled_black"
              shape="pill"
              width="340"
            />
          </div>

          <p style={s.registerText}>
            Don't have an account?{' '}
            <Link to="/register" style={s.registerLink}>Create one now</Link>
          </p>
        </div>
      </main>

      <footer style={s.footer}>
        <span style={s.footerText}>© 2026 VideoTube</span>
        <div style={s.footerLinks}>
          <a href="#" style={s.footerLink}>Help</a>
          <a href="#" style={s.footerLink}>Privacy</a>
          <a href="#" style={s.footerLink}>Terms</a>
        </div>
      </footer>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  bgGlow: {
    position: 'absolute', inset: 0,
    background: `radial-gradient(ellipse 50% 40% at 50% 0%, rgba(180,20,30,0.14) 0%, transparent 65%)`,
    pointerEvents: 'none', zIndex: 0,
  },
  header: {
    position: 'relative', zIndex: 1,
    padding: '24px 32px',
  },
  main: {
    position: 'relative', zIndex: 1,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: '#111',
    border: '0.5px solid #222',
    borderRadius: 12,
    padding: '40px 36px',
    boxSizing: 'border-box',
  },
  heading: {
    fontSize: 26,
    fontWeight: 500,
    color: '#fff',
    letterSpacing: '-0.5px',
    margin: 0,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 0,
  },
  field: { marginBottom: 14 },
  inputWrap: { position: 'relative' },
  input: {
    width: '100%',
    padding: '13px 14px',
    background: '#0f0f0f',
    border: '0.5px solid #2a2a2a',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  eyeBtn: {
    position: 'absolute', right: 10, top: '50%',
    transform: 'translateY(-50%)',
    background: 'none', border: 'none',
    color: '#555', cursor: 'pointer',
    display: 'flex', padding: 2,
  },
  row: {
    display: 'flex', justifyContent: 'flex-end',
    marginBottom: 20,
  },
  forgotBtn: {
    fontSize: 13, color: '#e8192c',
    background: 'none', border: 'none',
    cursor: 'pointer', opacity: 0.9,
  },
  primaryBtn: {
    width: '100%', padding: '13px 0',
    background: '#e8192c', border: 'none', borderRadius: 24,
    color: '#fff', fontSize: 15, fontWeight: 500,
    cursor: 'pointer', letterSpacing: '-0.2px',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12,
    margin: '24px 0 20px',
  },
  dividerLine: { flex: 1, height: 0.5, background: '#222' },
  dividerText: { fontSize: 12, color: '#555' },
  googleWrap: {
    display: 'flex', justifyContent: 'center', marginBottom: 24,
  },
  registerText: { textAlign: 'center', fontSize: 13, color: '#555', margin: 0 },
  registerLink: { color: '#e8192c', textDecoration: 'none', fontWeight: 500 },
  footer: {
    position: 'relative', zIndex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 32px', fontSize: 12, color: '#444',
  },
  footerText: { color: '#444' },
  footerLinks: { display: 'flex', gap: 20 },
  footerLink: { color: '#444', textDecoration: 'none' },
};
