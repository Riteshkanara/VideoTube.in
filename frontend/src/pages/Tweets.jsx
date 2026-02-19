import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tweetAPI } from '../api/tweet.api';
import { likeAPI } from '../api/like.api';
import TweetCard from '../components/tweet/TweetCard';
import TweetForm from '../components/tweet/TweetForm';
import Loader from '../components/common/Loader';
import useAuthStore from '../store/auth.store.js';
import toast from 'react-hot-toast';

export default function Tweets() {
  const { userId } = useParams(); 
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // 🌟 FIX 1: Trigger loadTweets whenever the URL changes
  useEffect(() => {
    loadTweets();
  }, [userId]);

  const loadTweets = async () => {
    try {
      setLoading(true);
      let response;
      
      // 🌟 FIX 2: Strict check. If userId exists, get their tweets. If not, get ALL tweets.
      if (userId) {
        response = await tweetAPI.getUserTweets(userId);
      } else {
        response = await tweetAPI.getAllTweets();
      }
      
      const fetchedTweets = response?.data?.data || response?.data || response?.tweets || response || [];
      setTweets(Array.isArray(fetchedTweets) ? fetchedTweets : []);
      
    } catch (error) {
      console.error('Failed to load tweets:', error);
      toast.error('Failed to load tweets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTweet = async (content) => {
    if (!isAuthenticated) {
      toast.error('Please login to tweet');
      navigate('/login');
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await tweetAPI.createTweet(content);
      const newTweet = response?.data?.data || response?.data || response;
      
      const formattedTweet = {
        ...newTweet,
        likesCount: 0,
        isLiked: false,
        owner: user 
      };

      setTweets([formattedTweet, ...tweets]);
      toast.success('Tweet posted!');
    } catch (error) {
      console.error('Failed to create tweet:', error);
      toast.error(error?.response?.data?.message || 'Failed to post tweet');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditTweet = async (tweetId, content) => {
    try {
      await tweetAPI.updateTweet(tweetId, content);
      setTweets(tweets.map(t => 
        t._id === tweetId ? { ...t, content } : t
      ));
      toast.success('Tweet updated!');
    } catch (error) {
      console.error('Failed to update tweet:', error);
      toast.error('Failed to update tweet');
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("Are you sure you want to delete this tweet?")) return;
    
    try {
      await tweetAPI.deleteTweet(tweetId);
      setTweets(tweets.filter(t => t._id !== tweetId));
      toast.success('Tweet deleted!');
    } catch (error) {
      console.error('Failed to delete tweet:', error);
      toast.error('Failed to delete tweet');
    }
  };

  const handleLikeTweet = async (tweetId) => {
    if (!isAuthenticated) return toast.error("Please login to like");

    try {
      setTweets(prev => prev.map(t => {
        if (t._id === tweetId) {
          const isCurrentlyLiked = t.isLiked;
          return {
            ...t,
            isLiked: !isCurrentlyLiked,
            likesCount: isCurrentlyLiked ? Math.max(0, (t.likesCount || 0) - 1) : (t.likesCount || 0) + 1
          };
        }
        return t;
      }));

      await likeAPI.toggleTweetLike(tweetId);
    } catch (error) {
      console.error('Failed to like tweet:', error);
    }
  };

  // Determine if we should show the "Create Tweet" form
  const isViewingOwnProfile = !userId || userId === user?._id;

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Tweets</h1>

      {isAuthenticated && isViewingOwnProfile && (
        <TweetForm onSubmit={handleCreateTweet} loading={submitLoading} />
      )}

      {tweets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400 mb-2">No tweets yet</p>
          <p className="text-gray-500">
            {isAuthenticated && isViewingOwnProfile
              ? 'Be the first to tweet!' 
              : 'No tweets to display.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              onEdit={handleEditTweet}
              onDelete={handleDeleteTweet}
              onLike={handleLikeTweet}
            />
          ))}
        </div>
      )}
    </div>
  );
}