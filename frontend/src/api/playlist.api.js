import api from './axios.config';

export const playlistAPI = {
  createPlaylist: async (data) => {
    return await api.post('/playlists', data);
  },

  getUserPlaylists: async (userId) => {
    return await api.get(`/playlists/user/${userId}`);
  },

  getPlaylistById: async (playlistId) => {
    return await api.get(`/playlists/${playlistId}`);
  },

  updatePlaylist: async (playlistId, data) => {
    return await api.patch(`/playlists/${playlistId}`, data);
  },

  deletePlaylist: async (playlistId) => {
    return await api.delete(`/playlists/${playlistId}`);
  },

  addVideoToPlaylist: async (playlistId, videoId) => {
    return await api.patch(`/playlists/add/${playlistId}/${videoId}`);
  },

  removeVideoFromPlaylist: async (playlistId, videoId) => {
    return await api.patch(`/playlists/remove/${videoId}/${playlistId}`);
},

};