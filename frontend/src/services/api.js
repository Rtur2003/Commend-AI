import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://commend-ai-backend.onrender.com/api' 
  : 'http://127.0.0.1:5000/api';

// Token işlemleri
const setToken = (token) => localStorage.setItem('admin_token', token);
const getToken = () => localStorage.getItem('admin_token');
const removeToken = () => localStorage.removeItem('admin_token');

// Axios interceptors
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) removeToken();
    return Promise.reject(error);
  }
);

// Yorum fonksiyonları
export const generateComment = async (videoUrl, language, interfaceLanguage = 'tr') => {
  const response = await axios.post(`${API_URL}/generate_comment`, {
    video_url: videoUrl,
    language: language,
    comment_style: 'default',
    interface_language: interfaceLanguage
  });
  return response.data; // Tüm response'u döndür (comment_id dahil)
};

export const postCommentToYouTube = async (videoUrl, commentText, commentId = null, interfaceLanguage = 'tr') => {
  const requestData = {
    video_url: videoUrl,
    comment_text: commentText,
    interface_language: interfaceLanguage
  };
  
  // Eğer commentId varsa ekle
  if (commentId) {
    requestData.comment_id = commentId;
  }
  
  const response = await axios.post(`${API_URL}/post_comment`, requestData);
  return response.data;
};

export const getHistory = async () => {
  const response = await axios.get(`${API_URL}/history`);
  return response.data.history;
};

// Reklam fonksiyonları
export const getActiveAds = async () => {
  try {
    const response = await axios.get(`${API_URL}/public/active-ads`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active ads:', error);
    return [];
  }
};

export const getAds = async () => {
  const response = await axios.get(`${API_URL}/admin/ads`);
  return response.data;
};

export const createAd = async (adData) => {
  const response = await axios.post(`${API_URL}/admin/ads`, adData);
  return response.data;
};

export const updateAd = async (adId, adData) => {
  try {
    const response = await axios.put(`${API_URL}/admin/ads/${adId}`, adData);
    return response.data;
  } catch (error) {
    console.error('Update error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteAd = async (adId) => {
  const response = await axios.delete(`${API_URL}/admin/ads/${adId}`);
  return response.data;
};

export const toggleAdStatus = async (adId) => {
  const response = await axios.put(`${API_URL}/admin/ads/${adId}/toggle`);
  return response.data;
};

// Admin fonksiyonları
export const adminLogin = async (password) => {
  const response = await axios.post(`${API_URL}/admin/login`, { password });
  if (response.data.token) setToken(response.data.token);
  return response.data;
};

export const adminLogout = async () => {
  removeToken();
  const response = await axios.post(`${API_URL}/admin/logout`);
  return response.data;
};

export const checkAdminAuth = async () => {
  const token = getToken();
  if (!token) return { is_admin: false };
  const response = await axios.get(`${API_URL}/admin/check_auth`);
  return response.data;
};