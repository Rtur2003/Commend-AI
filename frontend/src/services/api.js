import axios from 'axios';

// Backend sunucumuzun ana adresi
const API_URL = 'http://127.0.0.1:5000/api';

/**
 * Yeni bir yorum taslağı üretmek için backend'e istek gönderir.
 * @param {string} videoUrl - YouTube video URL'si.
 * @param {string} language - Yorumun üretileceği dil.
 * @returns {Promise<string>} Üretilen yorum metni.
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
 * @param {string} videoUrl - YouTube video URL'si.
 * @param {string} commentText - Gönderilecek yorum metni.
 * @returns {Promise<object>} YouTube API'sinden dönen cevap.
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
 * @returns {Promise<Array>} Yorum nesnelerinden oluşan dizi.
 */
export const getHistory = async () => {
  const response = await axios.get(`${API_URL}/history`);
  return response.data.history;
};