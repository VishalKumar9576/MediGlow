import { useState } from 'react';
import api from '../api/apiService';
import { FileText, Save, X, Image as ImageIcon, Send } from 'lucide-react';

const WriteBlog = ({ onCancel, onSuccess }) => {
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    category: 'Skincare Tips',
    author: 'Admin',
    status: 'draft',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/blogs', blog);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FileText size={20} className="text-blue-600" /> Create New Blog Post
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Article Title *</label>
            <input
              type="text"
              required
              value={blog.title}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              placeholder="e.g. 10 Best Sunscreens for Indian Skin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select
              value={blog.category}
              onChange={(e) => setBlog({ ...blog, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition cursor-pointer"
            >
              <option value="Skincare Tips">Skincare Tips</option>
              <option value="Hair Care">Hair Care</option>
              <option value="Trending">Trending</option>
              <option value="Guides">Guides</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status *</label>
            <select
              value={blog.status}
              onChange={(e) => setBlog({ ...blog, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition cursor-pointer"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Featured Image URL</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={blog.image_url}
                onChange={(e) => setBlog({ ...blog, image_url: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                placeholder="https://example.com/featured-image.png"
              />
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {blog.image_url ? (
                  <img src={blog.image_url} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon size={16} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content *</label>
            <textarea
              required
              rows={8}
              value={blog.content}
              onChange={(e) => setBlog({ ...blog, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              placeholder="Write your article content here..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : <><Send size={16} /> Create Article</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteBlog;
