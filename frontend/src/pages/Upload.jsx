import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoAPI } from '../api/video.api';
import toast from 'react-hot-toast';

export default function Upload() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleVideoDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVideoChange(e.dataTransfer.files[0]);
    }
  };

  const handleVideoChange = (file) => {
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      toast.error('Please upload a valid video file');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !thumbnail) {
      toast.error('Please select video and thumbnail');
      return;
    }

    setLoading(true);
    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('videoFile', videoFile);
    uploadData.append('thumbnail', thumbnail);

    try {
      // Simulate progress for demo
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await videoAPI.uploadVideo(uploadData);
      clearInterval(interval);
      setUploadProgress(100);
      
      toast.success('Video uploaded successfully!');
      setTimeout(() => {
        navigate(`/watch/${response.data._id}`);
      }, 1000);
    } catch (error) {
      toast.error(error.message || 'Upload failed');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
          Upload Video
        </h1>
        <p className="text-gray-400">Share your content with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Video Upload Area */}
        <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8 shadow-2xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            Video File
          </h2>

          {!videoFile ? (
            <div
              onDragEnter={handleVideoDrag}
              onDragLeave={handleVideoDrag}
              onDragOver={handleVideoDrag}
              onDrop={handleVideoDrop}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                ${dragActive 
                  ? 'border-red-600 bg-red-600/10' 
                  : 'border-gray-800 hover:border-gray-700 hover:bg-dark/50'
                }
              `}
            >
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium mb-2">
                    Drag and drop your video here
                  </p>
                  <p className="text-gray-500 mb-4">or</p>
                  <label className="relative cursor-pointer group inline-block">
                    <div className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-red-500/50 transform group-hover:scale-105 transition-all duration-300">
                      Browse Files
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleVideoChange(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  MP4, WebM, or MOV (max. 100MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-slide-up">
              <div className="relative rounded-2xl overflow-hidden bg-black border border-gray-800">
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-96 object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview(null);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-all shadow-lg z-10"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3 p-4 bg-dark rounded-xl border border-gray-800">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{videoFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8 shadow-2xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            Thumbnail
          </h2>

          {!thumbnailPreview ? (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-800 rounded-2xl p-8 text-center hover:border-gray-700 hover:bg-dark/50 transition-all">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-medium mb-2">Upload Thumbnail</p>
                <p className="text-sm text-gray-500">
                  PNG, JPG or GIF (recommended: 1280x720px)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-gray-800 animate-slide-up">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full aspect-video object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setThumbnail(null);
                  setThumbnailPreview(null);
                }}
                className="absolute top-4 right-4 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-all shadow-lg"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8 shadow-2xl space-y-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            Details
          </h2>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="text"
                placeholder="Enter an eye-catching title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="relative w-full px-5 py-3.5 bg-dark/50 text-white border border-gray-800 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all placeholder-gray-500"
                maxLength={100}
                required
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Make it catchy and descriptive</span>
              <span>{formData.title.length}/100</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <textarea
                placeholder="Tell viewers about your video"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="relative w-full px-5 py-3.5 bg-dark/50 text-white border border-gray-800 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all placeholder-gray-500 resize-none"
                rows={5}
                maxLength={5000}
                required
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Add descriptions, hashtags, and mentions</span>
              <span>{formData.description.length}/5000</span>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {loading && (
          <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8 shadow-2xl animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Uploading your video...</span>
                <span className="text-2xl font-bold text-red-500">{uploadProgress}%</span>
              </div>
              <div className="relative w-full h-3 bg-dark rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-pink-600 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-400/50 to-pink-400/50 blur-sm transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>This may take a few moments...</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {!loading && (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-8 py-4 bg-dark border border-gray-800 rounded-xl font-semibold text-white hover:bg-dark-tertiary hover:border-gray-700 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!videoFile || !thumbnail || !formData.title || !formData.description}
              className="relative flex-1 group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-red-500/50 transform group-hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Video</span>
              </div>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}