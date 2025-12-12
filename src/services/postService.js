import { db } from '../utils/dataManager';

// 配置后端 API 地址
const API_URL = 'http://localhost:7894/api/posts';

export const postService = {
  // 获取所有文章
  getAllPosts: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('✅ [Data] Loaded from Backend API');
      return data;
    } catch (error) {
      console.warn('⚠️ [Data] Backend unavailable, using LocalStorage fallback');
      return db.getPosts();
    }
  },

  // 根据 Slug 获取文章
  getPostBySlug: async (slug) => {
    try {
      const response = await fetch(`${API_URL}/${slug}`);
      if (!response.ok) throw new Error('Post not found');
      return await response.json();
    } catch (error) {
      return db.getPostBySlug(slug);
    }
  },

  // 保存文章
  savePost: async (postData) => {
    try {
      console.log('📤 [Data] Attempting to save to Backend...');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) throw new Error('Save failed');
      
      // 同时更新本地缓存，确保体验一致性
      db.savePost(postData);
      console.log('✅ [Data] Saved to Backend & LocalStorage');
      
      return await response.json();
    } catch (error) {
      console.error('❌ [Data] Save to Backend failed:', error);
      console.warn('⚠️ [Data] Saving ONLY to LocalStorage');
      return db.savePost(postData);
    }
  }
};
