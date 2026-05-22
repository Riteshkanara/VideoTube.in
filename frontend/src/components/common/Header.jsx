import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import useAuthStore from '../../store/auth.store.js';
import { authAPI } from '../../api/auth.api';
import Avatar from './Avatar';
import toast from 'react-hot-toast';

export default function Header({ onMenuClick }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const inputRef = useRef(null);

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
      backgroundColor: 'rgba(13,13,13,0.97)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid #1a1a1a',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 12,
    }}>

      {/* Left: hamburger + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={onMenuClick}
          className="hamburger-btn"
          style={{
            display: 'none',
            background: 'none', border: 'none',
            color: '#888', cursor: 'pointer',
            padding: '6px', borderRadius: 8,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 34, height: 34,
            borderRadius: 9,
            background: 'linear-gradient(135deg, #FF0000, #FF4D8D)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(255,0,0,0.35)',
            flexShrink: 0,
          }}>
            <svg width="15" height="15" fill="white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="logo-text" style={{
            fontWeight: 800, fontSize: 17,
            letterSpacing: -0.5, color: '#fff',
          }}>
            VideoTube
          </span>
        </Link>
      </div>

      {/* Center: search */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
        }}>
          <svg
            width="15" height="15"
            style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)',
              color: searchFocused ? '#FF4444' : '#444',
              transition: 'color 0.2s',
              pointerEvents: 'none',
            }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search videos..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%',
              padding: '9px 40px 9px 38px',
              background: searchFocused ? '#1e1e1e' : '#161616',
              border: `1px solid ${searchFocused ? '#FF0000' : '#222'}`,
              borderRadius: 100,
              color: '#fff',
              fontSize: 13.5,
              outline: 'none',
              transition: 'all 0.2s',
              boxShadow: searchFocused ? '0 0 0 3px rgba(255,0,0,0.08)' : 'none',
            }}
          />

          {/* Clear button */}
          {searchVal && (
            <button
              onClick={() => { setSearchVal(''); inputRef.current?.focus(); }}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                color: '#555', cursor: 'pointer',
                padding: 2, display: 'flex',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {isAuthenticated ? (
          <>
            {/* Upload */}
            <Link to="/upload" style={{ textDecoration: 'none' }}>
              <button
                title="Upload video"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36,
                  background: 'none',
                  border: '1px solid #222',
                  borderRadius: 10,
                  color: '#666',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#FF0000';
                  e.currentTarget.style.color = '#FF0000';
                  e.currentTarget.style.background = 'rgba(255,0,0,0.06)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#222';
                  e.currentTarget.style.color = '#666';
                  e.currentTarget.style.background = 'none';
                }}
              >
                <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </Link>

            {/* Notification bell */}
            <button
              title="Notifications"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36,
                background: 'none',
                border: '1px solid #222',
                borderRadius: 10,
                color: '#666',
                cursor: 'pointer',
                transition: 'all 0.18s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.color = '#ccc';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#222';
                e.currentTarget.style.color = '#666';
              }}
            >
              <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification dot */}
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 6, height: 6, borderRadius: '50%',
                background: '#FF0000',
                border: '1.5px solid #0d0d0d',
              }} />
            </button>

            {/* Avatar + dropdown */}
            <div style={{ position: 'relative' }} className="user-menu">
              <button style={{
                background: 'none',
                border: '2px solid #222',
                borderRadius: '50%',
                padding: 0, cursor: 'pointer',
                lineHeight: 0,
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#FF0000'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#222'}
              >
                <Avatar src={user?.avatar} alt={user?.fullName} size="sm" />
              </button>

              {/* Dropdown */}
              <div className="dropdown-menu" style={{
                position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                width: 210,
                background: '#111',
                border: '1px solid #222',
                borderRadius: 14,
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                opacity: 0, visibility: 'hidden',
                transform: 'translateY(-6px)',
                transition: 'all 0.2s ease',
                zIndex: 100,
              }}>
                {/* User info header */}
                <div style={{
                  padding: '13px 14px',
                  borderBottom: '1px solid #1a1a1a',
                  background: 'rgba(255,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar src={user?.avatar} alt={user?.fullName} size="sm" />
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        margin: 0, fontWeight: 600, fontSize: 13.5, color: '#f0f0f0',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {user?.fullName}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: '#555' }}>
                        @{user?.username}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dropdown links */}
                {[
                  { label: 'My Channel',    path: `/channel/${user?.username}` },
                  { label: 'Playlists',     path: '/playlists' },
                  { label: 'Liked Videos',  path: '/liked-videos' },
                ].map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex', alignItems: 'center',
                      padding: '9px 14px',
                      textDecoration: 'none',
                      color: '#999', fontSize: 13.5,
                      borderBottom: '1px solid #161616',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#1a1a1a';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#999';
                    }}
                  >
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '9px 14px',
                    background: 'none', border: 'none',
                    color: '#FF4444', fontSize: 13.5,
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  Sign out
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '8px 18px',
              background: 'linear-gradient(135deg, #FF0000, #FF4D8D)',
              border: 'none', borderRadius: 8,
              color: '#fff', fontWeight: 600, fontSize: 13.5,
              cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(255,0,0,0.3)',
              transition: 'box-shadow 0.2s, transform 0.15s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(255,0,0,0.45)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 3px 12px rgba(255,0,0,0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Sign In
            </button>
          </Link>
        )}
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .hamburger-btn { display: flex !important; }
        }
        @media (max-width: 400px) {
          .logo-text { display: none !important; }
        }
        .user-menu:hover .dropdown-menu {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </header>
  );
}
