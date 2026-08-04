import { useEffect, useState, useCallback } from 'react';
import { videoAPI } from '../api/video.api';
import VideoCard from '../components/video/VideoCard';
import toast from 'react-hot-toast';

const FILTERS = [
  { label: 'All',       value: 'all' },
  { label: '🔥 Trending', value: 'trending' },
  { label: 'Music',     value: 'music' },
  { label: 'Gaming',    value: 'gaming' },
  { label: 'Tech',      value: 'tech' },
  { label: 'Science',   value: 'science' },
  { label: 'News',      value: 'news' },
  { label: 'Sports',    value: 'sports' },
  { label: 'Live',      value: 'live' },
  { label: 'Education', value: 'education' },
];

/* ─── Skeleton card ─────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{
        aspectRatio: '16/9', borderRadius: 14,
        background: 'linear-gradient(90deg, #141414 25%, #1c1c1c 50%, #141414 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonPulse 1.5s infinite',
      }} />
      <div style={{ display: 'flex', gap: 10, padding: '11px 2px 0' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: '#1a1a1a', animation: 'skeletonPulse 1.5s infinite',
        }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 2 }}>
          <div style={{ height: 13, borderRadius: 6, background: '#1a1a1a', animation: 'skeletonPulse 1.5s infinite' }} />
          <div style={{ height: 13, borderRadius: 6, background: '#1a1a1a', width: '75%', animation: 'skeletonPulse 1.5s infinite' }} />
          <div style={{ height: 11, borderRadius: 6, background: '#161616', width: '45%', animation: 'skeletonPulse 1.5s infinite' }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────────── */
export default function Home() {
  const [videos, setVideos]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [scrolled, setScrolled]       = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ─── Error ─── */
  if (error) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', gap: 20, textAlign: 'center',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(255,34,34,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255,34,34,0.15)',
        }}>
          <svg width="34" height="34" fill="none" stroke="#FF4444" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: 19, fontWeight: 600, color: '#e0e0e0', marginBottom: 6 }}>
            Something went wrong
          </h2>
          <p style={{ color: '#444', fontSize: 14 }}>We couldn't load your feed right now.</p>
        </div>
        <button
          onClick={loadVideos}
          style={{
            padding: '10px 24px', borderRadius: 10,
            background: 'linear-gradient(135deg, #FF2222, #FF4D8D)',
            border: 'none', color: '#fff', fontWeight: 600,
            fontSize: 14, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255,34,34,0.3)',
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  /* ─── Empty ─── */
  const isEmpty = !loading && (!Array.isArray(videos) || videos.length === 0);

  return (
    <div style={{ paddingBottom: 60 }}>

      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { background-position: 200% 0; }
          50%       { background-position: -200% 0; }
        }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes filterIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .filter-chip { transition: all 0.18s ease; }
        .filter-chip:hover { transform: translateY(-1px); }
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px 24px;
        }
        @media (max-width: 640px) {
          .video-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .video-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* ─── Hero strip ─── */}
      <div style={{
        marginBottom: 28,
        padding: '22px 0 24px',
        borderBottom: '1px solid #141414',
        animation: 'heroIn 0.4s ease forwards',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <p style={{
              margin: '0 0 4px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#FF2222',
            }}>
              For you
            </p>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(22px, 3vw, 28px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#f0f0f0',
              lineHeight: 1.15,
            }}>
              Your feed
            </h1>
          </div>

          {/* Live dot */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '6px 12px',
            borderRadius: 100,
            background: 'rgba(255,34,34,0.08)',
            border: '1px solid rgba(255,34,34,0.14)',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#FF2222',
              animation: 'livePulse 2s infinite',
              display: 'inline-block',
            }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#FF4444', letterSpacing: '0.04em' }}>
              LIVE
            </span>
          </div>
        </div>

        <style>{`
          @keyframes livePulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255,34,34,0.5); }
            50%       { box-shadow: 0 0 0 5px rgba(255,34,34,0); }
          }
        `}</style>
      </div>

      {/* ─── Filter chips ─── */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 32,
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none',
        animation: 'filterIn 0.4s ease 0.1s both',
      }}>
        <style>{`.filter-bar::-webkit-scrollbar { display: none; }`}</style>
        {FILTERS.map((f, i) => {
          const active = activeFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className="filter-chip"
              style={{
                flexShrink: 0,
                padding: '7px 16px',
                borderRadius: 100,
                border: active
                  ? '1px solid rgba(255,34,34,0.35)'
                  : '1px solid #1e1e1e',
                background: active
                  ? 'linear-gradient(135deg, rgba(255,34,34,0.2), rgba(255,77,141,0.14))'
                  : '#141414',
                color: active ? '#fff' : '#4a4a4a',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: active ? '0 2px 16px rgba(255,34,34,0.2)' : 'none',
                animation: `filterIn 0.3s ease ${i * 30}ms both`,
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ─── Empty state ─── */}
      {isEmpty && (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          minHeight: '50vh', gap: 20, textAlign: 'center',
          animation: 'heroIn 0.4s ease forwards',
        }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: '#111',
            border: '1px solid #1e1e1e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="38" height="38" fill="none" stroke="#2a2a2a" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#444', marginBottom: 6 }}>
              No videos yet
            </h2>
            <p style={{ color: '#2a2a2a', fontSize: 13.5 }}>
              Be the first to upload something.
            </p>
          </div>
          <button
            onClick={loadVideos}
            style={{
              padding: '9px 22px', borderRadius: 10,
              background: '#1a1a1a',
              border: '1px solid #222',
              color: '#555', fontWeight: 500,
              fontSize: 13.5, cursor: 'pointer',
            }}
          >
            Refresh
          </button>
        </div>
      )}

      {/* ─── Video grid ─── */}
      <div className="video-grid">
        {loading
          ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
          : videos.map((video, i) => (
              <VideoCard key={video._id} video={video} index={i} />
            ))
        }
      </div>

      {/* ─── End of feed ─── */}
      {!loading && videos.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          marginTop: 56, opacity: 0.35,
        }}>
          <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
          <span style={{ fontSize: 12, color: '#333', fontWeight: 500, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            You're all caught up
          </span>
          <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
        </div>
      )}
    </div>
  );
}
