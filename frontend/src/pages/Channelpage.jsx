import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoCard from '../components/video/VideoCard';
import Avatar from '../components/common/Avatar';
import Loader from '../components/common/Loader';
import { subscriptionAPI } from '../api/subscription.api';
import api from '../api/axios.config';
import useAuthStore from '../store/auth.store.js';
import { PlaySquare, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChannelPage() {
  const { username } = useParams(); // matches /channel/:username
  const { user: currentUser } = useAuthStore();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    if (username) fetchChannel();
  }, [username]);

  const fetchChannel = async () => {
    try {
      setLoading(true);

      // 1. Get channel profile by username
      const profileRes = await api.get(`/users/user-channel/${username}`);
      console.log('FULL profile response:', profileRes)
      console.log('channel response:', profileRes);  // 👈 add this
      console.log('username from URL:', username);
      const channelData = profileRes?.data || profileRes;
      setChannel(channelData);
      setIsSubscribed(channelData?.isSubscribed || false);

      // 2. Get that channel's videos
      const videosRes = await api.get(`/videos?userId=${channelData._id}`);
      const videosData = videosRes?.data?.docs || videosRes?.data?.videos || videosRes?.data || [];
      setVideos(Array.isArray(videosData) ? videosData : []);
    } catch (error) {
      toast.error('Could not load channel');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubscribe = async () => {
    if (!channel) return;
    try {
      setSubLoading(true);
      await subscriptionAPI.toggleSubscription(channel._id);
      setIsSubscribed((prev) => !prev);
      setChannel((prev) => ({
        ...prev,
        subscribersCount: isSubscribed
          ? (prev.subscribersCount || 1) - 1
          : (prev.subscribersCount || 0) + 1,
      }));
    } catch (error) {
      toast.error('Failed to update subscription');
    } finally {
      setSubLoading(false);
    }
  };

  const formatCount = (n) => {
    if (!n) return '0';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return String(n);
  };

  // ── Render ──
  if (loading) return <Loader fullScreen />;

  if (!channel) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-neutral-500">
      Channel not found
    </div>
  );

  const isOwnChannel = currentUser?._id === channel._id;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── CHANNEL HEADER ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">

          {/* Avatar */}
          <Avatar src={channel.avatar} alt={channel.fullName} size="xl" />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              {channel.fullName}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">@{channel.username}</p>

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-sm text-neutral-400">
                <Users size={14} className="text-neutral-600" />
                {formatCount(channel.subscribersCount)} subscribers
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral-700" />
              <span className="flex items-center gap-1.5 text-sm text-neutral-400">
                <PlaySquare size={14} className="text-neutral-600" />
                {videos.length} videos
              </span>
            </div>

            {/* Bio */}
            {channel.bio && (
              <p className="text-sm text-neutral-500 mt-3 max-w-xl leading-relaxed line-clamp-2">
                {channel.bio}
              </p>
            )}
          </div>

          {/* Subscribe button — hide on own channel */}
          {!isOwnChannel && (
            <button
              onClick={handleToggleSubscribe}
              disabled={subLoading}
              className={`
                flex-shrink-0 px-6 py-2.5 text-sm font-semibold rounded-lg
                transition-colors duration-200 disabled:opacity-50
                ${isSubscribed
                  ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                  : 'bg-white text-black hover:bg-neutral-200'
                }
              `}
            >
              {subLoading ? '...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>

        {/* ── DIVIDER ── */}
        <div className="h-px bg-neutral-800 mb-8" />

        {/* ── VIDEOS HEADER ── */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest">
            Videos
          </h2>
          <span className="text-sm text-neutral-600">{videos.length} titles</span>
        </div>

        {/* ── EMPTY STATE ── */}
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center mb-4">
              <PlaySquare size={28} className="text-neutral-600" />
            </div>
            <p className="text-sm font-medium text-neutral-400 mb-1">No videos yet</p>
            <p className="text-sm text-neutral-600">This channel hasn't uploaded anything.</p>
          </div>
        ) : (
          /* ── VIDEO GRID ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}