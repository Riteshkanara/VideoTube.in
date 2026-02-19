import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store.js';
import { authAPI } from '../../api/auth.api';
import Avatar from './Avatar';
import toast from 'react-hot-toast';

export default function Header({ onMenuClick }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 64,
      backgroundColor: 'rgba(17,17,17,0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #1e1e1e',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      gap: 16,
    }}>

      {/* Left: Hamburger + Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {/* Hamburger — only shows on mobile */}
        <button
          onClick={onMenuClick}
          className="hamburger-btn"
          style={{
            display: 'none', // hidden on desktop via CSS below
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: 8,
            borderRadius: 8,
          }}
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Icon */}
          <div style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #FF0000, #FF4D8D)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(255,0,0,0.4)',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          {/* Text — hidden on very small screens */}
          <span className="logo-text" style={{
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: -0.5,
            color: '#fff',
          }}>
            VideoTube
          </span>
        </Link>
      </div>

      {/* Center: Search */}
      <div style={{ flex: 1, maxWidth: 520, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <svg
            width="16" height="16"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#555' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search videos..."
            style={{
              width: '100%',
              padding: '9px 44px 9px 40px',
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 100,
              color: '#fff',
              fontSize: 14,
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#FF0000'}
            onBlur={e => e.target.style.borderColor = '#2a2a2a'}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {isAuthenticated ? (
          <>
            {/* Upload button */}
            <Link to="/upload" style={{ textDecoration: 'none' }}>
              <button
                title="Upload video"
                style={{
                  background: 'none', border: '1px solid #2a2a2a',
                  color: '#888', borderRadius: 8, padding: '7px 9px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#FF0000';
                  e.currentTarget.style.color = '#FF0000';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#2a2a2a';
                  e.currentTarget.style.color = '#888';
                }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </Link>

            {/* User avatar + dropdown */}
            <div style={{ position: 'relative' }} className="user-menu">
              <button
                style={{
                  background: 'none', border: '2px solid #2a2a2a',
                  borderRadius: '50%', padding: 0, cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  lineHeight: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#FF0000'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                <Avatar src={user?.avatar} alt={user?.fullName} size="sm" />
              </button>

              {/* Dropdown */}
              <div className="dropdown-menu" style={{
                position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                width: 220,
                background: '#111',
                border: '1px solid #2a2a2a',
                borderRadius: 14,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                opacity: 0,
                visibility: 'hidden',
                transform: 'translateY(-6px)',
                transition: 'all 0.2s',
                zIndex: 100,
              }}>
                {/* User info */}
                <div style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #1e1e1e',
                  background: 'linear-gradient(135deg, rgba(255,0,0,0.08), transparent)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar src={user?.avatar} alt={user?.fullName} size="sm" />
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.fullName}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
                        @{user?.username}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                {[
                  { label: 'My Channel', path: `/channel/${user?.username}`, color: '#FF0000' },
                  { label: 'Playlists', path: '/playlists', color: '#3B82F6' },
                  { label: 'Liked Videos', path: '/liked-videos', color: '#EC4899' },
                ].map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'block', padding: '10px 16px',
                      textDecoration: 'none', color: '#aaa',
                      fontSize: 14, transition: 'all 0.15s',
                      borderBottom: '1px solid #151515',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#1a1a1a';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#aaa';
                    }}
                  >
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '10px 16px', background: 'none',
                    border: 'none', color: '#FF4444', fontSize: 14,
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #FF0000, #FF4D8D)',
              border: 'none', borderRadius: 8, color: '#fff',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255,0,0,0.3)',
            }}>
              Sign In
            </button>
          </Link>
        )}
      </div>

      {/* Global styles */}
      <style>{`
        /* Show hamburger on mobile only */
        @media (max-width: 1023px) {
          .hamburger-btn { display: flex !important; }
        }

        /* Hide logo text on very small screens */
        @media (max-width: 400px) {
          .logo-text { display: none !important; }
        }

        /* Hover to show dropdown */
        .user-menu:hover .dropdown-menu {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </header>
  );
}