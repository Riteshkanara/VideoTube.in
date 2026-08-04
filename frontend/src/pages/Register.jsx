import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth.api';
import Logo from '../components/common/Logo';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!avatar) {
      toast.error('Please upload an avatar');
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('fullName', formData.fullName);
    data.append('password', formData.password);
    data.append('avatar', avatar);
    if (coverImage) data.append('coverImage', coverImage);
    try {
      await authAPI.register(data);
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.username || !formData.email || !formData.fullName) {
        toast.error('Please fill in all fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const stepLabels = ['Basic Info', 'Security', 'Profile'];

  const getPasswordStrength = () => {
    const len = formData.password.length;
    if (len === 0) return { bars: 0, label: 'Use 8 or more characters', color: '' };
    if (len < 6)   return { bars: 1, label: 'Weak', color: '#ef4444' };
    if (len < 9)   return { bars: 2, label: 'Fair', color: '#f97316' };
    if (len < 12)  return { bars: 3, label: 'Good', color: '#eab308' };
    return { bars: 4, label: 'Strong', color: '#22c55e' };
  };
  const strength = getPasswordStrength();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 70% 0%, rgba(120,0,0,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 100%, rgba(90,0,60,0.14) 0%, transparent 55%), #0a0a0b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Ambient film grain overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
        backgroundSize: '200px 200px', opacity: 0.4,
      }} />

      {/* Keyframe styles */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { transform: translateX(-100%) skewX(-12deg); }
          to   { transform: translateX(250%) skewX(-12deg); }
        }
        .step-form-enter { animation: fadeSlideUp 0.35s ease forwards; }
        .register-input {
          width: 100%; padding: 0.875rem 1rem 0.875rem 2.75rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; color: #fff; font-size: 0.9rem;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .register-input::placeholder { color: rgba(255,255,255,0.25); }
        .register-input:focus {
          border-color: rgba(220,38,38,0.6);
          box-shadow: 0 0 0 3px rgba(220,38,38,0.12), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .register-input:focus + .input-icon,
        .input-wrap:focus-within .input-icon { color: #ef4444; }
        .shimmer-btn {
          position: relative; overflow: hidden;
          width: 100%; padding: 0.875rem;
          background: linear-gradient(135deg, #dc2626, #db2777);
          border: none; border-radius: 10px;
          color: #fff; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 24px rgba(220,38,38,0.28);
        }
        .shimmer-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .shimmer-btn:hover:not(:disabled)::after {
          content: '';
          position: absolute; top: 0; left: 0;
          width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: shimmer 0.55s ease forwards;
        }
        .shimmer-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .back-btn {
          flex: 1; padding: 0.875rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: rgba(255,255,255,0.7);
          font-size: 0.95rem; font-weight: 600; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); }
      `}</style>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '520px', position: 'relative', zIndex: 1,
        animation: 'fadeSlideUp 0.45s ease forwards',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Link to="/">
            <Logo variant="premium" size="xl" />
          </Link>
        </div>

        {/* Glass card */}
        <div style={{
          background: 'rgba(18,18,20,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4)',
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.4rem',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.65) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', letterSpacing: '-0.02em',
            }}>
              Create your account
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', margin: 0 }}>
              Join millions of content creators on VideoTube
            </p>
          </div>

          {/* Step Indicator */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {[1, 2, 3].map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {/* Circle */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.3s',
                    background: step > s
                      ? 'linear-gradient(135deg, #dc2626, #db2777)'
                      : step === s
                        ? 'rgba(220,38,38,0.15)'
                        : 'rgba(255,255,255,0.05)',
                    border: step === s
                      ? '1.5px solid rgba(220,38,38,0.7)'
                      : step > s
                        ? 'none'
                        : '1.5px solid rgba(255,255,255,0.1)',
                    color: step >= s ? '#fff' : 'rgba(255,255,255,0.3)',
                    boxShadow: step === s ? '0 0 14px rgba(220,38,38,0.35)' : 'none',
                  }}>
                    {step > s ? (
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s}
                  </div>
                  {/* Connector */}
                  {i < 2 && (
                    <div style={{
                      flex: 1, height: 1, margin: '0 6px',
                      background: step > s
                        ? 'linear-gradient(90deg, #dc2626, #db2777)'
                        : 'rgba(255,255,255,0.08)',
                      transition: 'background 0.4s',
                    }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              {stepLabels.map((label, i) => (
                <span key={i} style={{
                  fontSize: '0.7rem', fontWeight: 500,
                  color: step === i + 1 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.22)',
                  transition: 'color 0.3s',
                  width: '33%',
                  textAlign: i === 0 ? 'left' : i === 2 ? 'right' : 'center',
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* ── STEP 1: Basic Info ── */}
            {step === 1 && (
              <div className="step-form-enter" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {[
                  {
                    label: 'Username', key: 'username', type: 'text',
                    placeholder: 'Choose a unique username',
                    hint: 'Letters, numbers and underscores only',
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    ),
                    onChange: (e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') }),
                  },
                  {
                    label: 'Full Name', key: 'fullName', type: 'text',
                    placeholder: 'Your display name',
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ),
                    onChange: (e) => setFormData({ ...formData, fullName: e.target.value }),
                  },
                  {
                    label: 'Email', key: 'email', type: 'email',
                    placeholder: 'you@example.com',
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    ),
                    onChange: (e) => setFormData({ ...formData, email: e.target.value }),
                  },
                ].map(({ label, key, type, placeholder, hint, icon, onChange }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: '0.4rem' }}>
                      {label}
                    </label>
                    <div className="input-wrap" style={{ position: 'relative' }}>
                      <svg className="input-icon" style={{
                        position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                        width: 16, height: 16, color: 'rgba(255,255,255,0.25)', transition: 'color 0.2s', pointerEvents: 'none',
                      }} fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={formData[key]}
                        onChange={onChange}
                        className="register-input"
                        required
                      />
                    </div>
                    {hint && <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>{hint}</p>}
                  </div>
                ))}

                <button type="button" onClick={nextStep} className="shimmer-btn" style={{ marginTop: '0.25rem' }}>
                  Continue
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}

            {/* ── STEP 2: Security ── */}
            {step === 2 && (
              <div className="step-form-enter" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: '0.4rem' }}>
                    Password
                  </label>
                  <div className="input-wrap" style={{ position: 'relative' }}>
                    <svg className="input-icon" style={{
                      position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                      width: 16, height: 16, color: 'rgba(255,255,255,0.25)', transition: 'color 0.2s', pointerEvents: 'none',
                    }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="register-input"
                      style={{ paddingRight: '2.75rem' }}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                      position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex',
                    }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </>
                        }
                      </svg>
                    </button>
                  </div>

                  {/* Password strength bars */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{
                          flex: 1, height: 3, borderRadius: 2,
                          background: i <= strength.bars ? strength.color : 'rgba(255,255,255,0.08)',
                          transition: 'background 0.3s',
                        }} />
                      ))}
                    </div>
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', color: strength.bars === 0 ? 'rgba(255,255,255,0.2)' : strength.color }}>
                      {strength.label}
                    </p>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: '0.4rem' }}>
                    Confirm Password
                  </label>
                  <div className="input-wrap" style={{ position: 'relative' }}>
                    <svg className="input-icon" style={{
                      position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                      width: 16, height: 16, color: 'rgba(255,255,255,0.25)', transition: 'color 0.2s', pointerEvents: 'none',
                    }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <input
                      type="password"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="register-input"
                      style={{ paddingRight: formData.confirmPassword ? '2.75rem' : undefined }}
                      required
                    />
                    {formData.confirmPassword && (
                      <div style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}>
                        {formData.password === formData.confirmPassword ? (
                          <svg width="16" height="16" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <button type="button" onClick={prevStep} className="back-btn">Back</button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.password || formData.password !== formData.confirmPassword}
                    className="shimmer-btn"
                    style={{ flex: 1 }}
                  >
                    Continue
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Profile ── */}
            {step === 3 && (
              <div className="step-form-enter" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Avatar Upload */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: '0.75rem' }}>
                    Profile Picture <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Avatar circle */}
                    <div style={{
                      width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
                      overflow: 'hidden', position: 'relative',
                      border: avatarPreview ? '2px solid rgba(220,38,38,0.5)' : '2px dashed rgba(255,255,255,0.12)',
                      background: 'rgba(255,255,255,0.04)',
                    }}>
                      {avatarPreview ? (
                        <>
                          <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button type="button" onClick={() => { setAvatar(null); setAvatarPreview(null); }} style={{
                            position: 'absolute', top: 2, right: 2, width: 20, height: 20,
                            borderRadius: '50%', background: '#dc2626', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg width="10" height="10" fill="none" stroke="#fff" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="28" height="28" fill="none" stroke="rgba(255,255,255,0.2)" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Upload area */}
                    <label style={{ flex: 1, cursor: 'pointer' }}>
                      <div style={{
                        padding: '0.875rem 1rem',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: '10px', textAlign: 'center',
                        transition: 'border-color 0.2s, background 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)'; e.currentTarget.style.background = 'rgba(220,38,38,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                      >
                        <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24" style={{ margin: '0 auto 0.4rem' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                          {avatar ? 'Change photo' : 'Upload photo'}
                        </p>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>PNG, JPG — max 5MB</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} required />
                    </label>
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: '0.4rem' }}>
                    Cover Image <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>Optional</span>
                  </label>
                  <label style={{ display: 'block', cursor: 'pointer' }}>
                    <div style={{
                      width: '100%', height: 110, borderRadius: '10px', overflow: 'hidden',
                      border: '1px dashed rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.03)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'border-color 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(220,38,38,0.35)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    >
                      {coverPreview ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <img src={coverPreview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button type="button" onClick={(e) => { e.preventDefault(); setCoverImage(null); setCoverPreview(null); }} style={{
                            position: 'absolute', top: 6, right: 6, width: 24, height: 24,
                            borderRadius: '50%', background: '#dc2626', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg width="11" height="11" fill="none" stroke="#fff" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                          <svg width="24" height="24" fill="none" stroke="rgba(255,255,255,0.2)" viewBox="0 0 24 24" style={{ margin: '0 auto 0.4rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>Upload cover image</p>
                          <p style={{ margin: '0.2rem 0 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.18)' }}>Recommended 1280×720px</p>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleCoverChange} style={{ display: 'none' }} />
                  </label>
                </div>

                {/* Terms */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  padding: '0.875rem', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <input type="checkbox" required style={{
                    marginTop: 2, width: 15, height: 15, accentColor: '#dc2626', flexShrink: 0,
                  }} />
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                    I agree to the{' '}
                    <button type="button" style={{ background: 'none', border: 'none', padding: 0, color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button type="button" style={{ background: 'none', border: 'none', padding: 0, color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>
                      Privacy Policy
                    </button>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={prevStep} className="back-btn">Back</button>
                  <button
                    type="submit"
                    disabled={loading || !avatar}
                    className="shimmer-btn"
                    style={{ flex: 1 }}
                  >
                    {loading ? (
                      <>
                        <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                          <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating account…
                      </>
                    ) : (
                      <>
                        Create Account
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>

          {/* Sign in link */}
          <p style={{ textAlign: 'center', marginTop: '1.75rem', marginBottom: 0, fontSize: '0.875rem', color: 'rgba(255,255,255,0.3)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#ef4444', fontWeight: 500, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#f87171'}
              onMouseLeave={e => e.target.style.color = '#ef4444'}
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
