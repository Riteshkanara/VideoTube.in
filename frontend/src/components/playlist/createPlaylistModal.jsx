import { useState, useEffect } from 'react';
import { playlistAPI } from '../../api/playlist.api';
import { videoAPI } from '../../api/video.api'; 
import useAuthStore from '../../store/auth.store';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreatePlaylistModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuthStore();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVideos, setSelectedVideos] = useState([]); 
  
  const [myVideos, setMyVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only fetch videos if the modal is actually open
    if (isOpen && user?._id) {
      fetchMyVideos();
    }
  }, [isOpen, user]);

const fetchMyVideos = async () => {
    try {
      setLoadingVideos(true);
      
      const result = await videoAPI.getAllVideos({ userId: user._id });
      
      // 🌟 THE ULTIMATE DATA HUNTER
      // We check every possible place the array could be hiding based on your ApiResponse class
      const fetchedVideos = 
        result?.data?.data?.videos ||  // If result is the full axios object
        result?.data?.videos ||        // If result is the response.data
        result?.videos ||              // If it's direct
        [];

      setMyVideos(Array.isArray(fetchedVideos) ? fetchedVideos : []);
      
    } catch (error) {
      console.error("Failed to load videos", error);
      toast.error("Could not load your videos");
    } finally {
      setLoadingVideos(false);
    }
  };

  const toggleVideo = (videoId) => {
    setSelectedVideos((prev) => 
      prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Playlist name is required");

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        description,
        videos: selectedVideos 
      };

      const response = await playlistAPI.createPlaylist(payload);
      toast.success("Playlist created successfully!");
      
      setName("");
      setDescription("");
      setSelectedVideos([]);
      if (onSuccess) onSuccess(response.data?.data || response.data);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create playlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🌟 THE UI FIX: The "Kill Switch"
  // If isOpen is false, render absolutely NOTHING.
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] w-full max-w-md rounded-xl shadow-2xl border border-gray-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Create Playlist</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form id="playlist-form" onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Playlist Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g., My Favorite Vlogs"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none h-24 transition-colors"
              placeholder="What is this playlist about?"
            />
          </div>

          {/* Video Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex justify-between">
              <span>Add Videos</span>
              <span className="text-blue-500">{selectedVideos.length} selected</span>
            </label>
            <div className="bg-black border border-gray-700 rounded-lg overflow-hidden h-56 overflow-y-auto p-1">
              {loadingVideos ? (
                <div className="flex justify-center items-center h-full text-gray-400 text-sm">Loading your videos...</div>
              ) : myVideos.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-400 text-sm">
                  You haven't uploaded any videos yet.
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {myVideos.map((video) => (
                    <label 
                      key={video._id} 
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                        selectedVideos.includes(video._id) ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-gray-900 border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedVideos.includes(video._id)}
                        onChange={() => toggleVideo(video._id)}
                        className="w-4 h-4 rounded border-gray-600 text-blue-500 bg-black focus:ring-blue-500 focus:ring-offset-gray-900"
                      />
                      <img src={video.thumbnail} alt={video.title} className="w-20 h-12 object-cover rounded bg-gray-800" />
                      <span className="text-sm text-gray-200 line-clamp-2 flex-1 leading-tight">{video.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer actions */}
        <div className="p-5 border-t border-gray-800 flex justify-end gap-3 bg-[#1a1a1a] rounded-b-xl">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-lg font-medium text-gray-300 hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="playlist-form"
            disabled={isSubmitting || !name.trim()} 
            className="px-5 py-2.5 rounded-lg font-bold bg-white text-black hover:bg-gray-200 disabled:opacity-50 transition"
          >
            {isSubmitting ? 'Creating...' : 'Create Playlist'}
          </button>
        </div>
        
      </div>
    </div>
  );
}