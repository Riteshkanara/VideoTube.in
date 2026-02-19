import api from './axios.config';

export const likeAPI = {
  toggleVideoLike: async (videoId) => {
    return await api.post(`/likes/video/${videoId}`);
  },

  toggleCommentLike: async (commentId) => {
    return await api.post(`/likes/comment/${commentId}`);
  },

  toggleTweetLike: async (tweetId) => {
    return await api.post(`/likes/tweet/${tweetId}`);
  },

  getLikedVideos: async () => {
    return await api.get('/likes/videos/liked');
  },
};

