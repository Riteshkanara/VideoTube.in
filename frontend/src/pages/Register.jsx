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
    if (coverImage) {
      data.append('coverImage', coverImage);
    }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-secondary to-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Register Card */}
      <div className="w-full max-w-2xl relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Logo variant="premium" size="xl" />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-400">Join millions of content creators</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300
                    ${step >= s 
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/30' 
                      : 'bg-dark border-2 border-gray-700 text-gray-500'
                    }
                  `}>
                    {step > s ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s
                    )}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                      step > s ? 'bg-gradient-to-r from-red-600 to-pink-600' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Basic Info</span>
              <span>Security</span>
              <span>Profile</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6 animate-slide-up">
                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <div className="relative flex items-center">
                      <svg className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Choose a unique username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                        className="relative w-full pl-12 pr-4 py-3.5 bg-dark/50 text-white border border-gray-800 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 ml-1">This will be your unique identifier</p>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <div className="relative flex items-center">
                      <svg className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="relative w-full pl-12 pr-4 py-3.5 bg-dark/50 text-white border border-gray-800 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <div className="relative flex items-center">
                      <svg className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="relative w-full pl-12 pr-4 py-3.5 bg-dark/50 text-white border border-gray-800 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={nextStep}
                  className="relative w-full group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative px-6 py-3.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-red-500/50 transform group-hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                    <span>Continue</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
              </div>
            )}

            {/* Step 2: Security */}
            {step === 2 && (
              <div className="space-y-6 animate-slide-up">
                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <div className="relative flex items-center">
                      <svg className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="relative w-full pl-12 pr-12 py-3.5 bg-dark/50 text-white border border-gray-800 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all placeholder-gray-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            formData.password.length >= i * 3
                              ? i === 1 ? 'bg-red-500' : i === 2 ? 'bg-orange-500' : i === 3 ? 'bg-yellow-500' : 'bg-green-500'
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 ml-1">
                      {formData.password.length === 0 && 'Use 8 or more characters'}
                      {formData.password.length > 0 && formData.password.length < 6 && 'Weak password'}
                      {formData.password.length >= 6 && formData.password.length < 9 && 'Fair password'}
                      {formData.password.length >= 9 && formData.password.length < 12 && 'Good password'}
                      {formData.password.length >= 12 && 'Strong password'}
                    </p>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <div className="relative flex items-center">
                      <svg className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <input
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="relative w-full pl-12 pr-4 py-3.5 bg-dark/50 text-white border border-gray-800 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all placeholder-gray-500"
                        required
                      />
                      {formData.confirmPassword && (
                        <div className="absolute right-4">
                          {formData.password === formData.confirmPassword ? (
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 px-6 py-3.5 bg-dark border border-gray-800 rounded-xl font-semibold text-white hover:bg-dark-tertiary hover:border-gray-700 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.password || formData.password !== formData.confirmPassword}
                    className="relative flex-1 group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative px-6 py-3.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-red-500/50 transform group-hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                      <span>Continue</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Profile */}
            {step === 3 && (
              <div className="space-y-6 animate-slide-up">
                {/* Avatar Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Profile Picture <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-800 bg-dark group-hover:border-red-600/50 transition-all">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatar(null);
                            setAvatarPreview(null);
                          }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-all shadow-lg"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="relative cursor-pointer group">
                        <div className="px-6 py-3 bg-dark border-2 border-dashed border-gray-800 rounded-xl hover:border-red-600/50 transition-all text-center">
                          <svg className="w-8 h-8 mx-auto mb-2 text-gray-600 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                            {avatar ? 'Change Avatar' : 'Upload Avatar'}
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          required
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Cover Image <span className="text-gray-500">(Optional)</span>
                  </label>
                  <label className="relative cursor-pointer group block">
                    <div className="w-full h-32 bg-dark border-2 border-dashed border-gray-800 rounded-xl overflow-hidden hover:border-red-600/50 transition-all">
                      {coverPreview ? (
                        <div className="relative w-full h-full">
                          <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setCoverImage(null);
                              setCoverPreview(null);
                            }}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-all shadow-lg"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600 group-hover:text-red-500 transition-colors">
                          <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">Click to upload cover image</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500">Recommended: 1280x720px (max. 5MB)</p>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 p-4 bg-dark/50 border border-gray-800 rounded-xl">
                  <input 
                    type="checkbox" 
                    required
                    className="mt-1 w-4 h-4 rounded border-gray-700 text-red-600 focus:ring-red-600 focus:ring-offset-0 bg-dark"
                  />
                  <p className="text-sm text-gray-400">
                    I agree to the{' '}
                    <button type="button" className="text-red-500 hover:text-red-400 transition-colors">
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button type="button" className="text-red-500 hover:text-red-400 transition-colors">
                      Privacy Policy
                    </button>
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 px-6 py-3.5 bg-dark border border-gray-800 rounded-xl font-semibold text-white hover:bg-dark-tertiary hover:border-gray-700 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !avatar}
                    className="relative flex-1 group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative px-6 py-3.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-red-500/50 transform group-hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Sign In Link */}
          <p className="text-center mt-8 text-gray-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-red-500 hover:text-red-400 font-medium transition-colors"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}