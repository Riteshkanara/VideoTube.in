import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playlistAPI } from '../../api/playlist.api';
import VideoCard from '../video/VideoCard';
import Loader from '../common/Loader';
import Avatar from '../common/Avatar';
import { Play, Share2, Trash2, Shuffle, ListVideo, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Confirm Dialog ────────────────────────────────────────────────────────────
// A simple reusable confirm modal so the user doesn't accidentally delete anything
function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-sm p-6">

        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="text-sm text-neutral-400 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-neutral-800 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tracks which confirm dialog is open:
  // null = none, 'playlist' = delete whole playlist, <videoId> = delete that video
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (playlistId) fetchPlaylistVideos();
  }, [playlistId]);

  const fetchPlaylistVideos = async () => {
    try {
      setLoading(true);
      const response = await playlistAPI.getPlaylistById(playlistId);
      const data = response?.data?.data || response?.data || response;
      setPlaylist(data);
    } catch (error) {
      toast.error('Could not load playlist');
    } finally {
      setLoading(false);
    }
  };

  // ── Delete entire playlist ──
  const handleDeletePlaylist = async () => {
    try {
      setDeleteLoading(true);
      await playlistAPI.deletePlaylist(playlistId);
      toast.success('Playlist deleted');
      navigate('/playlists'); // go back to the playlists page
    } catch (error) {
      toast.error('Failed to delete playlist');
    } finally {
      setDeleteLoading(false);
      setConfirmTarget(null);
    }
  };

  // ── Remove a single video from playlist ──
  const handleRemoveVideo = async (videoId) => {
    try {
      setDeleteLoading(true);
      await playlistAPI.removeVideoFromPlaylist(playlistId, videoId);
      // Update state locally — no need to re-fetch the whole playlist
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
      toast.success('Video removed from playlist');
    } catch (error) {
        console.error('Remove video error:', error); 
      toast.error('Failed to remove video');
    } finally {
      setDeleteLoading(false);
      setConfirmTarget(null);
    }
  };

  // ── Decide what to do when confirm is pressed ──
  const handleConfirm = () => {
    if (confirmTarget === 'playlist') {
      handleDeletePlaylist();
    } else if (confirmTarget) {
      handleRemoveVideo(confirmTarget); // confirmTarget holds the videoId
    }
  };

  // ── Dialog copy based on what we're deleting ──
  const getDialogContent = () => {
    if (confirmTarget === 'playlist') {
      return {
        title: 'Delete Playlist',
        message: 'This will permanently delete the entire playlist. This action cannot be undone.',
      };
    }
    const video = playlist?.videos?.find((v) => v._id === confirmTarget);
    return {
      title: 'Remove Video',
      message: `Remove "${video?.title || 'this video'}" from the playlist?`,
    };
  };

  // ── Render ──
  if (loading) return <Loader fullScreen />;

  if (!playlist) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-neutral-500">
      Playlist not found
    </div>
  );

  const videos = playlist.videos || [];
  const firstThumb = videos[0]?.thumbnail;
  const dialogContent = confirmTarget ? getDialogContent() : {};

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── TOP SECTION ── */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">

          {/* Thumbnail */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-800 group">
              {firstThumb ? (
                <img
                  src={firstThumb}
                  alt={playlist.name}
                  width={640}
                  height={360}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ListVideo size={40} className="text-neutral-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Play fill="black" color="black" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Playlist Info */}
          <div className="flex flex-col justify-between">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
              Playlist
            </p>

            <h1 className="text-2xl font-semibold text-white tracking-tight mb-3 leading-snug">
              {playlist.name}
            </h1>

            {playlist.description && (
              <p className="text-sm text-neutral-400 mb-5 leading-relaxed max-w-xl line-clamp-3">
                {playlist.description}
              </p>
            )}

            <div className="flex items-center gap-3 mb-6">
              <Avatar src={playlist.owner?.avatar} size="sm" />
              <div>
                <p className="text-sm font-medium text-white leading-none">
                  {playlist.owner?.fullName || 'Unknown'}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {videos.length} videos · Public
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-neutral-200 transition-colors duration-200">
                <Play fill="black" size={16} />
                Play All
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors duration-200">
                <Shuffle size={16} />
                Shuffle
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors duration-200">
                <Share2 size={16} />
                Share
              </button>

              {/* Delete Playlist — separated visually with a left border */}
              <div className="h-8 w-px bg-neutral-700 mx-1 hidden sm:block" />

              <button
                onClick={() => setConfirmTarget('playlist')}
                className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all duration-200"
              >
                <Trash2 size={16} />
                Delete Playlist
              </button>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="h-px bg-neutral-800 mb-8" />

        {/* ── VIDEO LIST HEADER ── */}
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
              <ListVideo size={28} className="text-neutral-600" />
            </div>
            <p className="text-sm font-medium text-neutral-400 mb-1">This playlist is empty</p>
            <p className="text-sm text-neutral-600">Add some videos to get started.</p>
          </div>
        ) : (
          /* ── VIDEO GRID ──
               We wrap each VideoCard in a relative div so we can absolutely position
               a small remove button in the top-right corner on hover.
          */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {videos.map((video) => (
              <div key={video._id} className="relative group/item">

                {/* The existing VideoCard — untouched */}
                <VideoCard video={video} />

                {/* Remove button — appears on hover in the top-right corner */}
                <button
                  onClick={() => setConfirmTarget(video._id)}
                  title="Remove from playlist"
                  className="
                    absolute top-2 right-2 z-10
                    w-8 h-8 rounded-full
                    bg-black/70 backdrop-blur-sm
                    flex items-center justify-center
                    text-neutral-400 hover:text-red-400 hover:bg-black/90
                    opacity-0 group-hover/item:opacity-100
                    transition-all duration-200
                  "
                >
                  <X size={14} />
                </button>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* ── CONFIRM DIALOG ── */}
      <ConfirmDialog
        isOpen={confirmTarget !== null}
        title={dialogContent.title}
        message={dialogContent.message}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmTarget(null)}
        loading={deleteLoading}
      />

    </div>
  );
}