import { useState } from 'react';
import { MoreVertical, Trash2, Edit2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatDate';
import useAuthStore from '../../store/auth.store.js';

export default function TweetCard({ tweet, onDelete, onEdit, onLike }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  // 🌟 REMOVED: const [liked, setLiked] = useState(false);
  const { user } = useAuthStore();

  const isOwner = user?._id === tweet.owner?._id;

  const handleEdit = () => {
    onEdit(tweet._id, editContent);
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this tweet?')) {
      onDelete(tweet._id);
    }
    setShowMenu(false);
  };

  return (
    <div className="bg-dark-2 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
      <div className="flex gap-3">
        <Link to={`/channel/${tweet.owner?.username}`}>
          <Avatar 
            src={tweet.owner?.avatar} 
            alt={tweet.owner?.username}
            size="md"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Link 
                to={`/channel/${tweet.owner?.username}`}
                className="font-semibold hover:text-primary"
              >
                {tweet.owner?.fullName}
              </Link>
              <span className="text-gray-400 text-sm">
                @{tweet.owner?.username}
              </span>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-400 text-sm">
                {formatDate(tweet.createdAt)}
              </span>
            </div>

            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-gray-700 rounded-full"
                >
                  <MoreVertical size={18} className="text-gray-400" />
                </button>

                {showMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    ></div>
                    
                    <div className="absolute right-0 mt-1 w-32 bg-dark rounded-lg shadow-lg border border-gray-700 z-20">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-800 text-sm"
                      >
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-800 text-sm text-red-500"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 bg-dark rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows="3"
              />
              <div className="flex gap-2">
                <Button onClick={handleEdit} variant="primary" className="text-sm">
                  Save
                </Button>
                <Button 
                  onClick={() => setIsEditing(false)} 
                  variant="secondary" 
                  className="text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-200 whitespace-pre-wrap mb-3">
                {tweet.content}
              </p>
              
              {/* 🌟 FIX: The Like button now reads directly from the tweet object */}
              <button
                onClick={() => onLike(tweet._id)}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  tweet.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart size={18} fill={tweet.isLiked ? 'currentColor' : 'none'} />
                <span>{tweet.likesCount || 0}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}