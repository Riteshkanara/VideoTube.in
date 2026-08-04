import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoAPI } from '../api/video.api.js';
import { likeAPI } from '../api/like.api';
import { subscriptionAPI } from '../api/subscription.api.js';
import VideoPlayer from '../components/video/VideoPlayer';
import Avatar from '../components/common/Avatar';
import Loader from '../components/common/Loader';
import CommentList from '../components/comment/CommentList';
import { formatViews } from '../utils/formatViews';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';
import useAuthStore from '../store/auth.store.js';

export default function VideoWatch() {
  const { videoId } = useParams();
  const { isAuthenticated, user } = useAuthStore();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    if (videoId) loadVideo();
  }, [videoId]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const response = await videoAPI.getVideoById(videoId);
      setVideo(response);
      setIsLiked(Boolean(response.isLiked));
      setIsSubscribed(Boolean(response.isSubscribed));
      setLikesCount(response.likesCount || 0);
      if (isAuthenticated) {
        videoAPI.addToWatchHistory(videoId).catch(() => {});
      }
    } catch {
      toast.error('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return toast.error('Please login to like');
    if (likeLoading) return;
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount(prev => prevLiked ? Math.max(0, prev - 1) : prev + 1);
    setLikeLoading(true);
    try {
      const res = await likeAPI.toggleVideoLike(videoId);
      if (res && typeof res.isLiked !== 'undefined') setIsLiked(res.isLiked);
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error('Failed to like video');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) return toast.error('Please login to subscribe');
    if (video?.owner?._id === user?._id) return toast.error("You can't subscribe to your own channel");
    if (subscribeLoading) return;
    const prev = isSubscribed;
    setIsSubscribed(!prev);
    setSubscribeLoading(true);
    try {
      const res = await subscriptionAPI.toggleSubscription(video.owner._id);
      if (res && typeof res.isSubscribed !== 'undefined') {
        setIsSubscribed(res.isSubscribed);
        toast.success(res.isSubscribed ? 'Subscribed!' : 'Unsubscribed');
      }
    } catch (err) {
      setIsSubscribed(prev);
      toast.error(err?.response?.data?.message || 'Subscription failed');
    } finally {
      setSubscribeLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (loading) return <Loader />;
  if (!video) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>
      Video not found
    </div>
  );

  const isOwner = video?.owner?._id === user?._id;
  const descLines = (video.description || '').split('\n');
  const descLong = descLines.length > 3 || (video.description || '').length > 200;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1.5rem 1.25rem 4rem' }}>
      <style>{`
        @keyframes vw-fade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .vw-like-btn { transition: background 0.2s, border-color 0.2s, transform 0.15s; }
        .vw-like-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .vw-like-btn:active:not(:disabled) { transform: scale(0.96); }
        .vw-sub-btn { transition: background 0.2s, box-shadow 0.2s, transform 0.15s; }
        .vw-sub-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .vw-sub-btn:active:not(:disabled) { transform: scale(0.96); }
        .vw-share-btn { transition: background 0.2s, border-color 0.2s; }
        .vw-share-btn:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.2) !important; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>

        {/* ── VIDEO PLAYER ── */}
        <div style={{
          borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
          animation: 'vw-fade 0.4s ease forwards',
        }}>
          <VideoPlayer src={video?.videoFile} thumbnail={video?.thumbnail} />
        </div>

        {/* ── TITLE ── */}
        <div style={{ animation: 'vw-fade 0.4s ease 0.05s both' }}>
          <h1 style={{
            margin: 0, fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            fontWeight: 700, color: '#fff', lineHeight: 1.35,
            letterSpacing: '-0.01em',
          }}>
            {video.title}
          </h1>
        </div>

        {/* ── CHANNEL BAR ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: '1rem',
          padding: '1rem 1.25rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderTop: '1px solid rgba(255,255,255,0.11)',
          borderRadius: 14,
          backdropFilter: 'blur(12px)',
          animation: 'vw-fade 0.4s ease 0.1s both',
        }}>
          {/* Left: Avatar + name + sub count + subscribe */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
            <Link to={`/channel/${video.owner?.username}`} style={{ flexShrink: 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.12)',
                overflow: 'hidden', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(220,38,38,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              >
                <Avatar src={video.owner?.avatar} alt={video.owner?.fullName} size="lg" />
              </div>
            </Link>

            <div style={{ lineHeight: 1.3 }}>
              <Link to={`/channel/${video.owner?.username}`} style={{ textDecoration: 'none' }}>
                <p style={{
                  margin: 0, fontWeight: 600, fontSize: '0.95rem', color: '#fff',
                  transition: 'color 0.15s',
                }}
                  onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                  onMouseLeave={e => e.target.style.color = '#fff'}
                >
                  {video.owner?.fullName}
                </p>
              </Link>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.38)', marginTop: 1 }}>
                {formatViews(video.owner?.subscribersCount || 0)} subscribers
              </p>
            </div>

            {/* Subscribe */}
            {!isOwner && (
              <button
                onClick={handleSubscribe}
                disabled={subscribeLoading}
                className="vw-sub-btn"
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 8, fontWeight: 700, fontSize: '0.875rem',
                  cursor: subscribeLoading ? 'not-allowed' : 'pointer',
                  border: 'none', letterSpacing: '0.01em',
                  ...(isSubscribed ? {
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.7)',
                    boxShadow: 'none',
                  } : {
                    background: '#fff',
                    color: '#000',
                    boxShadow: '0 0 20px rgba(255,255,255,0.15)',
                  }),
                  opacity: subscribeLoading ? 0.6 : 1,
                }}
              >
                {subscribeLoading ? '…' : isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>

          {/* Right: Like + Share */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {/* Like */}
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className="vw-like-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0.5rem 1.1rem', borderRadius: 8,
                fontWeight: 600, fontSize: '0.875rem', cursor: likeLoading ? 'not-allowed' : 'pointer',
                border: `1px solid ${isLiked ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
                background: isLiked ? 'rgba(220,38,38,0.15)' : 'transparent',
                color: isLiked ? '#ef4444' : 'rgba(255,255,255,0.65)',
                opacity: likeLoading ? 0.6 : 1,
              }}
            >
              <svg
                width="18" height="18" viewBox="0 0 24 24" strokeWidth="2"
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                style={{ transition: 'fill 0.2s' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{formatViews(likesCount)}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="vw-share-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '0.5rem 1.1rem', borderRadius: 8,
                fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent', color: 'rgba(255,255,255,0.55)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span style={{ display: 'inline' }}>Share</span>
            </button>
          </div>
        </div>

        {/* ── DESCRIPTION ── */}
        <div style={{
          padding: '1rem 1.25rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14,
          animation: 'vw-fade 0.4s ease 0.15s both',
        }}>
          {/* Metadata chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {[
              `${formatViews(video.views)} views`,
              formatDate(video.createdAt),
            ].map((chip) => (
              <span key={chip} style={{
                padding: '0.2rem 0.65rem', borderRadius: 6,
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 500,
              }}>{chip}</span>
            ))}
          </div>

          {/* Description text */}
          {video.description ? (
            <>
              <p style={{
                margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem',
                lineHeight: 1.7, whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: descExpanded ? 'unset' : 3,
              }}>
                {video.description}
              </p>
              {descLong && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  style={{
                    marginTop: '0.5rem', background: 'none', border: 'none',
                    color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem',
                    fontWeight: 600, cursor: 'pointer', padding: 0,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                >
                  {descExpanded ? 'Show less ↑' : 'Show more ↓'}
                </button>
              )}
            </>
          ) : (
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem', fontStyle: 'italic' }}>
              No description provided.
            </p>
          )}
        </div>

        {/* ── COMMENTS ── */}
        <div style={{ animation: 'vw-fade 0.4s ease 0.2s both' }}>
          <CommentList videoId={videoId} />
        </div>

      </div>
    </div>
  );
}
