import { useEffect, useState } from 'react';
import api from '../api/apiService';
import WriteBlog from './WriteBlog';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Calendar,
  X,
  User,
  Tag,
  Clock,
  Heart,
  Share2,
  BookOpen,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

const BlogPage = ({ onWriteBlog }) => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showWriteForm, setShowWriteForm] = useState(false);

  const categories = ['Skincare Tips', 'Hair Care', "Doctor's Advice", "Trending", "Guides"];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blogs');
      setBlogs(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setLoading(false);
    }
  };

  // Open preview modal
  const openPreviewModal = (blog) => {
    setSelectedBlog(blog);
    setPreviewModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close preview modal
  const closePreviewModal = () => {
    setPreviewModalOpen(false);
    setSelectedBlog(null);
    document.body.style.overflow = 'auto';
  };

  // Open edit modal
  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setEditModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedBlog(null);
    document.body.style.overflow = 'auto';
  };

  // Open delete modal
  const openDeleteModal = (blog) => {
    setSelectedBlog(blog);
    setDeleteModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedBlog(null);
    document.body.style.overflow = 'auto';
  };

  // Handle blog update
  const handleUpdateBlog = async (blogId, formData) => {
    try {
      setUpdateLoading(true);
      const response = await api.put(`/blogs/${blogId}`, formData);
      
      if (response.data.success) {
        // Update the blog in the local state
        setBlogs(prevBlogs => 
          prevBlogs.map(blog => 
            blog.id === blogId ? { ...blog, ...formData } : blog
          )
        );
        toast.success('Blog updated successfully!');
        closeEditModal();
      } else {
        toast.error('Failed to update blog');
      }
    } catch (err) {
      console.error('Error updating blog:', err);
      toast.error('Error updating blog. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle blog delete
  const handleDeleteBlog = async (blogId) => {
    try {
      setDeleteLoading(true);
      const response = await api.delete(`/blogs/${blogId}`);
      
      if (response.data.success) {
        // Remove the blog from the local state
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId));
        toast.success('Blog deleted successfully!');
        closeDeleteModal();
      } else {
        toast.error('Failed to delete blog');
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      toast.error('Error deleting blog. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredPosts = blogs.filter(post => {
    const title = post.title || '';
    const content = post.content || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' ? true : post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPosts = (blogs || []).length;
  const publishedPosts = (blogs || []).filter(p => p.status === 'published').length;
  const draftPosts = (blogs || []).filter(p => p.status === 'draft').length;

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Preview Modal Component
  const PreviewModal = ({ blog, onClose }) => {
    if (!blog) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="flex min-h-full items-center justify-end p-4">
          <div className="relative bg-white w-full max-w-sm md:max-w-4xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Blog Preview</h2>
                  <p className="text-sm text-gray-500">Preview your blog post</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Blog Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(blog.status)}`}>
                    {blog.status}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} /> {blog.date || new Date().toLocaleDateString()}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Tag size={12} /> {blog.category}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {blog.author?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{blog.author || 'Admin'}</p>
                      <p className="text-xs text-gray-500">Content Writer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye size={16} />
                      <span className="text-sm">{blog.views || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Heart size={16} />
                      <span className="text-sm">{blog.likes || 0} likes</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Share2 size={16} />
                      <span className="text-sm">{blog.shares || 0} shares</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {blog.image && (
                <div className="mb-8">
                  <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover rounded-xl" />
                </div>
              )}

              {/* Blog Content */}
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p className="text-lg font-medium text-gray-800">{blog.excerpt}</p>
                  <div dangerouslySetInnerHTML={{ __html: blog.content || '<p>Full content goes here...</p>' }} />
                </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                Close
              </button>
              <button 
                onClick={() => {
                  onClose();
                  openEditModal(blog);
                }}
                className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Edit size={16} /> Edit Post
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Edit Modal Component
  const EditModal = ({ blog, onClose }) => {
    if (!blog) return null;

    const [formData, setFormData] = useState({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category || categories[0],
      status: blog.status || 'draft',
      image: blog.image || '',
      tags: blog.tags || []
    });

    const [tagInput, setTagInput] = useState('');

    const addTag = () => {
      if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
        setTagInput('');
      }
    };

    const removeTag = (tagToRemove) => {
      setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      await handleUpdateBlog(blog.id, formData);
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="flex min-h-full items-center justify-end p-4">
          <div className="relative bg-white w-full max-w-sm md:max-w-3xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Blog Post</h2>
                <p className="text-sm text-gray-500 mt-1">Update your blog content</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter blog title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="flex gap-3">
                    {['draft', 'published', 'scheduled'].map(status => (
                      <label key={status} className="flex items-center gap-2">
                        <input
                          type="radio"
                          value={status}
                          checked={formData.status === status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img src={formData.image} alt="Preview" className="h-32 w-auto rounded-lg object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
                  <textarea
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Brief summary of the blog post"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                  <textarea
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                    placeholder="Write your blog content here..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Add a tag and press Enter"
                    />
                    <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-purple-900">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updateLoading && <Loader size={16} className="animate-spin" />}
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Delete Modal Component
  const DeleteModal = ({ blog, onClose }) => {
    if (!blog) return null;

    const handleDelete = async () => {
      await handleDeleteBlog(blog.id);
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="flex min-h-full items-center justify-end p-4">
          <div className="relative bg-white w-full max-w-sm md:max-w-md rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Delete Blog Post</h2>
                <p className="text-sm text-gray-500 mt-1">Remove this content</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Are you sure?
              </h3>
              <p className="text-gray-500 text-center mb-4">
                You are about to delete "<span className="font-semibold text-gray-700">{blog.title}</span>"
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  ⚠️ Warning: This action cannot be undone. The post will be permanently deleted.
                </p>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Post Details:</p>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li>• Status: {blog.status}</li>
                  <li>• Category: {blog.category}</li>
                  <li>• Published: {blog.date || 'Not published yet'}</li>
                  <li>• Views: {blog.views || 0}</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteLoading && <Loader size={16} className="animate-spin" />}
                {deleteLoading ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
          <p className="text-gray-500 text-sm">Manage your content and articles</p>
        </div>
        <button 
          onClick={() => setShowWriteForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
        >
          <Plus size={18} /> Write New Post
        </button>
      </div>

      {showWriteForm && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-6 animate-in slide-in-from-bottom-4 duration-500">
          <WriteBlog 
            onCancel={() => setShowWriteForm(false)} 
            onSuccess={() => {
              setShowWriteForm(false);
              fetchBlogs();
            }} 
          />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Total Posts</p><p className="text-3xl font-bold">{totalPosts}</p></div>
            <div className="bg-purple-100 p-3 rounded-full"><FileText size={24} className="text-purple-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Published</p><p className="text-3xl font-bold text-green-600">{publishedPosts}</p></div>
            <div className="bg-green-100 p-3 rounded-full"><CheckCircle size={24} className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Drafts</p><p className="text-3xl font-bold text-amber-600">{draftPosts}</p></div>
            <div className="bg-amber-100 p-3 rounded-full"><FileText size={24} className="text-amber-600" /></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg bg-white">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg bg-white">
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="text-sm text-gray-500">Showing {filteredPosts.length} posts</div>
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(post.status)}`}>{post.status}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                  <span className="text-xs text-gray-500">{post.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span>Author: {post.author}</span>
                  <span>👁️ {post.views} views</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openPreviewModal(post)}
                  className="px-3 py-1.5 text-gray-600 hover:text-purple-600 border border-gray-200 rounded-lg text-sm flex items-center gap-1 cursor-pointer transition"
                >
                  <Eye size={14} /> Preview
                </button>
                <button 
                  onClick={() => openEditModal(post)}
                  className="px-3 py-1.5 text-gray-600 hover:text-purple-600 border border-gray-200 rounded-lg text-sm flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit size={14} /> Edit
                </button>
                <button 
                  onClick={() => openDeleteModal(post)}
                  className="px-3 py-1.5 text-gray-600 hover:text-red-600 border border-gray-200 rounded-lg text-sm cursor-pointer transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewModalOpen && (
        <PreviewModal blog={selectedBlog} onClose={closePreviewModal} />
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <EditModal blog={selectedBlog} onClose={closeEditModal} />
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <DeleteModal blog={selectedBlog} onClose={closeDeleteModal} />
      )}
    </div>
  );
};

export default BlogPage;