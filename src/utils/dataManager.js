import { INITIAL_POSTS, INITIAL_CHAT } from './mockData';

// Helper to map local asset paths to Unsplash for demo purposes
const mapImage = (path, keyword) => {
  if (path.startsWith('http')) return path;
  const key = keyword || path.split('/').pop().replace(/\.[^/.]+$/, "");
  return `https://www.weavefox.cn/api/bolt/unsplash_image?keyword=${encodeURIComponent(key)},tech&width=800&height=450&random=${key}`;
};

// Simple Frontmatter Parser
const parseFrontmatter = (content) => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {}, body: content };
  }

  const metadata = {};
  const frontmatterLines = match[1].split('\n');
  
  frontmatterLines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      let value = valueParts.join(':').trim();
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      // Parse arrays like ["a", "b"]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/"/g, ''));
      }
      metadata[key.trim()] = value;
    }
  });

  return {
    metadata,
    body: content.replace(frontmatterRegex, '').trim()
  };
};

class DataManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('wyper_posts')) {
      const parsedPosts = INITIAL_POSTS.map(post => {
        const { metadata, body } = parseFrontmatter(post.content);
        return {
          ...metadata,
          slug: post.slug,
          cover: mapImage(metadata.cover, metadata.tags?.[0] || 'tech'),
          content: body,
          raw: post.content
        };
      });
      localStorage.setItem('wyper_posts', JSON.stringify(parsedPosts));
    }

    if (!localStorage.getItem('wyper_chat')) {
      localStorage.setItem('wyper_chat', JSON.stringify(INITIAL_CHAT));
    }
  }

  getPosts() {
    return JSON.parse(localStorage.getItem('wyper_posts') || '[]');
  }

  getPostBySlug(slug) {
    const posts = this.getPosts();
    return posts.find(p => p.slug === slug);
  }

  savePost(postData) {
    const posts = this.getPosts();
    const existingIndex = posts.findIndex(p => p.slug === postData.slug);
    
    // Parse content to update metadata
    const { metadata, body } = parseFrontmatter(postData.content);
    const newPost = {
      ...metadata,
      slug: postData.slug,
      cover: mapImage(metadata.cover || '/assets/default.jpg', metadata.tags?.[0]),
      content: body,
      raw: postData.content
    };

    if (existingIndex >= 0) {
      posts[existingIndex] = newPost;
    } else {
      posts.unshift(newPost);
    }
    
    localStorage.setItem('wyper_posts', JSON.stringify(posts));
    return newPost;
  }

  getChatMessages() {
    return JSON.parse(localStorage.getItem('wyper_chat') || '[]');
  }

  addChatMessage(msg) {
    const chats = this.getChatMessages();
    const newMsg = {
      id: Date.now(),
      time: new Date().toISOString(),
      ...msg
    };
    chats.push(newMsg);
    // Keep only last 50 messages
    if (chats.length > 50) chats.shift();
    localStorage.setItem('wyper_chat', JSON.stringify(chats));
    return chats;
  }
}

export const db = new DataManager();
