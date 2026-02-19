import api from './axios.config';

export const tweetAPI = {
  createTweet: async (content) => {
    return await api.post('/tweets', { content });
  },

  getAllTweets: async ( params = {} ) => {
    return await api.get("/tweets",{ params })
  },

  // 🌟 FIX 1: Add userId to the parameters and inject it into the URL string
  getUserTweets: async (userId, params = {}) => {
    return await api.get(`/tweets/${userId}`, { params });
  },

  // 🌟 FIX 2: Changed .patch to .put to match backend router.put
  updateTweet: async (tweetId, content) => {
    return await api.put(`/tweets/${tweetId}`, { content });
  },

  deleteTweet: async (tweetId) => {
    return await api.delete(`/tweets/${tweetId}`);
  },
};