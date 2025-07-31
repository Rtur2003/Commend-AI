import axios from 'axios';

// Bu satır, tüm axios isteklerine otomatik olarak 'login session' cookie'sini ekler.
axios.defaults.withCredentials = true;

// Backend sunucumuzun ana adresi
const API_URL = 'http://127.0.0.1:5000/api';

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

// --- ADMİN PANELİ - REKLAM FONKSİYONLARI ---

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
const response = await axios.put(`${API_URL}/admin/ads/${adId}/toggle`, {}, { withCredentials: true });
  return response.data;
};

// --- YENİ EKLENEN ADMİN GİRİŞ FONKSİYONLARI ---

export const adminLogin = async (password) => {
  const response = await axios.post(`${API_URL}/admin/login`, { password });
  return response.data;
};

export const adminLogout = async () => {
  const response = await axios.post(`${API_URL}/admin/logout`, {});
  return response.data;
};

export const checkAdminAuth = async () => {
  const response = await axios.get(`${API_URL}/admin/check_auth`);
  return response.data;
};