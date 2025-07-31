import axios from 'axios';

// Backend sunucumuzun ana adresi
const API_URL = 'http://127.0.0.1:5000/api';

// Token'ı localStorage'a kaydet/al/sil
const setToken = (token) => {
  localStorage.setItem('admin_token', token);
};

const getToken = () => {
  return localStorage.getItem('admin_token');
};

const removeToken = () => {
  localStorage.removeItem('admin_token');
};

// Axios interceptor - her istekte token'ı ekle
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - 403 hatası gelirse token'ı sil
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      removeToken();
    }
    return Promise.reject(error);
  }
);

/**
 * Yeni bir yorum taslağı üretmek için backend'e istek gönderir.
 */
export const generateComment = async (videoUrl, language) => {
  const response = await axios.post(`${API_URL}/generate_comment`, {
    video_url: videoUrl,
    language: language,
    comment_style: 'default' 
  });
  return response.data.generated_text;
};

/**
 * Üretilen yorumu YouTube'a gönderir.
 */
export const postCommentToYouTube = async (videoUrl, commentText) => {
  const response = await axios.post(`${API_URL}/post_comment`, {
    video_url: videoUrl,
    comment_text: commentText
  });
  return response.data;
};

/**
 * Kaydedilmiş tüm yorum geçmişini getirir.
 */
export const getHistory = async () => {
  const response = await axios.get(`${API_URL}/history`);
  return response.data.history;
};

// --- ADMIN PANELİ - REKLAM FONKSİYONLARI ---

export const getAds = async () => {
  const response = await axios.get(`${API_URL}/admin/ads`);
  return response.data;
};

export const createAd = async (adData) => {
  const response = await axios.post(`${API_URL}/admin/ads`, adData);
  return response.data;
};

export const deleteAd = async (adId) => {
  const response = await axios.delete(`${API_URL}/admin/ads/${adId}`);
  return response.data;
};

export const toggleAdStatus = async (adId) => {
  const response = await axios.put(`${API_URL}/admin/ads/${adId}/toggle`);
  return response.data;
};

// --- ADMIN GİRİŞ FONKSİYONLARI ---

export const adminLogin = async (password) => {
  const response = await axios.post(`${API_URL}/admin/login`, { password });
  if (response.data.token) {
    setToken(response.data.token);
  }
  return response.data;
};

export const adminLogout = async () => {
  removeToken();
  const response = await axios.post(`${API_URL}/admin/logout`);
  return response.data;
};

export const checkAdminAuth = async () => {
  const token = getToken();
  if (!token) {
    return { is_admin: false };
  }
  const response = await axios.get(`${API_URL}/admin/check_auth`);
  return response.data;
};