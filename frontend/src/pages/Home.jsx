import { useEffect, useState, useCallback } from 'react';
import { videoAPI } from '../api/video.api';
import VideoCard from '../components/video/VideoCard';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      
      const response = await videoAPI.getAllVideos();
      
      const videoData = response?.data?.docs || response?.data?.videos || [];
      setVideos(videoData);

      // console.log('video response:', response); 
      //To really check the the data format to display the video.
      
      
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError(true);
      toast.error('Failed to load videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="h-8 w-48 bg-dark-secondary rounded-lg skeleton" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video bg-dark-secondary rounded-2xl skeleton" />
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-dark-secondary rounded-full skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-dark-secondary rounded skeleton" />
                  <div className="h-3 w-2/3 bg-dark-secondary rounded skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-400 mb-6">We couldn't load the videos</p>
        <button 
          onClick={loadVideos}
          className="btn-primary"
        >
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  if (!Array.isArray(videos) || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-24 h-24 bg-dark-secondary rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">No videos yet</h2>
        <p className="text-gray-400 mb-6">Be the first to upload!</p>
        <button 
          onClick={loadVideos}
          className="btn-secondary"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Recommended</h1>
          <p className="text-gray-400">Videos picked for you</p>
        </div>
        
        {/* Filter Chips */}
        <div className="hidden lg:flex gap-2">
          {['All', 'Music', 'Gaming', 'News', 'Live'].map((filter) => (
            <button 
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === 'All' 
                  ? 'bg-white text-dark hover:bg-gray-200' 
                  : 'bg-dark-secondary text-gray-300 hover:bg-dark-tertiary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video, index) => (
          <div 
            key={video._id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-slide-up"
          >
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </div>
  );
}