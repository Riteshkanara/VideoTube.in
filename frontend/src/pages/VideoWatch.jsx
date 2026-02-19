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
import { Share2 } from "lucide-react";

export default function VideoWatch() {
  const { videoId } = useParams();
  const { isAuthenticated, user } = useAuthStore();

  // State
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Interaction State
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

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

    } catch (error) {
      console.error('Failed to load video:', error);
      toast.error('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return toast.error('Please login to like');
    if (likeLoading) return;

    const previousLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!previousLiked);
    setLikesCount(prev => previousLiked ? Math.max(0, prev - 1) : prev + 1);
    setLikeLoading(true);

    try {
      const response = await likeAPI.toggleVideoLike(videoId);
      if (response && typeof response.isLiked !== 'undefined') {
        setIsLiked(response.isLiked);
        toast.success("Video Liked")
      }
    } catch (error) {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error('Failed to like video');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) return toast.error("Please Login to Subscribe.");
    
    if (video?.owner?._id === user?._id) {
      return toast.error("You cannot subscribe to your own channel.");
    }

    if (subscribeLoading) return;

    const previousSubscribed = isSubscribed;
    setIsSubscribed(!previousSubscribed);
    setSubscribeLoading(true);

    try {
      const response = await subscriptionAPI.toggleSubscription(video.owner._id);
      if (response && typeof response.isSubscribed !== 'undefined') {
        setIsSubscribed(response.isSubscribed);
        toast.success(response.isSubscribed ? "Subscribed!" : "Unsubscribed");
      }
    } catch (error) {
      setIsSubscribed(previousSubscribed);
      toast.error(error?.response?.data?.message || "Subscription failed");
    } finally {
      setSubscribeLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) return <Loader />;
  
  if (!video) return (
    <div className="flex justify-center items-center h-[50vh] text-xl">Video not found</div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          
          {/* PLAYER */}
          <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video border border-gray-800">
            <VideoPlayer src={video?.videoFile} thumbnail={video?.thumbnail} />
          </div>

          {/* TITLE */}
          <h1 className="text-2xl font-bold">{video.title}</h1>

          {/* CHANNEL INFO & ACTIONS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-[#0f0f0f] rounded-xl border border-white/10">
            
            {/* Left: Avatar + Name + Sub Button */}
            <div className="flex items-center gap-4">
              <Link to={`/channel/${video.owner?.username}`}>
                <Avatar src={video.owner?.avatar} alt={video.owner?.fullName} size="lg" />
              </Link>
              
              <div className="mr-2">
                <Link to={`/channel/${video.owner?.username}`}>
                  <h3 className="font-bold text-white hover:text-gray-300 transition text-lg">{video.owner?.fullName}</h3>
                </Link>
                <p className="text-sm text-gray-400">{formatViews(video.owner?.subscribersCount || 0)} subscribers</p>
              </div>

              {/* SUBSCRIBE BUTTON (Square, Bold, Large Padding) */}
              <button 
                onClick={handleSubscribe}
                disabled={subscribeLoading}
                className={`
                  ml-2 px-8 py-3 rounded-lg font-bold text-base transition-all active:scale-95 border
                  ${isSubscribed 
                    ? 'bg-transparent text-white border-white/20 hover:bg-white/10' 
                    : 'bg-white text-black border-transparent hover:bg-gray-200'}
                `}
              >
                {subscribeLoading ? '...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Right: Like + Share (Separated into blocks) */}
            <div className="flex items-center gap-3">
              
              {/* LIKE BUTTON */}
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-lg border transition-all font-bold text-base active:scale-95
                  ${isLiked 
                    ? 'bg-white/10 border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                    : 'bg-transparent border-white/10 text-gray-300 hover:bg-white/5'}
                `}
              >
                <svg className={`w-6 h-6 ${isLiked ? 'fill-white' : 'fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth="2">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>{formatViews(likesCount)}</span>
              </button>
              
              {/* SHARE BUTTON */}
              <button 
                onClick={handleShare}
                className="flex items-center gap-3 px-6 py-3 rounded-lg border border-white/10 bg-transparent hover:bg-white/5 text-gray-300 font-bold text-base transition-all active:scale-95"
              >
                <Share2 size={20} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-[#0f0f0f] p-5 rounded-xl border border-white/10 text-base">
            <div className="flex gap-2 font-bold mb-3 text-white">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{formatDate(video.createdAt)}</span>
            </div>
            <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{video.description}</p>
          </div>

          <CommentList videoId={videoId} />
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block">
           <p className="text-gray-500 font-bold">Related videos coming soon...</p>
        </div>
      </div>
    </div>
  );
}