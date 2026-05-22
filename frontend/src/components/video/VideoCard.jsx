import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/formatDate';
import { formatDuration } from '../../utils/formatDuration';
import { formatViews } from '../../utils/formatViews';
import { optimizeCloudinaryUrl } from '../../utils/cloudinaryImage.js';

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video._id}`} className="group block" style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Thumbnail */}
        <div style={{
          position: 'relative',
          aspectRatio: '16/9',
          borderRadius: 14,
          overflow: 'hidden',
          background: '#1a1a1a',
          border: '1px solid #1e1e1e',
          transition: 'border-color 0.25s, box-shadow 0.25s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#333';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#1e1e1e';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <img
            src={optimizeCloudinaryUrl(video.thumbnail, 640)}
            alt={video.title}
            width={640}
            height={360}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              display: 'block',
            }}
            className="group-hover:scale-thumb"
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onError={e => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIGZpbGw9IiMxQTFBMUEiLz48cGF0aCBkPSJNNTUwIDI4NUw3MzAgNDM1TDU1MCA1ODVWMjg1WiIgZmlsbD0iI0ZGMDAwMCIvPjwvc3ZnPg==';
            }}
          />

          {/* Dark gradient on hover */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
            opacity: 0,
            transition: 'opacity 0.3s',
          }} className="thumb-overlay" />

          {/* Duration badge */}
          {video.duration && (
            <div style={{
              position: 'absolute', bottom: 10, right: 10,
              padding: '3px 8px',
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(4px)',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: 0.3,
            }}>
              {formatDuration(video.duration)}
            </div>
          )}

          {/* Play button on hover */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.25s',
          }} className="play-overlay">
            <div style={{
              width: 52, height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF0000, #FF4D8D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(255,0,0,0.5)',
              transform: 'scale(0.85)',
              transition: 'transform 0.25s',
            }} className="play-btn-inner">
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24" style={{ marginLeft: 3 }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Info row */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          {/* Channel avatar */}
          <div style={{ flexShrink: 0, marginTop: 2 }}>
            <Avatar src={video.owner?.avatar} alt={video.owner?.fullName} size="md" />
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <h3 style={{
              margin: '0 0 4px',
              fontSize: 14,
              fontWeight: 600,
              color: '#f1f1f1',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'color 0.2s',
            }} className="video-title">
              {video.title}
            </h3>

            {/* Channel name */}
            <p style={{
              margin: '0 0 4px',
              fontSize: 13,
              color: '#888',
              fontWeight: 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'color 0.2s',
            }} className="video-channel">
              {video.owner?.fullName}
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, color: '#666',
            }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{formatViews(video?.views || 0)} views</span>
              <span style={{ color: '#444' }}>•</span>
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scoped hover styles */}
      <style>{`
        a:hover .thumb-overlay { opacity: 1 !important; }
        a:hover .play-overlay  { opacity: 1 !important; }
        a:hover .play-btn-inner { transform: scale(1) !important; }
        a:hover .video-title   { color: #FF4D4D !important; }
        a:hover .video-channel { color: #aaa !important; }
      `}</style>
    </Link>
  );
}
