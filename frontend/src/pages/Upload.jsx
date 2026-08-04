import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoAPI } from '../api/video.api';
import toast from 'react-hot-toast';

export default function Upload() {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  // ── drag handlers ────────────────────────────────────────────────────────
  const handleVideoDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleVideoChange(e.dataTransfer.files[0]);
  };

  const handleVideoChange = (file) => {
    if (file?.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      toast.error('Please upload a valid video file');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) { setThumbnail(file); setThumbnailPreview(URL.createObjectURL(file)); }
  };

  // ── submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnail) return toast.error('Please select video and thumbnail');

    setLoading(true);
    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('videoFile', videoFile);
    uploadData.append('thumbnail', thumbnail);

    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => { if (prev >= 90) { clearInterval(interval); return prev; } return prev + 10; });
      }, 200);
      const response = await videoAPI.uploadVideo(uploadData);
      clearInterval(interval);
      setUploadProgress(100);
      toast.success('Video published!');
      setTimeout(() => navigate(`/watch/${response._id}`), 1000);
    } catch (error) {
      toast.error(error.message || 'Upload failed');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = videoFile && thumbnail && formData.title.trim() && formData.description.trim();
  const fileSizeMB = videoFile ? (videoFile.size / (1024 * 1024)).toFixed(1) : null;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.25rem 5rem' }}>

      <style>{`
        @keyframes up-fade { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dash-march { to { stroke-dashoffset: -20; } }
        @keyframes progress-glow { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .up-input {
          width:100%; padding:0.8rem 1rem; box-sizing:border-box;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08); border-radius:10px;
          color:#fff; font-size:0.9rem; outline:none; font-family:inherit;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        .up-input::placeholder { color:rgba(255,255,255,0.22); }
        .up-input:focus {
          border-color:rgba(220,38,38,0.55);
          box-shadow:0 0 0 3px rgba(220,38,38,0.1), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .up-card {
          background:rgba(18,18,20,0.7);
          border:1px solid rgba(255,255,255,0.07);
          border-top:1px solid rgba(255,255,255,0.12);
          border-radius:16px;
          backdrop-filter:blur(16px);
          -webkit-backdrop-filter:blur(16px);
        }
        .up-drop-svg-dash {
          animation: dash-march 0.6s linear infinite;
        }
        .up-pub-btn {
          position:relative; overflow:hidden;
          padding:0.875rem 2rem; border:none; border-radius:10px;
          background:linear-gradient(135deg,#dc2626,#db2777);
          color:#fff; font-size:0.95rem; font-weight:700;
          cursor:pointer; display:flex; align-items:center; gap:8px;
          box-shadow:0 4px 20px rgba(220,38,38,0.3);
          transition:opacity 0.2s, transform 0.15s;
        }
        .up-pub-btn:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
        .up-pub-btn:disabled { opacity:0.35; cursor:not-allowed; }
        .up-pub-btn::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);
          transform:translateX(-100%);
        }
        .up-pub-btn:hover:not(:disabled)::after {
          animation:shimmer-sweep 0.5s ease forwards;
        }
        @keyframes shimmer-sweep {
          from{transform:translateX(-100%) skewX(-10deg)}
          to{transform:translateX(200%) skewX(-10deg)}
        }
        .up-cancel-btn {
          padding:0.875rem 1.5rem; border-radius:10px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.09);
          color:rgba(255,255,255,0.55); font-size:0.95rem; font-weight:600;
          cursor:pointer; transition:background 0.2s, border-color 0.2s;
        }
        .up-cancel-btn:hover { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.16); }
        .up-section-label {
          font-size:0.72rem; font-weight:700; letter-spacing:0.08em;
          text-transform:uppercase; color:rgba(255,255,255,0.28);
          margin:0 0 0.875rem;
        }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <div style={{ marginBottom: '2rem', animation: 'up-fade 0.35s ease forwards' }}>
        <h1 style={{
          margin: '0 0 0.3rem', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
          fontWeight: 700, letterSpacing: '-0.02em', color: '#fff',
        }}>
          Upload video
        </h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.32)', fontSize: '0.875rem' }}>
          Share your content with the world
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── TWO-COLUMN GRID ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
          alignItems: 'start',
        }}>

          {/* ── LEFT: VIDEO DROP ZONE ── */}
          <div className="up-card" style={{ padding: '1.5rem', animation: 'up-fade 0.4s ease 0.05s both' }}>
            <p className="up-section-label">Video file</p>

            {!videoFile ? (
              /* DROP ZONE */
              <div
                onDragEnter={handleVideoDrag}
                onDragLeave={handleVideoDrag}
                onDragOver={handleVideoDrag}
                onDrop={handleVideoDrop}
                style={{
                  position: 'relative', borderRadius: 12,
                  padding: '3rem 1.5rem', textAlign: 'center',
                  background: dragActive ? 'rgba(220,38,38,0.06)' : 'rgba(255,255,255,0.02)',
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                }}
              >
                {/* Animated SVG dashed border */}
                <svg style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  borderRadius: 12, pointerEvents: 'none',
                }} preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
                  <rect
                    x="0.5" y="0.5" width="99" height="99" rx="12"
                    stroke={dragActive ? '#ef4444' : 'rgba(255,255,255,0.12)'}
                    strokeWidth="1"
                    strokeDasharray="10 4"
                    className={dragActive ? 'up-drop-svg-dash' : ''}
                    vectorEffect="non-scaling-stroke"
                    style={{ transition: 'stroke 0.2s' }}
                  />
                </svg>

                <div style={{
                  width: 64, height: 64, borderRadius: '50%', margin: '0 auto 1.25rem',
                  background: dragActive ? 'rgba(220,38,38,0.18)' : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}>
                  <svg width="28" height="28" fill="none" stroke={dragActive ? '#ef4444' : 'rgba(255,255,255,0.35)'} viewBox="0 0 24 24" strokeWidth="1.5" style={{ transition: 'stroke 0.2s' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>

                <p style={{ margin: '0 0 0.4rem', fontWeight: 600, fontSize: '0.95rem', color: dragActive ? '#ef4444' : 'rgba(255,255,255,0.75)', transition: 'color 0.2s' }}>
                  {dragActive ? 'Drop to add' : 'Drag your video here'}
                </p>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.28)' }}>
                  MP4, WebM or MOV — up to 100 MB
                </p>

                <label style={{ cursor: 'pointer' }}>
                  <span style={{
                    display: 'inline-block', padding: '0.55rem 1.5rem',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                    fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)',
                    background: 'rgba(255,255,255,0.05)',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  >
                    Browse files
                  </span>
                  <input type="file" accept="video/*" onChange={e => handleVideoChange(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>
            ) : (
              /* VIDEO PREVIEW */
              <div style={{ animation: 'up-fade 0.3s ease forwards' }}>
                <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <video src={videoPreview} controls style={{ width: '100%', maxHeight: 280, objectFit: 'contain', display: 'block' }} />

                  {/* File badge */}
                  <div style={{
                    position: 'absolute', bottom: 8, left: 8,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
                    borderRadius: 6, padding: '3px 8px',
                    fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>
                    {fileSizeMB} MB
                  </div>

                  <button type="button" onClick={() => { setVideoFile(null); setVideoPreview(null); }} style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'rgba(220,38,38,0.9)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                  }}>
                    <svg width="12" height="12" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div style={{
                  marginTop: '0.75rem', padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(34,197,94,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" fill="none" stroke="#22c55e" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {videoFile.name}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>Ready to upload</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* THUMBNAIL */}
            <div className="up-card" style={{ padding: '1.5rem', animation: 'up-fade 0.4s ease 0.1s both' }}>
              <p className="up-section-label">Thumbnail</p>

              {!thumbnailPreview ? (
                <label style={{ display: 'block', cursor: 'pointer' }}>
                  <div style={{
                    borderRadius: 10, padding: '1.75rem 1rem', textAlign: 'center',
                    border: '1px dashed rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(220,38,38,0.35)'; e.currentTarget.style.background = 'rgba(220,38,38,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  >
                    <svg width="24" height="24" fill="none" stroke="rgba(255,255,255,0.28)" viewBox="0 0 24 24" strokeWidth="1.5" style={{ margin: '0 auto 0.75rem', display: 'block' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p style={{ margin: '0 0 0.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Add thumbnail</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.22)' }}>1280×720 recommended</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} style={{ display: 'none' }} />
                </label>
              ) : (
                <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', animation: 'up-fade 0.3s ease forwards' }}>
                  <img src={thumbnailPreview} alt="Thumbnail" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                  <button type="button" onClick={() => { setThumbnail(null); setThumbnailPreview(null); }} style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'rgba(220,38,38,0.9)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* DETAILS */}
            <div className="up-card" style={{ padding: '1.5rem', animation: 'up-fade 0.4s ease 0.15s both' }}>
              <p className="up-section-label">Details</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.45)', marginBottom: '0.4rem' }}>
                    Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Give your video a title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="up-input"
                    maxLength={100}
                    required
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.3rem' }}>
                    <span style={{ fontSize: '0.72rem', color: formData.title.length > 80 ? '#ef4444' : 'rgba(255,255,255,0.2)' }}>
                      {formData.title.length}/100
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.45)', marginBottom: '0.4rem' }}>
                    Description <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    placeholder="Tell viewers what your video is about"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="up-input"
                    rows={5}
                    maxLength={5000}
                    required
                    style={{ resize: 'vertical', minHeight: 110 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.3rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>
                      {formData.description.length}/5000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── UPLOAD PROGRESS ── */}
        {loading && (
          <div className="up-card" style={{
            marginTop: '1.25rem', padding: '1.5rem',
            animation: 'up-fade 0.3s ease forwards',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <svg style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} width="15" height="15" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                  <path fill="#ef4444" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
                  {uploadProgress < 100 ? 'Uploading…' : 'Processing…'}
                </span>
              </div>
              <span style={{
                fontSize: '1.1rem', fontWeight: 800,
                color: uploadProgress === 100 ? '#22c55e' : '#ef4444',
                letterSpacing: '-0.02em',
                transition: 'color 0.3s',
              }}>
                {uploadProgress}%
              </span>
            </div>

            {/* Progress bar */}
            <div style={{
              height: 4, borderRadius: 2,
              background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: uploadProgress === 100
                  ? 'linear-gradient(90deg,#16a34a,#22c55e)'
                  : 'linear-gradient(90deg,#dc2626,#ef4444)',
                width: `${uploadProgress}%`,
                transition: 'width 0.4s ease, background 0.4s',
                boxShadow: uploadProgress === 100
                  ? '0 0 8px rgba(34,197,94,0.5)'
                  : '0 0 8px rgba(220,38,38,0.5)',
              }} />
            </div>

            <p style={{ margin: '0.6rem 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
              {uploadProgress < 100 ? 'Keep this page open until the upload finishes' : 'Almost there — finalising your video'}
            </p>
          </div>
        )}

        {/* ── ACTIONS ── */}
        {!loading && (
          <div style={{
            marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
            animation: 'up-fade 0.4s ease 0.2s both',
          }}>
            <button type="button" onClick={() => navigate(-1)} className="up-cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={!canSubmit} className="up-pub-btn">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Publish video
            </button>
          </div>
        )}
      </form>

      <style>{`@keyframes spin { to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
