import { useEffect, useState } from 'react';
import { Plus, ListVideo } from 'lucide-react';
import { playlistAPI } from '../api/playlist.api.js';
import PlaylistCard from '../components/playlist/PlaylistCard';
import Loader from '../components/common/Loader';
import useAuthStore from '../store/auth.store.js';
import toast from 'react-hot-toast';
import CreatePlaylistModal from '../components/playlist/CreatePlaylistModal.jsx';

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?._id) loadPlaylists();
  }, [user]);

  const loadPlaylists = async () => {
    try {
      const response = await playlistAPI.getUserPlaylists(user._id);
      setPlaylists(response.data || []);
    } catch (error) {
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists([newPlaylist, ...playlists]);
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── PAGE HEADER ── */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Your Playlists
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {playlists.length} {playlists.length === 1 ? 'collection' : 'collections'}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-neutral-200 transition-colors duration-200"
          >
            <Plus size={16} />
            New Playlist
          </button>
        </div>

        {/* ── DIVIDER ── */}
        <div className="h-px bg-neutral-800 mb-10" />

        {/* ── EMPTY STATE ── */}
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center mb-5">
              <ListVideo size={28} className="text-neutral-500" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">No playlists yet</h2>
            <p className="text-sm text-neutral-500 mb-6 max-w-xs">
              Create your first playlist to start organizing videos you love.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
            >
              <Plus size={16} />
              Create Playlist
            </button>
          </div>
        ) : (
          /* ── GRID ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        )}
      </div>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePlaylistCreated}
      />
    </div>
  );
}