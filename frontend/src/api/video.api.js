import api from './axios.config';

export const videoAPI = {
  // Get all videos
  getAllVideos: async (params={}) => {
    const response = await api.get('/videos', { params });
    
    // console.log('Raw axios response:', response); // ← Debug
    // console.log('response.data:', response.data); // ← Debug
    // ✅ FIX: Return just response.data (axios already unwraps it)
    return response;
  },

  // Get single video
  getVideoById: async (videoId) => {
    const response = await api.get(`/videos/${videoId}`);
    return response.data;
  },

  // Upload video
  uploadVideo: async (formData) => {
    const response = await api.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update video
  updateVideo: async (videoId, formData) => {
    const response = await api.patch(`/videos/${videoId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete video
  deleteVideo: async (videoId) => {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
  },

  // Toggle publish status
  togglePublishStatus: async (videoId) => {
    const response = await api.patch(`/videos/${videoId}/toggle-publish`);
    return response.data;
  }
};