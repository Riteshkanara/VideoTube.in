import { useState } from 'react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import useAuthStore from '../../store/auth.store.js';
import { useNavigate } from 'react-router-dom';

export default function CommentForm({ onSubmit, loading }) {
  const [content, setContent] = useState('');
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-dark-2 rounded-lg p-4 text-center">
        <p className="text-gray-400 mb-3">Sign in to comment</p>
        <Button onClick={() => navigate('/login')} variant="primary">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Avatar src={user?.avatar} alt={user?.username} size="sm" />
      
      <div className="flex-1 space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-3 bg-dark-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows="3"
        />
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={() => setContent('')}
            variant="secondary"
            disabled={!content.trim()}
            className="px-6 py-2.5 rounded-lg font-bold border border-white/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!content.trim()}
            loading={loading}
            className="px-6 py-2.5 rounded-lg font-bold border border-white/10"
          >
            Comment
          </Button>
        </div>
      </div>
    </form>
  );
}