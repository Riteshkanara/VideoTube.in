import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../api/user.api.js';
import Avatar from '../components/common/Avatar';
import Loader from '../components/common/Loader';
import { formatViews } from '../utils/formatViews';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';

export default function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getWatchHistory();
      setHistory(response || []);
    } catch (error) {
      console.error('Failed to load watch history:', error);
      toast.error('Failed to load watch history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!history.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
        <p className="text-xl font-bold">No watch history yet</p>
        <p className="text-sm mt-2">Videos you watch will show up here</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Watch History</h1>

      <div className="space-y-4">
        {history.map((video) => (
          <Link
            key={video._id}
            to={`/watch/${video._id}`}
            className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/10"
          >
            <div className="w-48 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white line-clamp-2">{video.title}</h3>

              <div className="flex items-center gap-2 mt-2">
                <Avatar src={video.owner?.avatar} alt={video.owner?.fullName} size="sm" />
                <span className="text-sm text-gray-400">{video.owner?.fullName}</span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                {formatViews(video.views)} views • {formatDate(video.createdAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
