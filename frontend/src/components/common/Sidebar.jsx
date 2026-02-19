import { Link, useLocation } from 'react-router-dom';
import {
  Home, TrendingUp, History, ThumbsUp,
  PlaySquare, Users, Twitter, Upload as UploadIcon
} from 'lucide-react';
import useAuthStore from '../../store/auth.store';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: Twitter, label: 'Tweets', path: '/tweets' },
  ];

  const authItems = [
    { icon: UploadIcon, label: 'Upload', path: '/upload' },
    { icon: ThumbsUp, label: 'Liked Videos', path: '/liked-videos' },
    { icon: PlaySquare, label: 'Playlists', path: '/playlists' },
    { icon: Users, label: 'Subscriptions', path: '/subscriptions' },
    { icon: History, label: 'History', path: '/history' },
  ];

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ item }) => {
    const active = isActive(item.path);
    return (
      <Link
        to={item.path}
        onClick={onClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          borderRadius: 10,
          textDecoration: 'none',
          color: active ? '#fff' : '#888',
          background: active
            ? 'linear-gradient(135deg, #FF0000, #FF4D8D)'
            : 'transparent',
          boxShadow: active ? '0 4px 15px rgba(255,0,0,0.3)' : 'none',
          fontWeight: active ? 600 : 400,
          fontSize: 14,
          transition: 'all 0.2s',
          transform: 'translateX(0)',
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'translateX(4px)';
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#888';
            e.currentTarget.style.transform = 'translateX(0)';
          }
        }}
      >
        <item.icon size={18} />
        <span>{item.label}</span>
        {active && (
          <div style={{
            marginLeft: 'auto',
            width: 6, height: 6,
            borderRadius: '50%',
            background: '#fff',
          }} />
        )}
      </Link>
    );
  };

  return (
    <>
      {/*
        ✅ THE FIX IS HERE:
        - On desktop (lg): position is STATIC inside the flex row
          → It takes up space in the layout, pushing content to the right
          → Width is always 256px
          → Content naturally sits beside it

        - On mobile: position is FIXED
          → It floats on top of content (overlay style)
          → Toggled with translate

        We use a CSS class trick to switch between these two behaviors
      */}

      {/* Desktop sidebar — static, always visible, takes up layout space */}
      <aside
        className="desktop-sidebar"
        style={{
          width: 256,
          minWidth: 256,
          height: 'calc(100vh - 64px)',
          position: 'sticky',
          top: 64,
          alignSelf: 'flex-start',
          backgroundColor: '#111',
          borderRight: '1px solid #1e1e1e',
          overflowY: 'auto',
          overflowX: 'hidden',
          flexShrink: 0,
        }}
      >
        <SidebarContent
          menuItems={menuItems}
          authItems={authItems}
          isAuthenticated={isAuthenticated}
          NavLink={NavLink}
        />
      </aside>

      {/* Mobile sidebar — fixed overlay, slides in/out */}
      <aside
        className="mobile-sidebar"
        style={{
          position: 'fixed',
          top: 64,
          left: 0,
          bottom: 0,
          width: 256,
          backgroundColor: '#111',
          borderRight: '1px solid #1e1e1e',
          overflowY: 'auto',
          zIndex: 40,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <SidebarContent
          menuItems={menuItems}
          authItems={authItems}
          isAuthenticated={isAuthenticated}
          NavLink={NavLink}
        />
      </aside>

      {/* Responsive styles */}
      <style>{`
        /* Desktop: show static sidebar, hide mobile sidebar */
        @media (min-width: 1024px) {
          .desktop-sidebar { display: flex; flex-direction: column; }
          .mobile-sidebar  { display: none !important; }
          .main-content    { margin-left: 0 !important; }
        }

        /* Mobile/Tablet: hide static sidebar, show mobile sidebar */
        @media (max-width: 1023px) {
          .desktop-sidebar { display: none !important; }
          .mobile-sidebar  { display: block; }
          .main-content    { margin-left: 0 !important; width: 100% !important; }
        }

        /* Page content wrapper — consistent padding */
        .page-wrapper {
          padding: 24px;
          max-width: 1400px;
          width: 100%;
        }

        @media (max-width: 640px) {
          .page-wrapper { padding: 16px; }
        }

        /* Custom scrollbar for sidebar */
        .desktop-sidebar::-webkit-scrollbar,
        .mobile-sidebar::-webkit-scrollbar {
          width: 4px;
        }
        .desktop-sidebar::-webkit-scrollbar-track,
        .mobile-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .desktop-sidebar::-webkit-scrollbar-thumb,
        .mobile-sidebar::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}

// Extracted so both desktop + mobile sidebars share same content
function SidebarContent({ menuItems, authItems, isAuthenticated, NavLink }) {
  return (
    <nav style={{ padding: '16px 12px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Main items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {menuItems.map(item => (
          <NavLink key={item.path} item={item} />
        ))}
      </div>

      {/* Auth items */}
      {isAuthenticated && (
        <>
          <div style={{
            margin: '16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{ flex: 1, height: 1, background: '#1e1e1e' }} />
            <span style={{ fontSize: 10, color: '#444', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
              Library
            </span>
            <div style={{ flex: 1, height: 1, background: '#1e1e1e' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {authItems.map(item => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #1a1a1a' }}>
        <p style={{ fontSize: 11, color: '#333', textAlign: 'center' }}>
          © 2024 VideoTube
        </p>
      </div>
    </nav>
  );
}