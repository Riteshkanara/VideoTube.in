import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import useAuthStore from './store/auth.store';
import { authAPI } from './api/auth.api';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Upload from './pages/Upload';
import LikedVideos from './pages/LikedVideos';
import VideoWatch from './pages/VideoWatch';
import Tweets from './pages/Tweets';
import Channel from './pages/Channel';
import Playlists from './pages/Playlists';
import Subscriptions from './pages/Subscriptions';
import PlaylistDetail from './components/playlist/PlaylistDetail.jsx';

// Layout
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Loader from './components/common/Loader';
import ChannelPage from './pages/Channelpage.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// ✅ THIS IS THE KEY COMPONENT — Layout wraps all pages properly
function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header - fixed at top, full width */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Body row: sidebar + content side by side */}
      <div style={{ display: 'flex', flex: 1, paddingTop: '64px' }}>

        {/* ✅ Sidebar - fixed on desktop, slide-in on mobile */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* ✅ Main content — pushed RIGHT of sidebar on desktop */}
        {/* On mobile: full width (sidebar overlays on top, not pushes) */}
        <main
          style={{
            flex: 1,
            // On desktop (lg), push content 256px (sidebar width) from left
            // This is done via className below
            overflowX: 'hidden',
            overflowY: 'auto',
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: '#0F0F0F',
          }}
          className="main-content"
        >
          <div className="page-wrapper">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay — clicking closes sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 30,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const { setUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
        } catch {
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [setUser]);

  if (loading) return <Loader fullScreen />;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark text-white">
        <Routes>
          {/* Auth pages — NO sidebar/header layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* All other pages — WITH sidebar/header layout */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />

          
          <Route path="/playlist/:playlistId" element={
  <Layout>
    <PlaylistDetail />
  </Layout>
} />

          
          <Route path="/channel/:username" element={
  <Layout>
    <ChannelPage />
  </Layout>
} />

          <Route path="/watch/:videoId" element={
            <Layout>
              <VideoWatch />
            </Layout>
          } />

          <Route path="/tweets" element={
            <Layout>
              <Tweets />
            </Layout>
          } />

          

          <Route path="/upload" element={
            <Layout>
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            </Layout>
          } />

          <Route path="/liked-videos" element={
            <Layout>
              <ProtectedRoute>
                <LikedVideos />
              </ProtectedRoute>
            </Layout>
          } />

          <Route path="/playlists" element={
            <Layout>
              <ProtectedRoute>
                <Playlists />
              </ProtectedRoute>
            </Layout>
          } />

          <Route path="/subscriptions" element={
            <Layout>
              <ProtectedRoute>
                <Subscriptions />
              </ProtectedRoute>
            </Layout>
          } />

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                minHeight: '60vh', gap: 12
              }}>
                <h1 style={{ fontSize: 72, fontWeight: 900, color: '#1f1f1f' }}>404</h1>
                <p style={{ color: '#666' }}>Page not found</p>
              </div>
            </Layout>
          } />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#212121', color: '#fff', border: '1px solid #333' },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;