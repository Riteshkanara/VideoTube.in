import { useState } from 'react';
import { MoreVertical, Trash2, Edit2, ThumbsUp } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatDate';
import useAuthStore from '../../store/auth.store.js';

export default function CommentCard({ comment, onDelete, onEdit, onLike }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { user } = useAuthStore();

  const isOwner = user?._id === comment.owner?._id;

  const handleEdit = () => {
    onEdit(comment._id, editContent);
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment._id);
    }
    setShowMenu(false);
  };

  return (
    <div className="flex gap-3">
      <Avatar 
        src={comment.owner?.avatar} 
        alt={comment.owner?.username}
        size="sm"
      />

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">
            {comment.owner?.username}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(comment.createdAt)}
          </span>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 bg-dark-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows="3"
            />
            <div className="flex gap-2">
              <Button onClick={handleEdit} variant="primary" className="px-6 py-2.5 rounded-lg font-bold border border-white/10">
                Save
              </Button>
              <Button 
                onClick={() => setIsEditing(false)} 
                variant="secondary" 
                className="px-6 py-2.5 rounded-lg font-bold border border-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-300 mb-2">{comment.content}</p>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => onLike(comment._id)}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-primary"
              >
                <ThumbsUp size={16} />
                <span>{comment.likesCount || 0}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Menu */}
      {isOwner && !isEditing && (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            <MoreVertical size={18} className="text-gray-400" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              ></div>
              
              <div className="absolute right-0 mt-1 w-32 bg-dark-2 rounded-lg shadow-lg border border-gray-700 z-20">
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
  );
}