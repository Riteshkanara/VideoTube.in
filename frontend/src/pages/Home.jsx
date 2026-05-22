import { useEffect, useState, useCallback } from 'react';
import { videoAPI } from '../api/video.api';
import VideoCard from '../components/video/VideoCard';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const FILTERS = ['All', 'Music', 'Gaming', 'News', 'Live', 'Science', 'Tech', 'Sports'];

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await videoAPI.getAllVideos();
      const videoData = response?.data?.docs || response?.data?.videos || [];
      setVideos(videoData);
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError(true);
      toast.error('Failed to load videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadVideos(); }, [loadVideos]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div>
        {/* Filter chips skeleton */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <div key={f} style={{
              height: 34, width: f.length * 9 + 24,
              borderRadius: 100, background: '#1a1a1a',
            }} className="skeleton" />
          ))}
        </div>

        {/* Section heading skeleton */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ height: 28, width: 180, borderRadius: 8, marginBottom: 8 }} className="skeleton" />
          <div style={{ height: 14, width: 140, borderRadius: 6 }} className="skeleton" />
        </div>

        {/* Grid skeleton */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 24,
        }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ aspectRatio: '16/9', borderRadius: 14 }} className="skeleton" />
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} className="skeleton" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ height: 14, borderRadius: 6 }} className="skeleton" />
                  <div style={{ height: 12, width: '60%', borderRadius: 6 }} className="skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', gap: 16, textAlign: 'center',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="32" height="32" fill="none" stroke="#FF4444" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Something went wrong</h2>
          <p style={{ color: '#666', fontSize: 14 }}>We couldn't load the videos</p>
        </div>
        <button onClick={loadVideos} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  /* ── Empty state ── */
  if (!Array.isArray(videos) || videos.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', gap: 16, textAlign: 'center',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="36" height="36" fill="none" stroke="#444" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>No videos yet</h2>
          <p style={{ color: '#666', fontSize: 14 }}>Be the first to upload!</p>
        </div>
        <button onClick={loadVideos} className="btn-secondary">Refresh</button>
      </div>
    );
  }

  /* ── Main feed ── */
  return (
    <div>
      {/* Category filter chips */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 28,
        flexWrap: 'wrap',
      }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '7px 16px',
              borderRadius: 100,
              border: activeFilter === f ? 'none' : '1px solid #2a2a2a',
              background: activeFilter === f
                ? 'linear-gradient(135deg, #FF0000, #FF4D8D)'
                : '#1a1a1a',
              color: activeFilter === f ? '#fff' : '#888',
              fontSize: 13,
              fontWeight: activeFilter === f ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeFilter === f ? '0 2px 12px rgba(255,0,0,0.3)' : 'none',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              if (activeFilter !== f) {
                e.currentTarget.style.borderColor = '#444';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={e => {
              if (activeFilter !== f) {
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.color = '#888';
              }
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Section heading */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: -0.5,
          marginBottom: 4,
          background: 'linear-gradient(90deg, #FF0000, #FF4D8D)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Recommended
        </h1>
        <p style={{ color: '#555', fontSize: 13 }}>Videos picked for you</p>
      </div>

      {/* Video grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 24,
      }}>
        {videos.map((video, index) => (
          <div
            key={video._id}
            style={{
              opacity: 0,
              animation: 'slideUp 0.4s ease forwards',
              animationDelay: `${index * 40}ms`,
            }}
          >
            <VideoCard video={video} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
