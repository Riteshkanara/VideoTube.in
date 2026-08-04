import { Link, useLocation } from 'react-router-dom';
import {
  Home, TrendingUp, History, ThumbsUp,
  PlaySquare, Users, Twitter, Upload as UploadIcon,
  Flame, Bookmark,
} from 'lucide-react';
import useAuthStore from '../../store/auth.store';

const menuItems = [
  { icon: Home,       label: 'Home',     path: '/' },
  { icon: TrendingUp, label: 'Trending', path: '/trending' },
  { icon: Flame,      label: 'Tweets',   path: '/tweets' },
];

const authItems = [
  { icon: UploadIcon,  label: 'Upload',        path: '/upload' },
  { icon: ThumbsUp,    label: 'Liked',         path: '/liked-videos' },
  { icon: PlaySquare,  label: 'Playlists',     path: '/playlists' },
  { icon: Users,       label: 'Subscriptions', path: '/subscriptions' },
  { icon: History,     label: 'History',       path: '/history' },
  { icon: Bookmark,    label: 'Saved',         path: '/saved' },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const isActive = p => location.pathname === p;

  const NavItem = ({ item }) => {
    const active = isActive(item.path);
    return (
      <Link
        to={item.path}
        onClick={onClose}
        style={{ textDecoration: 'none' }}
      >
        <div
          className={`nav-item ${active ? 'nav-item--active' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 14px',
            borderRadius: 12,
            fontSize: 13.5,
            fontWeight: active ? 600 : 400,
            color: active ? '#fff' : '#5a5a5a',
            background: active
              ? 'linear-gradient(135deg, rgba(255,34,34,0.18) 0%, rgba(255,77,141,0.12) 100%)'
              : 'transparent',
            border: active
              ? '1px solid rgba(255,34,34,0.2)'
              : '1px solid transparent',
            position: 'relative',
            transition: 'all 0.18s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            if (!active) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.color = '#ccc';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
            }
          }}
          onMouseLeave={e => {
            if (!active) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#5a5a5a';
              e.currentTarget.style.borderColor = 'transparent';
            }
          }}
        >
          {/* Active left bar */}
          {active && (
            <div style={{
              position: 'absolute',
              left: 0, top: '20%', bottom: '20%',
              width: 3, borderRadius: 4,
              background: 'linear-gradient(180deg, #FF2222, #FF4D8D)',
            }} />
          )}

          <item.icon
            size={16}
            strokeWidth={active ? 2.2 : 1.7}
            style={{ color: active ? '#FF4444' : 'inherit', flexShrink: 0 }}
          />
          <span style={{ flex: 1 }}>{item.label}</span>
        </div>
      </Link>
    );
  };

  const SectionLabel = ({ children }) => (
    <div style={{
      padding: '6px 14px',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#2e2e2e',
      marginTop: 8,
      marginBottom: 2,
    }}>
      {children}
    </div>
  );

  const SidebarContent = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '12px 8px 20px',
    }}>

      {/* Main nav */}
      <SectionLabel>Discover</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {menuItems.map(item => <NavItem key={item.path} item={item} />)}
      </div>

      {/* Library */}
      {isAuthenticated && (
        <>
          <div style={{
            margin: '16px 6px 0',
            height: 1,
            background: 'linear-gradient(90deg, transparent, #1e1e1e 30%, #1e1e1e 70%, transparent)',
          }} />
          <SectionLabel>Library</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {authItems.map(item => <NavItem key={item.path} item={item} />)}
          </div>
        </>
      )}

      {/* Sign-in nudge if not authed */}
      {!isAuthenticated && (
        <div style={{
          margin: '20px 6px 0',
          padding: '16px',
          borderRadius: 12,
          background: 'rgba(255,34,34,0.06)',
          border: '1px solid rgba(255,34,34,0.12)',
        }}>
          <p style={{ margin: '0 0 10px', fontSize: 12.5, color: '#888', lineHeight: 1.5 }}>
            Sign in to access your library, liked videos and more.
          </p>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '8px 0',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #FF2222, #FF4D8D)',
              border: 'none',
              color: '#fff',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              Sign in
            </button>
          </Link>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 'auto', padding: '20px 6px 0' }}>
        <div style={{ height: 1, background: '#161616', marginBottom: 14 }} />
        <p style={{ margin: 0, fontSize: 10.5, color: '#2a2a2a', lineHeight: 1.8 }}>
          © 2026 VideoTube<br />
          <span style={{ color: '#222' }}>Privacy · Terms · Help</span>
        </p>
      </div>
    </div>
  );

  const base = {
    width: 220,
    minWidth: 220,
    background: '#0d0d0d',
    borderRight: '1px solid #161616',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  return (
    <>
      {/* Desktop */}
      <aside className="sidebar-desktop" style={{
        ...base,
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: 64,
        alignSelf: 'flex-start',
        flexShrink: 0,
      }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 39,
          }}
        />
      )}

      {/* Mobile drawer */}
      <aside className="sidebar-mobile" style={{
        ...base,
        position: 'fixed',
        top: 64, left: 0, bottom: 0,
        zIndex: 40,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.26s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: isOpen ? '4px 0 40px rgba(0,0,0,0.8)' : 'none',
      }}>
        <SidebarContent />
      </aside>

      <style>{`
        @media (min-width: 1024px) {
          .sidebar-desktop { display: block !important; }
          .sidebar-mobile  { display: none !important; }
        }
        @media (max-width: 1023px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile  { display: block; }
        }
        .sidebar-desktop::-webkit-scrollbar,
        .sidebar-mobile::-webkit-scrollbar { width: 3px; }
        .sidebar-desktop::-webkit-scrollbar-track,
        .sidebar-mobile::-webkit-scrollbar-track { background: transparent; }
        .sidebar-desktop::-webkit-scrollbar-thumb,
        .sidebar-mobile::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 4px; }
      `}</style>
    </>
  );
}
