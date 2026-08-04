import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import useAuthStore from '../store/auth.store';
import { authAPI } from '../api/auth.api';

const YouTubeIcon = () => (
  <svg width="90" height="20" viewBox="0 0 90 20" fill="none">
    <g>
      <path d="M27.9 3.1c-.3-1.2-1.3-2.1-2.5-2.4C23.2 0.2 14 0.2 14 0.2s-9.2 0-11.4.5C1.4 1 0.4 1.9.1 3.1 -0.3 5.3-0.3 10-0.3 10s0 4.7.4 6.9c.3 1.2 1.3 2.1 2.5 2.4C4.8 19.8 14 19.8 14 19.8s9.2 0 11.4-.5c1.2-.3 2.2-1.2 2.5-2.4.4-2.2.4-6.9.4-6.9s0-4.7-.4-6.9z" fill="#FF0000" transform="translate(3,0)"/>
      <path d="M14.5 14.2l7.6-4.2-7.6-4.2v8.4z" fill="#fff" transform="translate(-3.5,0)"/>
    </g>
    <text x="32" y="14" fontFamily="Roboto, Arial, sans-serif" fontSize="15" fontWeight="400" fill="#0f0f0f" letterSpacing="-0.3">VideoTube</text>
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
      <header style={s.header}>
        <Link to="/" style={{ display: 'flex' }}>
          <YouTubeIcon />
        </Link>
      </header>

      <main style={s.main}>
        <div style={s.card}>
          <h1 style={s.heading}>Sign in</h1>
          <p style={s.sub}>to continue to VideoTube</p>

          <form onSubmit={handleSubmit} noValidate style={{ marginTop: 32 }}>
            <div style={s.field}>
              <input
                id="vt-email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={s.input}
                onFocus={e => { e.target.style.borderColor = '#1a73e8'; e.target.style.borderWidth = '2px'; }}
                onBlur={e => { e.target.style.borderColor = '#dadce0'; e.target.style.borderWidth = '1px'; }}
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
                  onFocus={e => { e.target.style.borderColor = '#1a73e8'; e.target.style.borderWidth = '2px'; }}
                  onBlur={e => { e.target.style.borderColor = '#dadce0'; e.target.style.borderWidth = '1px'; }}
                  required
                />
              </div>
              <button
                type="button"
                style={s.showPasswordBtn}
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? 'Hide password' : 'Show password'}
              </button>
            </div>

            <div style={s.divider} />

            <div style={s.googleWrap}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google login failed')}
                useOneTap
                theme="outline"
                shape="rectangular"
                width="360"
              />
            </div>

            <div style={s.footerRow}>
              <Link to="/register" style={s.createLink}>Create account</Link>
              <button type="submit" disabled={loading} style={s.primaryBtn}>
                {loading ? 'Signing in…' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer style={s.footer}>
        <select style={s.langSelect} defaultValue="en">
          <option value="en">English (India)</option>
        </select>
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
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Roboto', Arial, sans-serif",
  },
  header: {
    padding: '20px 24px',
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: 450,
    border: '1px solid #dadce0',
    borderRadius: 8,
    padding: '48px 40px 36px',
    boxSizing: 'border-box',
  },
  heading: {
    fontSize: 24,
    fontWeight: 400,
    color: '#202124',
    textAlign: 'center',
    margin: 0,
  },
  sub: {
    fontSize: 16,
    color: '#202124',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 0,
  },
  field: { marginBottom: 16 },
  inputWrap: { position: 'relative' },
  input: {
    width: '100%',
    padding: '13px 15px',
    fontSize: 16,
    color: '#202124',
    border: '1px solid #dadce0',
    borderRadius: 4,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  showPasswordBtn: {
    marginTop: 8,
    background: 'none',
    border: 'none',
    color: '#1a73e8',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    padding: 0,
  },
  divider: {
    height: 1,
    background: 'transparent',
    margin: '24px 0 16px',
  },
  googleWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 32,
  },
  footerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createLink: {
    color: '#1a73e8',
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
  },
  primaryBtn: {
    padding: '10px 24px',
    background: '#1a73e8',
    border: 'none',
    borderRadius: 4,
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    fontSize: 12,
    color: '#5f6368',
  },
  langSelect: {
    fontSize: 12,
    color: '#5f6368',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  },
  footerLinks: {
    display: 'flex',
    gap: 24,
  },
  footerLink: {
    color: '#5f6368',
    textDecoration: 'none',
    fontSize: 12,
  },
};
