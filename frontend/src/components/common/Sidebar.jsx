import { Link, useLocation } from 'react-router-dom';
import {
  Home, TrendingUp, History, ThumbsUp,
  PlaySquare, Users, Twitter, Upload as UploadIcon,
} from 'lucide-react';
import useAuthStore from '../../store/auth.store';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const menuItems = [
    { icon: Home,        label: 'Home',     path: '/' },
    { icon: TrendingUp,  label: 'Trending', path: '/trending' },
    { icon: Twitter,     label: 'Tweets',   path: '/tweets' },
  ];

  const authItems = [
    { icon: UploadIcon, label: 'Upload',        path: '/upload' },
    { icon: ThumbsUp,   label: 'Liked Videos',  path: '/liked-videos' },
    { icon: PlaySquare, label: 'Playlists',     path: '/playlists' },
    { icon: Users,      label: 'Subscriptions', path: '/subscriptions' },
    { icon: History,    label: 'History',       path: '/history' },
  ];

  const isActive = path => location.pathname === path;

  const NavLink = ({ item }) => {
    const active = isActive(item.path);
    return (
      <Link
        to={item.path}
        onClick={onClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '9px 12px',
          borderRadius: 10,
          textDecoration: 'none',
          color: active ? '#fff' : '#777',
          background: active
            ? 'linear-gradient(135deg, #FF0000 0%, #FF4D8D 100%)'
            : 'transparent',
          boxShadow: active ? '0 3px 12px rgba(255,0,0,0.25)' : 'none',
          fontWeight: active ? 600 : 400,
          fontSize: 13.5,
          transition: 'all 0.18s ease',
          position: 'relative',
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#ddd';
            e.currentTarget.style.paddingLeft = '16px';
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#777';
            e.currentTarget.style.paddingLeft = '12px';
          }
        }}
      >
        <item.icon size={17} strokeWidth={active ? 2.2 : 1.8} />
        <span style={{ flex: 1 }}>{item.label}</span>
        {active && (
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: 'rgba(255,255,255,0.8)',
            flexShrink: 0,
          }} />
        )}
      </Link>
    );
  };

  const SidebarInner = () => (
    <nav style={{
      padding: '16px 10px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Main nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {menuItems.map(item => <NavLink key={item.path} item={item} />)}
      </div>

      {/* Library section */}
      {isAuthenticated && (
        <>
          <div style={{
            margin: '18px 0 10px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
            <span style={{
              fontSize: 10, color: '#3a3a3a',
              fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Library
            </span>
            <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {authItems.map(item => <NavLink key={item.path} item={item} />)}
          </div>
        </>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 'auto',
        paddingTop: 20,
        borderTop: '1px solid #181818',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 11, color: '#2a2a2a' }}>© 2024 VideoTube</p>
      </div>
    </nav>
  );

  const sidebarBase = {
    width: 240,
    minWidth: 240,
    backgroundColor: '#111',
    borderRight: '1px solid #1a1a1a',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  return (
    <>
      {/* Desktop — static, sticky */}
      <aside
        className="desktop-sidebar"
        style={{
          ...sidebarBase,
          height: 'calc(100vh - 64px)',
          position: 'sticky',
          top: 64,
          alignSelf: 'flex-start',
          flexShrink: 0,
        }}
      >
        <SidebarInner />
      </aside>

      {/* Mobile — fixed overlay */}
      <aside
        className="mobile-sidebar"
        style={{
          ...sidebarBase,
          position: 'fixed',
          top: 64, left: 0, bottom: 0,
          zIndex: 40,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <SidebarInner />
      </aside>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-sidebar { display: flex !important; flex-direction: column; }
          .mobile-sidebar  { display: none !important; }
        }
        @media (max-width: 1023px) {
          .desktop-sidebar { display: none !important; }
          .mobile-sidebar  { display: block; }
          .main-content    { margin-left: 0 !important; width: 100% !important; }
        }
        .page-wrapper {
          padding: 24px;
          max-width: 1400px;
          width: 100%;
        }
        @media (max-width: 640px) {
          .page-wrapper { padding: 16px; }
        }
        .desktop-sidebar::-webkit-scrollbar,
        .mobile-sidebar::-webkit-scrollbar { width: 4px; }
        .desktop-sidebar::-webkit-scrollbar-track,
        .mobile-sidebar::-webkit-scrollbar-track { background: transparent; }
        .desktop-sidebar::-webkit-scrollbar-thumb,
        .mobile-sidebar::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
      `}</style>
    </>
  );
}
