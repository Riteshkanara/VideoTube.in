import { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/formatDate';
import { formatDuration } from '../../utils/formatDuration';
import { formatViews } from '../../utils/formatViews';
import { optimizeCloudinaryUrl } from '../../utils/cloudinaryImage.js';

export default function VideoCard({ video, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      to={`/watch/${video._id}`}
      style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        opacity: 0,
        animation: `cardIn 0.38s ease forwards`,
        animationDelay: `${Math.min(index * 35, 400)}ms`,
      }}>

        {/* ── Thumbnail ── */}
        <div style={{
          position: 'relative',
          aspectRatio: '16/9',
          borderRadius: 14,
          overflow: 'hidden',
          background: '#141414',
          border: `1px solid ${hovered ? '#2a2a2a' : '#181818'}`,
          transition: 'border-color 0.25s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          boxShadow: hovered
            ? '0 16px 48px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.5)'
            : '0 2px 8px rgba(0,0,0,0.3)',
        }}>

          {/* Skeleton shimmer while loading */}
          {!imgLoaded && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, #161616 25%, #1e1e1e 50%, #161616 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite',
            }} />
          )}

          <img
            src={optimizeCloudinaryUrl(video.thumbnail, 640)}
            alt={video.title}
            width={640}
            height={360}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={e => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIGZpbGw9IiMxNDE0MTQiLz48cGF0aCBkPSJNNTYwIDMwMEw3MjAgNDIwTDU2MCA1NDBWMZ==';
              setImgLoaded(true);
            }}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
              opacity: imgLoaded ? 1 : 0,
              transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}
          />

          {/* Bottom gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 45%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }} />

          {/* Duration badge */}
          {video.duration && (
            <div style={{
              position: 'absolute', bottom: 8, right: 8,
              padding: '3px 7px',
              background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(6px)',
              borderRadius: 5,
              fontSize: 11.5,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: 0.4,
              fontFamily: 'system-ui, monospace',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'opacity 0.2s',
              opacity: hovered ? 0 : 1,
            }}>
              {formatDuration(video.duration)}
            </div>
          )}

          {/* Play button */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.22s',
          }}>
            <div style={{
              width: 50, height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF2222, #FF4D8D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 24px rgba(255,34,34,0.55)',
              transform: hovered ? 'scale(1)' : 'scale(0.75)',
              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Duration on hover bottom-left */}
          {video.duration && (
            <div style={{
              position: 'absolute', bottom: 10, left: 10,
              fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.2s',
              letterSpacing: 0.3,
            }}>
              {formatDuration(video.duration)}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          padding: '11px 2px 0',
        }}>

          {/* Avatar */}
          <div style={{ flexShrink: 0, marginTop: 1 }}>
            <div style={{
              borderRadius: '50%',
              border: `2px solid ${hovered ? 'rgba(255,34,34,0.4)' : 'transparent'}`,
              transition: 'border-color 0.2s',
              lineHeight: 0,
            }}>
              <Avatar src={video.owner?.avatar} alt={video.owner?.fullName} size="md" />
            </div>
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              margin: '0 0 4px',
              fontSize: 13.5,
              fontWeight: 600,
              color: hovered ? '#fff' : '#e0e0e0',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'color 0.2s',
              letterSpacing: '-0.01em',
            }}>
              {video.title}
            </h3>

            <p style={{
              margin: '0 0 5px',
              fontSize: 12.5,
              color: hovered ? '#888' : '#555',
              fontWeight: 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'color 0.2s',
            }}>
              {video.owner?.fullName}
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '4px 6px',
              fontSize: 11.5,
              color: '#3a3a3a',
            }}>
              <span>{formatViews(video?.views || 0)} views</span>
              <span style={{ color: '#252525' }}>·</span>
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </article>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }
      `}</style>
    </Link>
  );
}
