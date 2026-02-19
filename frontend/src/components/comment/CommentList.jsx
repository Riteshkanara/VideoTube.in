import { useEffect, useState } from 'react';
import { commentAPI } from '../../api/comment.api';
import { likeAPI } from '../../api/like.api';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/auth.store';

export default function CommentList({ videoId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (videoId) {
      loadComments();
    }
  }, [videoId]);

const loadComments = async () => {
    try {
      setLoading(true);
      const response = await commentAPI.getVideoComments(videoId);
      
      // ✅ THE FIX: We must dig into the "data" object to find your comments
      const fetchedComments = response?.data?.comments || [];
      
      setComments(fetchedComments); // Now it will correctly load your array!
      
    } catch (error) {
      console.error('Failed to load comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content) => {
    if(!isAuthenticated){
      return  toast.error("Please login to comment")
    }
    if (!content.trim()) return;
    setSubmitLoading(true);
    try {
      const response = await commentAPI.addComment(videoId, content);
      
      // FIX: Unpacking the new comment correctly
      const newComment = response?.data || response;
      setComments((prev) => [newComment, ...prev]);
      toast.success('Comment added!');
    } catch (error) {
      const errorMessage = error?.response?.data?.message ||  'Failed to Add Comment.'
      toast.error(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      await commentAPI.updateComment(commentId, content);
      setComments(comments.map(c => 
        c._id === commentId ? { ...c, content } : c
      ));
      toast.success('Comment updated!');
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted!');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      // OPTIMISTIC UPDATE: Change the UI before the server responds
      setComments(prev => prev.map(c => {
        if (c._id === commentId) {
          const isCurrentlyLiked = c.isLiked;
          return {
            ...c,
            isLiked: !isCurrentlyLiked,
            likesCount: isCurrentlyLiked ? c.likesCount - 1 : c.likesCount + 1
          };
        }
        return c;
      }));

      await likeAPI.toggleCommentLike(commentId);
    } catch (error) {
      console.error('Failed to like comment:', error);
      // Rollback on error if necessary (optional)
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-t border-gray-800 pt-6">
        <h2 className="text-xl font-bold mb-6">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h2>
        <CommentForm onSubmit={handleAddComment} loading={submitLoading} />
      </div>

      {loading ? (
        <div className="py-10"><Loader /></div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-dark-secondary rounded-xl border border-gray-800">
          <p className="text-gray-400">No comments yet. Be the first to start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onLike={handleLikeComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}