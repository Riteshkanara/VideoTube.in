import { useEffect, useRef, useState, useCallback } from 'react';

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (s) => {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

// ── icons (inline SVG, no deps) ───────────────────────────────────────────────
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const VolumeHighIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);
const VolumeLowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
  </svg>
);
const MuteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);
const FullscreenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </svg>
);
const ExitFullscreenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
  </svg>
);
const ReplayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
  </svg>
);

// ── component ─────────────────────────────────────────────────────────────────
export default function VideoPlayer({ src, thumbnail }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const scrubberRef = useRef(null);
  const hideTimer = useRef(null);
  const volumeBeforeMute = useRef(1);

  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSpeed, setShowSpeed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [scrubHover, setScrubHover] = useState(null); // { x, time }
  const [showBigIcon, setShowBigIcon] = useState(null); // 'play' | 'pause' | 'rewind' | 'forward'

  // ── show/hide controls ───────────────────────────────────────────────────
  const showControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
    }
  }, [playing]);

  useEffect(() => {
    if (!playing) {
      clearTimeout(hideTimer.current);
      setControlsVisible(true);
    } else {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
    }
    return () => clearTimeout(hideTimer.current);
  }, [playing]);

  // ── video events ─────────────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => { setPlaying(true); setEnded(false); };
    const onPause = () => setPlaying(false);
    const onEnded = () => { setPlaying(false); setEnded(true); setControlsVisible(true); };
    const onTime = () => {
      setCurrentTime(v.currentTime);
      if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1));
    };
    const onMeta = () => setDuration(v.duration);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
    };
  }, [src]);

  // ── fullscreen sync ───────────────────────────────────────────────────────
  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // ── keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const v = videoRef.current;
      if (!v) return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          v.currentTime = Math.max(0, v.currentTime - 10);
          flashIcon('rewind');
          break;
        case 'ArrowRight':
          e.preventDefault();
          v.currentTime = Math.min(v.duration, v.currentTime + 10);
          flashIcon('forward');
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playing, muted]);

  // ── helpers ───────────────────────────────────────────────────────────────
  const flashIcon = (type) => {
    setShowBigIcon(type);
    setTimeout(() => setShowBigIcon(null), 600);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (ended) { v.currentTime = 0; v.play(); return; }
    if (v.paused) { v.play(); flashIcon('play'); }
    else { v.pause(); flashIcon('pause'); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!muted) {
      volumeBeforeMute.current = volume;
      v.muted = true;
      setMuted(true);
    } else {
      v.muted = false;
      setMuted(false);
      setVolume(volumeBeforeMute.current);
      v.volume = volumeBeforeMute.current;
    }
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleVolumeChange = (e) => {
    const v = videoRef.current;
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (v) { v.volume = val; v.muted = val === 0; }
    setMuted(val === 0);
  };

  const handleSpeedChange = (s) => {
    if (videoRef.current) videoRef.current.playbackRate = s;
    setSpeed(s);
    setShowSpeed(false);
  };

  // Scrubber: click / drag
  const getScrubTime = (e) => {
    const rect = scrubberRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    return ratio * duration;
  };

  const handleScrubberClick = (e) => {
    const t = getScrubTime(e);
    if (videoRef.current) videoRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const handleScrubberMouseMove = (e) => {
    const rect = scrubberRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setScrubHover({ x: ratio * 100, time: ratio * duration });
  };

  if (!src) return <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: 12 }} />;

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={showControls}
      onMouseLeave={() => playing && setControlsVisible(false)}
      onClick={togglePlay}
      style={{
        position: 'relative',
        aspectRatio: '16/9',
        background: '#000',
        borderRadius: fullscreen ? 0 : 12,
        overflow: 'hidden',
        cursor: controlsVisible ? 'default' : 'none',
        userSelect: 'none',
      }}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        key={src}
        src={src}
        poster={thumbnail}
        controlsList="nodownload"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        preload="metadata"
        onError={(e) => console.error('Video error:', e)}
      />

      {/* BIG CENTER ICON FLASH */}
      {showBigIcon && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', zIndex: 10,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', animation: 'vp-flash 0.6s ease forwards',
          }}>
            {showBigIcon === 'play' && <PlayIcon />}
            {showBigIcon === 'pause' && <PauseIcon />}
            {showBigIcon === 'rewind' && <span style={{ fontSize: 13, fontWeight: 700 }}>−10s</span>}
            {showBigIcon === 'forward' && <span style={{ fontSize: 13, fontWeight: 700 }}>+10s</span>}
          </div>
        </div>
      )}

      {/* CONTROLS OVERLAY */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          padding: '40px 16px 14px',
          transition: 'opacity 0.3s',
          opacity: controlsVisible ? 1 : 0,
          pointerEvents: controlsVisible ? 'auto' : 'none',
          zIndex: 5,
        }}
      >
        {/* SCRUBBER */}
        <div
          ref={scrubberRef}
          onClick={handleScrubberClick}
          onMouseMove={handleScrubberMouseMove}
          onMouseLeave={() => setScrubHover(null)}
          style={{
            position: 'relative', height: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', marginBottom: 10,
          }}
        >
          {/* Track */}
          <div style={{
            position: 'absolute', left: 0, right: 0,
            height: 3, borderRadius: 2,
            background: 'rgba(255,255,255,0.15)',
            transition: 'height 0.15s',
          }} className="vp-track" />
          {/* Buffered */}
          <div style={{
            position: 'absolute', left: 0, width: `${bufferedPct}%`,
            height: 3, borderRadius: 2,
            background: 'rgba(255,255,255,0.28)',
          }} />
          {/* Progress */}
          <div style={{
            position: 'absolute', left: 0, width: `${progress}%`,
            height: 3, borderRadius: 2,
            background: 'linear-gradient(90deg, #dc2626, #ef4444)',
            transition: 'width 0.1s linear',
          }} />
          {/* Thumb */}
          <div style={{
            position: 'absolute', left: `${progress}%`,
            transform: 'translateX(-50%)',
            width: 12, height: 12, borderRadius: '50%',
            background: '#ef4444',
            boxShadow: '0 0 6px rgba(220,38,38,0.8)',
            transition: 'left 0.1s linear',
          }} />
          {/* Hover time tooltip */}
          {scrubHover && (
            <div style={{
              position: 'absolute', bottom: 18,
              left: `clamp(20px, ${scrubHover.x}%, calc(100% - 20px))`,
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.85)',
              color: '#fff', fontSize: 11, fontWeight: 600,
              padding: '2px 6px', borderRadius: 4,
              pointerEvents: 'none', whiteSpace: 'nowrap',
            }}>
              {fmt(scrubHover.time)}
            </div>
          )}
        </div>

        {/* BOTTOM ROW */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Play / Pause / Replay */}
          <button onClick={ended ? () => { videoRef.current.currentTime = 0; videoRef.current.play(); } : togglePlay}
            style={btnStyle}>
            {ended ? <ReplayIcon /> : playing ? <PauseIcon /> : <PlayIcon />}
          </button>

          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={toggleMute} style={btnStyle}>
              {muted || volume === 0 ? <MuteIcon /> : volume < 0.5 ? <VolumeLowIcon /> : <VolumeHighIcon />}
            </button>
            <input
              type="range" min="0" max="1" step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              style={{
                width: 70, height: 3, accentColor: '#ef4444', cursor: 'pointer',
                background: `linear-gradient(90deg, #ef4444 ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 0)`,
                borderRadius: 2, outline: 'none', border: 'none',
                WebkitAppearance: 'none', appearance: 'none',
              }}
            />
          </div>

          {/* Time */}
          <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 500, letterSpacing: '0.02em', marginLeft: 2 }}>
            {fmt(currentTime)} / {fmt(duration)}
          </span>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Speed picker */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowSpeed(!showSpeed); }}
              style={{ ...btnStyle, fontSize: 12, fontWeight: 700, letterSpacing: '0.02em', minWidth: 36 }}
            >
              {speed}×
            </button>
            {showSpeed && (
              <div style={{
                position: 'absolute', bottom: 36, right: 0,
                background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                zIndex: 20,
              }}>
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].reverse().map((s) => (
                  <button key={s} onClick={() => handleSpeedChange(s)} style={{
                    display: 'block', width: '100%', padding: '7px 20px',
                    background: speed === s ? 'rgba(220,38,38,0.2)' : 'transparent',
                    color: speed === s ? '#ef4444' : 'rgba(255,255,255,0.75)',
                    border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: speed === s ? 700 : 400,
                    textAlign: 'left', whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => { if (speed !== s) e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={e => { if (speed !== s) e.target.style.background = 'transparent'; }}
                  >
                    {s === 1 ? 'Normal' : `${s}×`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} style={btnStyle}>
            {fullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
          </button>
        </div>
      </div>

      {/* KEYBOARD HINT (shown on first hover, fades) */}
      <style>{`
        @keyframes vp-flash { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.4)} }
        .vp-track:hover { height: 5px !important; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 12px; height: 12px;
          border-radius: 50%; background: #ef4444; cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 12px; height: 12px; border-radius: 50%;
          background: #ef4444; cursor: pointer; border: none;
        }
      `}</style>
    </div>
  );
}

const btnStyle = {
  background: 'none', border: 'none', color: '#fff',
  cursor: 'pointer', padding: '4px 6px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 6, transition: 'background 0.15s, color 0.15s',
  opacity: 0.85,
};
